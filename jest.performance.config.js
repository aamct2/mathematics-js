module.exports = {
  reporters: [["jest-slow-test-reporter", { numTests: 5, warnOnSlowerThan: 300, color: true }]],
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testMatch: ["<rootDir>/test/**/?(*.)(spec|test).ts?(x)"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
}
