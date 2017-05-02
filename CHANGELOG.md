# Change Log
A crude change log that starts at 4.0.0.
Version scheme follow the [capture-lib](https://github.com/cansat-icarus/capture-lib) version (but sometimes features and patches are added to the wrapper only, leading the version to not match it).
If you want to really see what changes in the stations, the [capture-lib change log](https://github.com/cansat-icarus/capture-lib/blob/develop/CHANGELOG.md) is the place to go.

## [v4.0.3] - 2017-05-02
No changes to code, only to CI configuration.

## [v4.0.3] - 2017-05-02
No changes to code, only to CI configuration.

There are no binaries available for this release.
Windows build failed.

## [v4.0.2] - 2017-05-02
No changes to code, only to CI configuration.

There are no binaries available for this release.
macOS and Windows builds failed.

## [v4.0.1] - 2017-05-02
No changes to code, only to CI configuration.

There are no binaries available for this release.
macOS and Windows builds failed.

## v4.0.0 - 2017-05-01
Due to CI configuration error, we have no binaries for this release. All builds have failed.

What we have now:
- capture-lib v4.0.0
- UI to visualize incoming packets, serial port status, backend connection (+ replicator) status and station score
- Log viewer
- Protocol routine runner: Automatically executes tasks present in protocols to make the life of a station operator easier.
- Automatic notifications for capture-lib errors
- Critical control locking mechanism, to prevent accidentally stopping data reception. Automatically activated in the protocol routine for opening the station.

[v4.0.4]: https://github.com/cansat-icarus/capture-wrapper-desktop/compare/v4.0.3...v4.0.4
[v4.0.3]: https://github.com/cansat-icarus/capture-wrapper-desktop/compare/v4.0.2...v4.0.3
[v4.0.2]: https://github.com/cansat-icarus/capture-wrapper-desktop/compare/v4.0.1...v4.0.2
[v4.0.1]: https://github.com/cansat-icarus/capture-wrapper-desktop/compare/v4.0.0...v4.0.1
