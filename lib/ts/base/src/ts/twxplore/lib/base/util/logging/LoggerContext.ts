import {ConsoleLogger} from "./ConsoleLogger";
import {Logger} from "./Logger";
import * as React from "react";
import {Environment} from "../../Environment";
import {NopLogger} from "./NopLogger";

export const LoggerContext = React.createContext<Logger>(
  Environment.development ? new ConsoleLogger() : new NopLogger()
);
