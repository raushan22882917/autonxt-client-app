# Android Build and Release Guide

This guide explains how to set up the environment, configure release signing, and build the Android App Bundle (`.aab`) for the AutoNxt client application.

---

## 1. Getting Started (For New Clones)

If you are cloning this repository for the first time, follow these steps to set up your environment:

### Prerequisites
* **NodeJS**: Version 18 or 20 (recommended).
* **pnpm**: The package manager used in this repository.
* **Java Development Kit (JDK)**: JDK 17 (required for React Native / Expo SDK 54).
* **Android SDK & Studio**: Ensure you have command-line tools and emulator platforms installed.

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd autonxt-client-app
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   *Note: If you encounter issues resolving packages or command run errors, ensure your project root has a `.npmrc` file with the correct public hoisting rules for React Native (see `.npmrc` in the repository root).*

---

## 2. Release Signing Configuration

To build a release version of the app (either for local testing or Google Play Store upload), you need to configure the signing credentials. **Do not commit these credentials directly to the repository.**

### How to configure signing credentials locally:
1. Go to your system's user home directory:
   * **Windows**: `C:\Users\<Your-Username>\.gradle\`
   * **macOS/Linux**: `~/.gradle/`
2. Create or open the file named **`gradle.properties`** in that `.gradle` directory.
3. Add the following release signing properties with the correct credentials:

```properties
AUTONXT_UPLOAD_STORE_FILE=my-upload-key.keystore
AUTONXT_UPLOAD_KEY_ALIAS=my-key-alias
AUTONXT_UPLOAD_STORE_PASSWORD=Raushan@2288
AUTONXT_UPLOAD_KEY_PASSWORD=Raushan@2288
```

4. Ensure that the keystore file `my-upload-key.keystore` exists in your local `android/app/` folder (`android/app/my-upload-key.keystore`). It is ignored in `.gitignore` by default so it will not be committed.

---

## 3. Generating the Android App Bundle (.aab)

Google Play Store requires builds in the **Android App Bundle (.aab)** format. Follow these steps to generate it:

1. Open your terminal in the **project root directory** and go to the `android` folder:
   ```bash
   cd android
   ```
2. Run the Gradle bundle task:
   ```bash
   .\gradlew.bat bundleRelease
   ```
   *(On macOS/Linux, run `./gradlew bundleRelease`)*
3. Once the build is successful, you can find the generated `.aab` file at:
   📂 **`android/app/build/outputs/bundle/release/app-release.aab`**

You can upload this `app-release.aab` file directly to the Google Play Console.

---

## 4. Running a Local Release Build on Emulator/Device

If you want to test the release version of the app on a connected emulator or device:

1. **Delete any existing debug version** of the app from the emulator/device to avoid signature conflicts.
2. Run the following command from the **project root directory**:
   ```bash
   npx expo run:android --variant release
   ```
