import { z } from "zod";
import { App } from "~/server/services/app";
import { InviteCodeService } from "~/server/services/invite-code/service";
import { adminProcedure, router } from "~/server/trpc/trpc";
import { InviteCode } from "@prisma/client";
import { prisma } from "~/server/src/context/prisma";

const inviteCodeService = App.instance.services.getService(InviteCodeService);

export const adminInviteCodeRouter = router({
  createInviteCode: adminProcedure
    .input(
      z.object({
        code: z.string().optional(),
        expiredAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { code, expiredAt } = input;
      const userId = ctx.user.id;
      return await inviteCodeService.create({
        code,
        expiredAt,
        createdById: userId,
      });
    }),

  createManyInviteCodes: adminProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        expiredAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { amount, expiredAt } = input;
      const userId = ctx.user.id;
      return await inviteCodeService.createMany({
        amount,
        expiredAt,
        createdById: userId,
      });
    }),

  getInviteCodes: adminProcedure
    .input(z.object({}))
    .query(async (): Promise<InviteCode[]> => {
      return await prisma.inviteCode.findMany({
        orderBy: { createdAt: "desc" },
      });
    }),

  deleteInviteCode: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const inviteCode = await prisma.inviteCode.findUnique({
        where: { code: input },
      });

      if (!inviteCode) {
        throw new Error("邀请码不存在");
      }

      if (inviteCode.usedById !== null) {
        throw new Error("该邀请码已被使用，无法删除");
      }

      return await prisma.inviteCode.delete({
        where: { code: input },
      });
    }),
});
