import chalk from "chalk";
import { H3Event } from "h3";
import moment from "moment";
import { App } from "../services/app";
import { UserService } from "../services/user/service";

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("request", (event) => {
    event.context.startAt = new Date().getTime();
  });

  nitro.hooks.hook("afterResponse", async (event) => {
    await printLog(event);
  });
});

async function printLog(event: H3Event) {
  const queryCost = new Date().getTime() - event.context.startAt;

  let user = await App.instance.services.getService(UserService).getUser(event);
  let status = getResponseStatus(event);

  console.info(
    chalk.bgWhite(` ${moment().format("h:mm:ss A")} `),
    chalk.dim(getRequestIP(event, { xForwardedFor: true })),
    user ? chalk.dim(user?.name) : chalk.cyan("未登录"),
    chalk.bgCyan(` ${event.method} ${status} `),
    decodeURIComponent(event.path),
    chalk.dim(queryCost, "ms"),
  );
}
