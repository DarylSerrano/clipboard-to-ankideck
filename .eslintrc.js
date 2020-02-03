module.exports = {
  /* your base configuration of choice */
  extends: "eslint:recommended",

  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    __static: true
  },
  rules: {
      "no-unused-vars": "off",
      "no-undef": "off"
  }
};
