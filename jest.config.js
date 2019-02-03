module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testMatch: ["<rootDir>/test/**/?(*.)(spec|test).ts?(x)"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  verbose: true,
}
