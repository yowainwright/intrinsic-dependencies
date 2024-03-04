import { readFileSync } from 'fs'
import { dirname, resolve } from 'path';
import { config } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function checkIntrinsicDependencies({ filePath = './package.json', configPath = '', root = __dirname, log = logger({ file: 'lib.js' }) } = {}) {
  let resolvedDepsList = [];
  let intrinsicDepsList = [];
  let missingDeps = [];
  try {
    const resolvedFilePath = resolve(root, filePath);
    const json = resolveJSON(resolvedFilePath);
    const deps = json?.dependencies || {};
    const devDeps = json?.devDependencies || {};
    const resolvedDeps = Object.assign({}, deps, devDeps);
    resolvedDepsList = Object.keys(resolvedDeps);
    if (!configPath) {
      const intrinsicDeps = json?.intrinsicDependencies || {};
      intrinsicDepsList = Object.keys(intrinsicDeps);
    } else {
      const resolvedConfigPath = resolve(root, configPath);
      const configjson = resolveJSON(resolvedConfigPath);
      const intrinsicDeps = configjson || {};
      intrinsicDepsList = Object.keys(intrinsicDeps);
    }
    if (!intrinsicDepsList) {
      log.info("🔎 no intrinsic dependencies detected", 'checkDependencies');
      return {
        hasExpectedDeps: true,
        missingDeps,
      };
    }
    const hasExpectedDeps = intrinsicDepsList.every(dep => resolvedDepsList.includes(dep));
    if (!hasExpectedDeps) throw new Error("missing required intrinsic dependencies");
    return {
      hasExpectedDeps,
      missingDeps,
    }
  } catch (error) {
    missingDeps = intrinsicDepsList.filter(dep => !resolvedDepsList.includes(dep));
    return {
      hasExpectedDeps: false,
      missingDeps,
    }
  }
}

export function cli(process, log = logger({ file: 'lib.js' })) {
  const { filePath, configPath } = processArgs(process);
  const { hasExpectedDeps, missingDeps } = checkIntrinsicDependencies({ filePath, configPath });

  if (hasExpectedDeps) {
    log.info('✅ All intrinsic dependencies are present!');
    return;
  }
  log.error('❌ Missing intrinsic dependencies!', { missingDeps });
  process.exit(1);
}

export function processArgs(process) {
  const args = process.argv.slice(2);
  const filePath = parseArg(args, 'filePath', './package.json');
  const configPath = parseArg(args, 'configPath');
  const debug = args.includes('--debug');
  return { filePath, configPath, debug };
}

export function resolveJSON(path, log = logger({ file: 'lib.js' })) {
  try {
    const file = readFileSync(path, "utf8");
    const json = JSON.parse(file);
    return json;
  } catch (error) {
    log.error("🔎 no config found", 'resolveJSON', { error });
    throw error;
  }
}

export const logger = ({ file, name = 'intrinsic dependencies' }) => ({
  error: (msg, caller, ...args) => {
    const callerTxt = caller ? `[${caller}]` : "";
    const prefix = `${name}[${file}]${callerTxt}`
    if (args) console.error(`${prefix} ${msg}`, ...args);
    else console.error(`${prefix} ${msg}`);
  },
  info: (msg, caller, ...args) => {
    const callerTxt = caller ? `[${caller}]` : "";
    const prefix = `${name}[${file}]${callerTxt}`;
    if (args) console.info(`${prefix} ${msg}`, ...args);
    else console.info(`${prefix} ${msg}`);
  }
});
export const parseArg = (args, argName, defaultValue = '') => {
  const argPrefix = `--${argName}`;
  const arg = args.find(arg => arg.startsWith(argPrefix));
  if (!arg) return defaultValue;
  const argParts = arg.includes('=') ? arg.split('=') : arg.split(' ');
  if (argParts.length === 2) return argParts[1];
  else if (argParts.length > 2) {
    argParts.shift();
    return argParts.join(' ');
  }
};
