import { TRPCError } from "@trpc/server";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { publicProcedure, router } from "../../trpc";

export const userRouter = router({
  infoCard: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "用户未登录",
      });
    }

    let avatarUrl = user.avatarUrl;
    if (!avatarUrl && user.avatarFileId) {
      const storageIndex = await App.instance.prisma.storageIndex.findUnique({
        where: {
          id: user.avatarFileId,
        },
      });
      if (storageIndex) {
        avatarUrl = await App.instance.services
          .getService(StorageService)
          .getFileTempUrl(storageIndex);
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: avatarUrl,
    };
  }),
});
