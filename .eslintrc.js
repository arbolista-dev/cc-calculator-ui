module.exports = {
  "extends": "airbnb",
  "globals": {
    "React": false
  },
  "env": {
    "es6": true
  },
  "settings":{
    "import/resolver":{
      "node":{
        "moduleDirectory":[
          "node_modules",
          "shared"
        ]
      },
      "webpack": {
        "config": __dirname + "/client/config/webpack/development.js"
      }
    }
  },
  "rules":{
    "react/forbid-prop-types": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js", "**/*.spec.js"]}],
    "no-unused-vars": ["error", {"varsIgnorePattern": "React" }],
    "camelcase": [0, {properties: "never"}],
    "class-methods-use-this": 0
  }
}
