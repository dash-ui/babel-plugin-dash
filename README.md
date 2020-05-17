<hr>
<div align="center">
  <h1 align="center">
    babel-plugin-dash
  </h1>
</div>

<p align="center">
  <a aria-label="Code coverage report" href="https://codecov.io/gh/dash-ui/babel-plugin-dash">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/dash-ui/babel-plugin-dash?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.com/dash-ui/babel-plugin-dash">
    <img alt="Build status" src="https://img.shields.io/travis/com/dash-ui/babel-plugin-dash?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/babel-plugin-dash">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/babel-plugin-dash?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@dash-ui/babel-plugin-dash?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i babel-plugin-dash</pre>
<hr>

A babel plugin for [**dash-ui**](https://github.com/dash-ui).

## Features

- [x] Minifies styles defined by `styles()`, `styles.one()`, `styles.keyframes()`, and `styles.global()`
- [x] Minifies styles defined by [`@dash-ui/mq`](https://github.com/dash-ui/mq) instances
- [x] Transforms style objects to CSS strings for faster runtime compilation and better minification
- [x] Injects `/*#__PURE__*/` flag comments to mark `styles()` and `styles.one()` for dead code elimination

## Quick Start

Basic usage

```js
// babel.config.js
module.exports = {
  plugins: ['dash'],
}
```

With a custom styles instance

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'dash',
      {
        instances: {
          // Transforms based on the `default` export in `src/styles`
          // i.e. import styles from './styles'
          styles: ['./src/styles'],
          // Transforms based on the `default` export in `src/mq`
          // i.e. import mq from './mq'
          mq: ['./src/mq'],
        },
      },
    ],
  ],
}
```

With a custom styles instance and named export

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'dash',
      {
        instances: {
          // Transforms based on the `styles` export in `src/dash`
          // i.e. import {styles} from './dash'
          styles: {'./src/dash': 'styles'},
          // Transforms based on the `mq` export in `src/dash`
          // i.e. import {mq} from './dash'
          mq: {'./src/dash': 'mq'},
        },
      },
    ],
  ],
}
```

## Options

| Option    | Type                               | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                          |
| --------- | ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| instances | `{styles: string[], mq: string[]}` | `{styles: ["@dash-ui/styles"], mq: []}` | This option allows `babel-plugin-dash` to know which imports to treat as emotion imports and transform as such. This option is only required if you use a custom instance of dash styles created with `createStyles()` or you're importing emotion from somewhere other than the paths above. Relative paths are resolved relative to process.cwd() (the current working directory). |

## Thank you

Again, I couldn't have embarked on this plugin without the [@emotion-js](https://github.com/emotion-js) team putting in
a load of work to kick it off.

## LICENSE

MIT
