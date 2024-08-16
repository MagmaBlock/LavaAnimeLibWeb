import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";

export default defineEventHandler(async (event) => {
  const { email, name, password, inviteCode } = await readBody(event);
  const userService = App.instance.services.getService(UserService);

  const register = await userService.register(
    email,
    name,
    password,
    inviteCode
  );

  return { token: userService.signTokenByUserId(register.id) };
});
