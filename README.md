# Intrinsic Dependencies

#### A utility for ensuring invisible _but required_ dependencies aren\'t removed.

Often **\*invisible** JavaScript dependencies are required for a project to work.

> You may be reviewing dependencies for security or performance reasons and see a dependencies which appears to be unneeded. You remove the dependency and suddenly your project is broken. This problem can be fatal—for example, if the dependency is required for something specific to production.

The solution is simple—just a few functions. However, it can be difficult to remember to add these functions to your project. And, this issue usual doesn't come up unless you have a big work project. That's where Intrinsic Dependencies comes in. Just add the cli to your npm scripts and you're good to go. Intrinsic Dependencies fails or passes with a log of dependencies that are required. That's it.

## Installation

```sh
npm install intrinsic-dependencies -save-dev
```

This should never be a dependence! Just use it.

## Usage

As a cli (recommended)

```sh
intrinsic-dep-check
```

As a function

```js
import { checkIntrinsicDependencies } from 'intrinsic-dependencies';

checkIntrinsicDependencies();
```

See below for more usage details.

---

## Cli

Intrinsic Dependencies can be invoked via a few cli names.

```sh
intrinsic-dep-check
# other options
# intrinsic-dependencies
# intrinsic-deps
```

The cli also accepts 2 options, `--filePath` and `--configPath`. These options can be used to specify a custom path for the `package.json` or an optional json formated `config` file.

```sh
intrinsic-dep-check --filePath /path/to/package.json --configPath /path/to/config.json
```
---

## Node

This

---

## Recipe


---

## Details
