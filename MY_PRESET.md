# Using react js with electron-webpack
[Github link issue guide with typescript usage included](https://github.com/electron-userland/electron-webpack/issues/272)

## Commands used
```cmd
yarn add @babel/preset-react --dev
yarn add electron-webpack-eslint --dev
yarn add react react-dom
```

Then configured `webpack.renderer.additions.js` with:
```js
module.exports = {
    module: {
      rules: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/react"]
          }
        }
      ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
      }
  }; 
```
And configured `package.json` with:
```json
  "electronWebpack": {
    "renderer": {
      "webpackConfig": "webpack.renderer.additions.js"
    }
  }
```