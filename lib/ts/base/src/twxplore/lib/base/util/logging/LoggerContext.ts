import {Logger} from "./Logger";
import * as React from "react";
import {NopLogger} from "./NopLogger";

export const LoggerContext = React.createContext<Logger>(new NopLogger());
