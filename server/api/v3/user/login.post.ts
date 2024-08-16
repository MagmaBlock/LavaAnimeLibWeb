import { z } from "zod";
import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";

export default defineEventHandler(async (event) => {
  const { account, password } = await readBody(event);

  const login = await App.instance.services
    .getService(UserService)
    .login(z.string().parse(account), z.string().parse(password));

  return { token: login.token };
});
