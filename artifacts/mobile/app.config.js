const env = (key) =>
  process.env[`EXPO_PUBLIC_${key}`] || process.env[key] || '';

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
      cognitoUserPoolId: env('COGNITO_USER_POOL_ID'),
      cognitoClientId: env('COGNITO_CLIENT_ID'),
      awsRegion: env('AWS_REGION'),
      appsyncEndpoint: env('APPSYNC_ENDPOINT'),
      appsyncApiKey: env('APPSYNC_API_KEY'),
    },
  },
};
