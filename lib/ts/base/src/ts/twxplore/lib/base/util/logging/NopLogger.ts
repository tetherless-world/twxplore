import {Logger} from "./Logger";

export class NopLogger implements Logger {
  debug(msg: any) {}

  info(msg: any) {}

  warn(msg: any) {}

  error(msg: any) {}
}
