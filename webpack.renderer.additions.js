module.exports = {
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        options: {
          presets: ["@babel/react"]
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
