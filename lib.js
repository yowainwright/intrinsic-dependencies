import { readFileSync } from 'fs'
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const log = logger({ file: 'index.js' });

export function checkIntrinsicDependencies({ filePath = './package.json', configPath = '' }) {
  let missingDeps = [];
  try {
    const resolvedFilePath = resolve(__dirname, filePath);
    const resolvedConfigPath = configPath ? resolve(__dirname, configPath) : '';
    const json = resolveJSON(resolvedFilePath);
    const deps = json?.dependencies || {};
    const devDeps = json?.devDependencies || {};
    const resolvedDeps = Object.assign({}, deps, devDeps);
    const intrinsicDeps = configPath ? resolveJSON(resolvedConfigPath) : json?.intrinsicDependencies || {};
    const resolvedDepsList = Object.keys(resolvedDeps);
    const intrinsicDepsList = Object.keys(intrinsicDeps);
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
    missingDeps = intrinsicDepsList.filter(dep =>!resolvedDepsList.includes(dep));
    return {
      hasExpectedDeps: false,
      missingDeps,
    }
  }
}

export function cli(process) {
  const { filePath, configPath } = processArgs(process);
  const { hasExpectedDeps, missingDeps } = checkDependencies({ filePath, configPath });

  if (hasExpectedDeps) {
    log.info('✅ All intrinsic dependencies are present!');
    return;
  }
  log.error('❌ Missing intrinsic dependencies!', { missingDeps });
  process.exit(1);
}

export function processArgs(process) {
  const args = process.argv.slice(2);
  return {
    filePath: parseArg(args, 'filePath', './package.json'),
    configPath: parseArg(args, 'configPath'),
    debug: args.includes('--debug')
  };
}

export function resolveJSON(path) {
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

export const parseArg = (args, arg, defaultValue = '') =>
  args.find(arg => arg.startsWith(`--${arg}=`))?.replace(`--${arg}=`, '') || defaultValue;
