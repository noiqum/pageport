export default {
    expo: {
        name: 'pageport',
        slug: 'pageport',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
                package: 'com.pageport',
            },
            package: 'com.pageport',
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json"
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
            '@react-native-firebase/app',
            [
                'expo-build-properties',
                {
                    android: {
                        "compileSdkVersion": 35,
                        "targetSdkVersion": 35
                    },
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: 'ce95e886-10dc-442e-9bf5-20a0d23b3e9e',
            },
        },
    },
}; 