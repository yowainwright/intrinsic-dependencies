import { Process } from 'process';

interface CheckIntrinsicDependenciesOptions {
  filePath?: string;
  configPath?: string;
  root?: string;
  log?: ReturnType<typeof logger>;
}

interface DependencyCheckResult {
  hasExpectedDeps: boolean;
  missingDeps: string[];
}


export function checkIntrinsicDependencies(options?: CheckIntrinsicDependenciesOptions): DependencyCheckResult;

export function cli(process: NodeJS.Process, log: typeof logger): void;
export interface ProcessArgsResult {
  filePath: string;
  configPath?: string;
  debug: boolean;
}
export function parseArg(args: string[], key: string, defaultValue?: string): string | undefined;
export function processArgs(process: Process): ProcessArgsResult;

export function resolveJSON(jsonString: string): Promise<any>;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | string;
export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp?: Date;
  error?: Error;
}
export function logger(logObject: LogMessage): void;
export interface ProcessArgs {
  filePath: string;
  configPath?: string;
  debug: boolean;
}
export function parseArg(args: string[], key: string, defaultValue?: string): string | undefined;
export function processArgs(process: NodeJS.Process): ProcessArgs;
