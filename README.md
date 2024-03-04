# Intrinsic Dependencies

#### A utility for ensuring invisible _but required_ dependencies aren\'t removed.

---

#### Scenario

> You may be reviewing dependencies for security or performance reasons and see a dependencies which appears to be unneeded. You remove the dependency and suddenly your project is broken. This problem can be fatal—for example, if the dependency is required for something specific to production.

The solution is just a few functions. However, it can be difficult to remember to add these functions to your project. And, this issue usually doesn't come up unless you have a big work project.

That's where **Intrinsic Dependencies** comes in. Just add the cli to your npm scripts and you're good to go! Intrinsic Dependencies fails or passes with a log of dependencies that are required. That's it.

---

#### Solution Overview

Add your "intrinsic dependencies" in a object to your `package.json` with notes like so:

```json
{
  "intrinsicDependencies": {
    "dockerode": "Referenced during production deployment. Production will fail if removed!",
  }
}
```

And then add a command to your node scripts to run in your ci (or where ever):

```json
"scripts": {
  "prod-check": "intrinsic-dep-check"
}
```

Now, `intrinsic-dep-check` will fail (fail your ci) if a required intrinsic dependency is removed.

---

## Installation

```sh
npm install intrinsic-dependencies -save-dev
```

This should never be a dependency! Just use it as a dev dependency. Or better yet, with npx.

## Usage

As a cli (recommended)

```sh
intrinsic-dep-check
```

As a node function

```js
import { checkIntrinsicDependencies } from 'intrinsic-dependencies';

checkIntrinsicDependencies();
```

See below for more usage details.

---

### Cli

Intrinsic Dependencies can be invoked via a few cli names; clearest is `intrinsic-dep-check`. See the `package.json` bin object for reference.

The cli also accepts 2 options (not required), `--filePath` and `--configPath`. These options can be used to specify a custom path for the `package.json` or an optional json formated `config` file.

```sh
intrinsic-dep-check --filePath /path/to/package.json --configPath /path/to/config.json
```
---

### Node

You can use Intrinsic Dependencies as a node function as well.

```js
import { checkIntrinsicDependencies } from 'intrinsic-dependencies';

checkIntrinsicDependencies();
```

This function also accepts 2 options (not required), `filePath` and `configPath`. These options can be used to specify a custom path for the `package.json` or an optional json formated `config` file.

```js
import { checkIntrinsicDependencies } from 'intrinsic-dependencies';

checkIntrinsicDependencies({ filePath: '/path/to/package.json', configPath: '/path/to/config.json' });
```

---

## Details

This project was intentionally made with "just node"; no Typescript.
This keeps the project pure, small, and as close to "just node" as possible.

For development, esbuild, prettier and eslint are used because no similar functionality is provided by "just node".
