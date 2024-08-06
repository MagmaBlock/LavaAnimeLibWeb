import log4js from "log4js";

log4js.configure({
  appenders: {
    stdout: { type: "stdout" },
    file: {
      type: "file",
      filename: "log/app.log",
      maxLogSize: "5m",
      compress: true,
      backups: 10,
    },
  },
  categories: {
    default: { appenders: ["stdout", "file"], level: "trace" },
    http: { appenders: ["stdout", "file"], level: "trace" },
  },
});

export const logger = log4js.getLogger();
export const httpLogger = log4js.getLogger("http");
