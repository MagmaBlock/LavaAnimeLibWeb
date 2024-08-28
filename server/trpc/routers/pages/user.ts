import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { protectedProcedure, router } from "../../trpc";

export const userRouter = router({
  infoCard: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

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
