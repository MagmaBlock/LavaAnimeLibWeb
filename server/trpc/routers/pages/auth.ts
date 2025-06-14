import { z } from "zod";
import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";
import { publicProcedure, router } from "../../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        account: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { account, password } = input;

      const userService = App.instance.services.getService(UserService);
      const loginResult = await userService.login(account, password);

      return {
        message: "登录成功",
        data: {
          token: loginResult.token,
          user: {
            id: loginResult.user.id,
            email: loginResult.user.email,
            name: loginResult.user.name,
            createdAt: loginResult.user.createdAt,
            settings: loginResult.user.settings,
            role: loginResult.user.role,
          },
        },
      };
    }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(),
        inviteCode: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, name, password, inviteCode } = input;

      const userService = App.instance.services.getService(UserService);
      const user = await userService.register(
        email,
        name,
        password,
        inviteCode,
      );

      const token = userService.signTokenByUserId(user.id);

      return {
        message: "注册成功",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            settings: user.settings,
            role: user.role,
          },
        },
      };
    }),
});
