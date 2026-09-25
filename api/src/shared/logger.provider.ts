import { Provider } from "@nestjs/common";
import {
  createLogger,
  format,
  transports,
  Logger,
  config as winstonConfig,
} from "winston";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as LokiTransport from "winston-loki";

import config from "../config/configuration";
import { LOGGER } from "./constants";

export type AppLogger = Logger;

export const loggingProvider: Provider = {
  provide: LOGGER,
  useFactory() {
    const { app, isDev, grafana, env } = config();

    const logger = createLogger({
      level: isDev() ? "debug" : "info",
      format: format.combine(
        format.timestamp(),
        format.simple(),
        format.errors({ stack: true }),
      ),
      defaultMeta: {
        app: app.slug,
        env,
      },
    });
    if (isDev() || !grafana.lokiHost) {
      logger.add(new transports.Console({ format: format.simple() }));
    } else {
      logger.add(
        new LokiTransport({
          host: grafana.lokiHost,
          json: true,
          labels: { service: app.slug, app: app.name, env },
        }),
      );
    }

    const winstonLog = logger.log;

    logger.log = (...params) => {
      if (!Object.keys(winstonConfig.npm.levels).includes(params[0])) {
        params.unshift("info");
      }

      return winstonLog.bind(logger)(...params);
    };

    return logger;
  },
};
