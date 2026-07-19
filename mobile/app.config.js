import packageJson from "./package.json";

export default {
  expo: {
    name: "Lumora Tutor",
    slug: "lumora-tutor",
    version: packageJson.version,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "lumora-tutor",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yamneg2.lumoratutor",
      buildNumber: packageJson.version,
      deploymentTarget: "15.0",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.USE_BIOMETRIC",
        "android.permission.USE_FINGERPRINT",
      ],
      package: "com.yamneg2.lumoratutor",
      versionCode: 1,
      minSdkVersion: 26,
      googleServicesFile: "./google-services.json",
      usesCleartextTraffic: true,
    },
    web: {
      bundler: "metro",
      // "single" (client-only SPA) avoids build-time static rendering, which
      // evaluates native-only modules (react-native-executorch) in Node and
      // crashes `eas update` web export. This app targets iOS/Android natively.
      output: "single",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-asset",
      "expo-sharing",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://www.jitpack.io",
              "https://oss.sonatype.org/content/repositories/snapshots/",
            ],
          },
        },
      ],
      [
        "react-native-audio-api",
        {
          iosBackgroundMode: true,
          iosMicrophonePermission: "Allow Lumora Tutor to access your microphone for voice tutoring.",
          androidPermissions: [
            "android.permission.MODIFY_AUDIO_SETTINGS",
            "android.permission.FOREGROUND_SERVICE",
            "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
          ],
          androidForegroundService: true,
          androidFSTypes: ["mediaPlayback"],
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/notification-icon.png",
          color: "#004ac6",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow Lumora Tutor to access your camera to scan homework questions and lesson pages.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow Lumora Tutor to access your photo library to select images of homework to solve.",
        },
      ],
      "expo-font",
      "expo-local-authentication",
      "expo-file-system",
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "192ca0c5-ff6a-42c3-bd16-e9334014819e",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/192ca0c5-ff6a-42c3-bd16-e9334014819e",
    },
  },
};
