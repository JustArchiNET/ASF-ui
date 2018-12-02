# ASF-ui

Standalone interface for ASF

[![Build status (AppVeyor)](https://img.shields.io/appveyor/ci/JustArchi/ASF-ui/master.svg?label=AppVeyor&maxAge=600)](https://ci.appveyor.com/project/JustArchi/ASF-ui)
[![Build status (Travis)](https://img.shields.io/travis/com/JustArchiNET/ASF-ui/master.svg?label=Travis&maxAge=600)](https://travis-ci.com/JustArchiNET/ASF-ui)
[![License](https://img.shields.io/github/license/JustArchiNET/ASF-ui.svg?label=License&maxAge=2592000)](https://github.com/JustArchiNET/ASF-ui/blob/master/LICENSE-2.0.txt)
[![Localization](https://d322cqt584bo4o.cloudfront.net/archisteamfarm/localized.svg)](https://crowdin.com/project/archisteamfarm)

<img src="https://raw.githubusercontent.com/JustArchiNET/ASF-ui/master/preview.png">

***

### Development

```
git clone
npm i
npm start
```

Local instance of ASF IPC required

### Custom builds

Using a custom build of ASF-ui with ASFs internal http-server is very easy. First you need to clone the repository/your fork of the repository

```
git clone ...
cd ASF-ui
npm i
```

After cloning you can modify the source-code to your liking. When done with that you can build your custom version with 

```
npm run-script build
```

To make ASFs Kestrel serve your frontend you have to start ASF with the [command-line argument](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Command-line-arguments) `--path`, which is explained in detail in [ASFs wiki](https://github.com/JustArchiNET/ArchiSteamFarm/wiki). Create a folder named `wwww` in the location your argument is pointing to and copy the folder `dist` (where the compiled version of your ASF-ui was put to) into it. Don't forget to copy your config-directory to that folder as well, as ASF will search for config files there instead of its own installtion directory.
