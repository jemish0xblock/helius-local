import { consoleLog } from "./console.logger";

export type Log = {
  slug?: string;
  route?: string;
  type?: "error" | "warning" | "info";
  body?: unknown;
};

export type LogSystem = (_data: Log) => void;

export const log: LogSystem = (data) => {
  consoleLog(data);
};
