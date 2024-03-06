## Detailed Configuration

### React Native Environment Setup
* https://reactnative.dev/docs/environment-setup

### Install Softwares
* Android Studio
    * For macOS M1 user: https://stackoverflow.com/questions/64907154
        1. https://developer.android.com/studio/archive -> Android Studio Arctic Fox latest version -> Mac (Apple Silicon)
        2. Install arm64 emulator
* Xcode

### Install Homebrew
* https://brew.sh/
    * For macOS M1 user, after Homebrew is installed, need to add the following code to `vim ~/.zshrc`, then run `source ~/.zshrc` activate
```
path=('/opt/homebrew/bin' $path)
export PATH
```

### Check Homebrew
```
brew -v
```

### Install Dependencies
```
brew install node
brew install watchman
brew install cocoapods
brew install adoptopenjdk/openjdk/adoptopenjdk8
npm install -g yarn
```

### Check Dependencies
```
node -v
watchman -v
pod --version
javac -version
yarn -v
```

### Clear Cache
```
rm -rf node_modules
rm -rf $TMPDIR/react-native-packager-cache-*
rm -rf $TMPDIR/metro-bundler-cache-* 
watchman watch-del-all
yarn cache clean
```

### Install `node_modules`
```
npm install
```

### Launch Server
```
yarn start --reset-cache
```

### Set Up Android Environment
1. Install Android Studio
2. After Android Studio is installed, need to add the following code to `vim ~/.bash_profile`, then run `source ~/.bash_profile` activate
```
export ANDROID_HOME=/Users/<CHANGE_TO_YOUR_USERNAME>/Library/Android/sdk
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
export PATH="$PATH:/opt/yarn-[version]/bin"
export PATH="$PATH:$(yarn global bin)"
```

### Set Up iOS Environment
1. Go to `<PROJECT_FILE_NAME>/ios` path
2. Run the code below
```
pod install
```

### Check Android Build
```
./gradlew clean
./gradlew assembleDebug
./gradlew assembleRelease
```

### Find Android Emulators
```
adb devices
```

### Run Default Android Emulator
```
ENVFILE=.env.production npm run android
```

### Run Specific Android Emulator
If you want run specific emulator, you need to launch the emulator from Android Studio first before run the command `ENVFILE=.env.production npm run android`.

### Check iOS Build
```
xcodebuild -workspace <APP_NAME>.xcworkspace -scheme <APP_NAME> -sdk iphonesimulator -configuration Debug ONLY_ACTIVE_ARCH=NO
```

### Find iOS Emulators
```
xcrun simctl list devices
```

### Run iOS Default Emulator
```
ENVFILE=.env.production npm run ios
```

### Run Specific iOS Emulator
```
ENVFILE=.env.production yarn ios --simulator="iPad Pro (9.7-inch)"
```

### Enable Fast Refresh
1. ctrl + M on the emulator
2. select "Enable Fast Refresh"

### Common Errors

#### Listen EADDRINUSE: address already in use :::8081.
```
lsof -i :8081
kill -9 <PID>
```

#### Failed to launch emulator. Reason: No emulators found as an output of `emulator -list-avds`.
* Run the code below to activate the Android environment
```
source ~/.bash_profile
```

#### Failed to install the app. Please accept all necessary Android SDK licenses using Android SDK Manager
* https://stackoverflow.com/questions/57124607

#### Could not get the simulator list from Xcode. Please open Xcode and try running project directly from there to resolve the remaining issues
* Launch Xcode -> Preferences -> Locations -> Update "Command Line Tools" option

#### If there are some unknown errors, redo all steps from "Delete node modules"
