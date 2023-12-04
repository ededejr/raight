export type ILogger = {
  info(message: string): Promise<void>;
  warn(message: string): Promise<void>;
  debug(message: string): Promise<void>;
  error(message: string): Promise<void>;
  trace(message: string): Promise<void>;
};

(async () => {
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      log.trace("session ended");
    });
  }
})();

const loggers = new Map<any, ILogger>();

const log = {
  info: (...args: Parameters<typeof console.log>) =>
    console.log("info:", ...args),
  warn: (...args: Parameters<typeof console.warn>) =>
    console.warn("warn:", ...args),
  debug: (...args: Parameters<typeof console.debug>) =>
    console.debug("debug:", ...args),
  error: (...args: Parameters<typeof console.error>) =>
    console.error("error:", ...args),
  trace: (...args: Parameters<typeof console.trace>) =>
    console.trace("trace:", ...args),
} as ILogger;

export class Logger implements ILogger {
  constructor(private namespace: string) {}

  async info(message: string) {
    log.info(`[${this.namespace}] ${message}`);
  }

  async warn(message: string) {
    log.warn(`[${this.namespace}] ${message}`);
  }

  async debug(message: string) {
    log.debug(`[${this.namespace}] ${message}`);
  }

  async error(message: string) {
    log.error(`[${this.namespace}] ${message}`);
  }

  async trace(message: string) {
    log.trace(`[${this.namespace}] ${message}`);
  }

  static create(namespace: string) {
    if (loggers.has(namespace)) {
      return loggers.get(namespace) as Logger;
    }
    const logger = new Logger(namespace);
    loggers.set(namespace, logger);
    return logger;
  }
}
