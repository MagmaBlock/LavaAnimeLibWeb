import { App } from "~/server/services/app";
import { InviteCodeService } from "~/server/services/invite-code/service";
import { UserService } from "~/server/services/user/service";

const app = new App();

const newInviteCode = await app.services
  .getService(InviteCodeService)
  .create("HELLOWORLD");

const newUser = await app.services
  .getService(UserService)
  .register("admin@lavanime.com", "Admin", "12345678", "HELLOWORLD");
