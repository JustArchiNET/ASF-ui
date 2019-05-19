# Development

```
git clone
npm i
npm start
```

### Custom builds

Using a custom build of ASF-ui with ASF's internal http-server, a downloaded copy of it or your custom web-interface is very easy. First you need to clone your fork or this repository and install all dependencies.

```
git clone
npm i
```

You can now modify the source-code to your liking. When you are done with that you can build your custom version. 

```
npm run build
```

To make ASF's Kestrel serve your frontend you have to start ASF with the [command-line argument](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Command-line-arguments) `--path`, which is explained in detail in [ASF's wiki](https://github.com/JustArchiNET/ArchiSteamFarm/wiki). Just copy the contents of the folder `dist` that was created by npm to the appropriate location described on ASF's wiki and you are good to go.
