import { App } from "../services/app";

export default defineNitroPlugin((nitroApp) => {
  new App();
});
