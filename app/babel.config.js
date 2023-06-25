process.env.TAMAGUI_TARGET = "native";

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve("expo-router/babel"), 
      "module:react-native-dotenv", 
      [
        "react-native-reanimated/plugin", {
        "relativeSourceLocation": true
      }],
      ["transform-inline-environment-variables", {
        "exclude": [
          "EXPO_ROUTER_APP_ROOT",
          "EXPO_ROUTER_PROJECT_ROOT",
          "EXPO_ROUTER_IMPORT_MODE",
          "EXPO_ROUTER_IMPORT_MODE_ANDROID",
          "EXPO_ROUTER_IMPORT_MODE_IOS",
          "EXPO_ROUTER_IMPORT_MODE_WEB",
        ]
      }]
    ]
  };
};
