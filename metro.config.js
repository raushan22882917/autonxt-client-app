const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude C++ native build artifacts and temporary compilation directories 
// from Metro's file watcher to prevent watch crashes during compilation (ENOENT)
const additionalExclusions = [
  /node_modules[/\\]react-native-reanimated[/\\]android[/\\]\.cxx/,
  /node_modules[/\\]react-native-reanimated[/\\]android[/\\]build/,
  /android[/\\]app[/\\]build/,
  /\.cxx/,
];

if (Array.isArray(config.resolver.blockList)) {
  config.resolver.blockList = [...config.resolver.blockList, ...additionalExclusions];
} else if (config.resolver.blockList instanceof RegExp) {
  config.resolver.blockList = [config.resolver.blockList, ...additionalExclusions];
} else {
  config.resolver.blockList = additionalExclusions;
}

module.exports = config;
