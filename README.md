# ![Coriolis Web](/src/components/atoms/Logo/images/coriolis-small-black.svg)

Web  GUI for [coriolis](https://github.com/cloudbase/coriolis)

![CI Badge](https://github.com/cloudbase/coriolis-web/workflows/Master/badge.svg) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Install instructions

- [node](https://nodejs.org/en/download/package-manager/) and [yarn](https://yarnpkg.com/lang/en/docs/install/) are required
- clone repo
- run `yarn install` or `yarn install --production` to install packages and dependencies for development or production mode
- set `CORIOLIS_URL` environment variable

## Build instructions

- run `yarn build`
- run `yarn start` to start the server

Your server will be running at `http://localhost:3000/` (the port is configurable through `PORT` environment variable)

## Testing

- run e2e integration tests using `yarn cypress`. Before running `yarn cypress` you must run `yarn install`, `yarn server-dev` and `yarn ui-dev`. Development env. is required so that the component CSS class names are kept (production build minifies them).
- unit tests can be run using `yarn test`

## Development mode

- set env. variable `NODE_MODE='development'`
- run `yarn client-dev` to start local development server (starts on port 3001)
- run `yarn server-dev` to start the express server in development mode

To debug the client code using VS Code, simply run the project's launch configuration from the 'Run' menu (Ctrl+Shift+D).
The last 2 `yarn ...` commands must be running in the background.

To debug the Node server using VS Code, run `yarn server-debug` instead of `yarn server-dev`.

You can view some of the UIs components in the [Storybook](https://github.com/storybooks/storybook) by running `yarn storybook`

## Modding

The UI can be modded externally using a `.json` modding file. A sample is available in the repo [`ui-mod-sample.json`](ui-mod-sample.json).

The path to the .json mod file needs to be set in `MOD_JSON` environment variable (ex.: `MOD_JSON=/usr/ui-mod.json`).

Any provider logos can be replaced using local logo images. The local image file paths need to be absolute.

You can specify one logo, in which case it will be scaled to all sizes. You can also specify logos for just a couple of the sizes, in which case the closest size to the one required will be used. Open [`ui-mod-sample.json`](ui-mod-sample.json) for more details.

Any option from [`config.ts`](config.ts) can be modified by adding the `config` field to the [`ui-mod-sample.json`](ui-mod-sample.json) file.

## Environment variables

All environment variables can be set in a `.env` file created in the root directory.

The following is the list of environment variables and their default values:

```(bash)
NODE_MODE='production'
CORIOLIS_URL='<your-coriolis-url>'
MOD_JSON='<path-to-json>'
```
