import { App } from "~/server/services/app";
import { UserService } from "~/server/services/user/service";

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  const userService = App.instance.services.getService(UserService);
  const user = await userService.assertUser(event);
  return {
    ...(await userService.changePassword(user.id, password)),
    password: undefined,
  };
});
