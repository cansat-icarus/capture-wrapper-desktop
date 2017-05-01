# CanSat Ground Station Software (Desktop version)

[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![Dependency Status][david-image]][david-url]
[![Build Status][travis-image]][travis-url]
[![Build status][appveyor-image]][appveyor-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
> Icarus Cansat Ground Station Software for Windows/macOS/Linux.


## Installation
The app is built automatically and the binaries (including installers) are available [here](https://github.com/cansat-icarus/capture-wrapper-desktop/releases/latest)

## Development
We're using [electron-forge](https://github.com/electron-userland/electron-forge) to manage our Electron app compilation duties. Besides that, you might want to run `bower install` to grab all the libraries necessary for the web app to run.
We use [capture-lib](https://github.com/cansat-icarus/capture-lib) to handle most of the station's duties. This is just an UI on top of it.

## License

MIT © 2016 [André Breda](https://github.com/addobandre)

[greenkeeper-url]: https://greenkeeper.io/
[greenkeeper-image]: https://badges.greenkeeper.io/cansat-icarus/capture-wrapper-desktop.svg

[travis-url]: https://travis-ci.org/cansat-icarus/capture-wrapper-desktop
[travis-image]: https://img.shields.io/travis/cansat-icarus/capture-wrapper-desktop.svg?style=flat

[appveyor-url]: https://ci.appveyor.com/project/addobandre/capture-wrapper-desktop
[appveyor-image]: https://ci.appveyor.com/api/projects/status/psy48mq0g8n7ix5o?svg=true

[david-url]: https://david-dm.org/cansat-icarus/capture-wrapper-desktop
[david-image]: https://david-dm.org/cansat-icarus/capture-wrapper-desktop.svg?style=flat

[commitizen-url]: http://commitizen.github.io/cz-cli/
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
