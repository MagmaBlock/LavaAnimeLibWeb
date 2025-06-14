import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";
import { UserService } from "~/server/services/user/service";

export const userInfoRouter = router({
  avatar: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "用户未登录",
        });
      }

      try {
        const updatedUser = await App.instance.prisma.user.update({
          where: { id: ctx.user.id },
          data: { avatarUrl: input.url },
        });

        return {
          message: "头像更新成功",
          data: {
            avatarUrl: updatedUser.avatarUrl,
          },
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "头像更新失败",
        });
      }
    }),

  getAvatar: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "用户未登录",
      });
    }

    let avatarUrl = ctx.user.avatarUrl;
    if (!avatarUrl && ctx.user.avatarFileId) {
      const storageIndex = await App.instance.prisma.storageIndex.findUnique({
        where: {
          id: ctx.user.avatarFileId,
        },
      });
      if (storageIndex) {
        avatarUrl = await App.instance.services
          .getService(StorageService)
          .getFileTempUrl(storageIndex);
      }
    }

    return {
      avatarUrl: avatarUrl,
    };
  }),

  getChangeNameMeta: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "用户未登录",
      });
    }

    return {
      username: ctx.user.name,
      email: ctx.user.email,
    };
  }),

  updateUsername: publicProcedure
    .input(
      z.object({
        newName: z.string().min(1).max(30),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "用户未登录",
        });
      }

      try {
        const updatedUser = await App.instance.prisma.user.update({
          where: { id: ctx.user.id },
          data: { name: input.newName },
        });

        return {
          message: "用户名更新成功",
          data: {
            name: updatedUser.name,
          },
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "用户名更新失败",
        });
      }
    }),

  updatePassword: publicProcedure
    .input(
      z.object({
        newPassword: z.string().min(7).max(64),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "用户未登录",
        });
      }

      try {
        const userService = App.instance.services.getService(UserService);
        await userService.changePassword(ctx.user.id, input.newPassword);

        return {
          message: "密码更新成功",
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "密码更新失败",
        });
      }
    }),
});
