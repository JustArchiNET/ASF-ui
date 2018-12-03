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

Using a custom build of ASF-ui with ASFs internal http-server, a downloaded copy of it or your custom web-interface is very easy. First you need to clone the repository/your fork of the repository

```
git clone
npm i
```

You can now modify the source-code to your liking. When done with that you can build your custom version with 

```
npm run build
```

To make ASFs Kestrel serve your frontend you have to start ASF with the [command-line argument](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Command-line-arguments) `--path`, which is explained in detail in [ASFs wiki](https://github.com/JustArchiNET/ArchiSteamFarm/wiki). Just copy the contents of the folder `dist` that was created by npm to the appropriate location described on ASFs wiki and you are good to go
