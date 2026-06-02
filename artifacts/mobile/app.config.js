// Canonical AWS backend config (dev-SoftwareBackendStack), provided as the
// source of truth. These are public client identifiers (the same kind Amplify
// commits to a repo), so they are kept here rather than in secrets. AppSync uses
// Cognito User Pool auth (idToken), so no AppSync API key is needed.
const AWS_CONFIG = {
  cognitoUserPoolId: 'ap-south-1_8Eomi3ymZ',
  cognitoClientId: '52qfclofiusha1pumph6r8a8ee',
  identityPoolId: 'ap-south-1:82ed9f8c-f1c6-4e6d-b58c-4c4df93f1702',
  awsRegion: 'ap-south-1',
  appsyncEndpoint:
    'https://md3jfqmlmbgspdqfgmxffhcwai.appsync-api.ap-south-1.amazonaws.com/graphql',
};

module.exports = {
  expo: {
    name: 'AutoNXT Fleet',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mobile',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#0A1628',
    },
    ios: {
      supportsTablet: false,
    },
    android: {
      backgroundColor: '#0A1628',
    },
    web: {
      favicon: './assets/images/icon.png',
    },
    plugins: [
      [
        'expo-router',
        {
          origin: 'https://replit.com/',
        },
      ],
      'expo-font',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...AWS_CONFIG,
    },
  },
};
