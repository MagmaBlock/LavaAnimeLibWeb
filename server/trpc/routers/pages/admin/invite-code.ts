import { z } from "zod";
import { App } from "~/server/services/app";
import { InviteCodeService } from "~/server/services/invite-code/service";
import { adminProcedure, router } from "~/server/trpc/trpc";

const inviteCodeService = App.instance.services.getService(InviteCodeService);

export const inviteCodeRouter = router({
  createInviteCode: adminProcedure
    .input(
      z.object({
        code: z.string().optional(),
        expiredAt: z.date().optional(),
      })
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
      })
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
    .input(
      z.object({
        take: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { take, skip } = input;
      return await App.instance.prisma.inviteCode.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true,
          usedBy: true,
        },
      });
    }),

  deleteInviteCodes: adminProcedure
    .input(z.array(z.string()).default([]))
    .mutation(async ({ input }) => {
      if (input.length === 0) {
        throw new Error("至少需要提供一个邀请码");
      }
      return await App.instance.prisma.inviteCode.deleteMany({
        where: { code: { in: input } },
      });
    }),
});
