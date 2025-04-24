# QR Code Scanner Pro

A powerful, feature-rich QR code scanner application built with React Native and Expo.

## Features

-   **Fast QR Code Scanning**: Quickly scan any QR code with real-time detection
-   **Smart Actions**: Automatically detect content type and suggest relevant actions
-   **Scan History**: Keep track of all your scanned QR codes
-   **User Accounts**: Create an account to access additional features
-   **Multiple QR Code Types**: Support for URLs, Wi-Fi, Contacts, SMS, Email, and more
-   **Offline Support**: Works without an internet connection for core scanning features

## Tech Stack

-   **Framework**: Expo SDK 52
-   **Language**: TypeScript
-   **Navigation**: Expo Router
-   **Styling**: NativeWind (Tailwind CSS for React Native)
-   **Camera/Scanning**: React Native Vision Camera
-   **State Management**: Zustand
-   **Local Storage**: React Native MMKV
-   **Authentication**: Clerk
-   **Animations**: React Native Reanimated
-   **Error Monitoring**: Sentry

## Getting Started

### Prerequisites

-   Node.js (v18 or newer)
-   npm or yarn
-   Expo CLI
-   iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/chirag127/QuickScan-React-Native-app.git
    cd QuickScan-React-Native-app
    ```

2. Install dependencies:

    ```bash
    cd frontend
    npm install
    ```

3. Create a `.env` file in the `frontend` directory with your Clerk publishable key:

    ```
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    ```

4. Start the development server:

    ```bash
    npm start
    ```

    If you encounter TypeScript errors like `Unknown file extension ".ts"`, try using:

    ```bash
    npx expo start --clear
    ```

5. Follow the instructions in the terminal to open the app on your device or simulator.

## Building for Production

### Android

1. Configure your app.json file with your Android package name and other details.
2. Build the Android app:
    ```bash
    eas build --platform android
    ```

### iOS

1. Configure your app.json file with your iOS bundle identifier and other details.
2. Build the iOS app:
    ```bash
    eas build --platform ios
    ```

## Project Structure

```
frontend/
├── app/                  # Expo Router app directory
│   ├── (tabs)/           # Tab navigation screens
│   ├── _layout.tsx       # Root layout
│   └── ...               # Other screens
├── assets/               # Images, fonts, etc.
├── components/           # Reusable UI components
├── constants/            # App constants
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── services/             # API and other services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.tsx               # Main app component
└── ...                   # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors like `Unknown file extension ".ts"`, try the following:

1. **Use Node.js v18 (recommended)**:

    This project works best with Node.js v18. If you have nvm installed:

    ```bash
    nvm use 18
    npm install --legacy-peer-deps
    npm start
    ```

2. **Use Node.js v18 without installing it**:

    ```bash
    npm run start:node18
    ```

    Or on Windows, you can use the batch file:

    ```bash
    start-with-node18.bat
    ```

3. **Alternative start method**:

    ```bash
    node --no-warnings expo-entry.js
    ```

4. **Clear Metro bundler cache**:

    ```bash
    npx expo start --clear
    ```

5. **Use development build**:
    ```bash
    npx expo run:android
    # or
    npx expo run:ios
    ```

### Babel Configuration Issues

If you encounter Babel-related errors:

1. Make sure your `.babelrc` file is properly configured
2. Try removing the `node_modules` folder and reinstalling dependencies:
    ```bash
    rm -rf node_modules
    npm install --legacy-peer-deps
    ```

## Acknowledgements

-   [Expo](https://expo.dev/)
-   [React Native](https://reactnative.dev/)
-   [React Native Vision Camera](https://mrousavy.com/react-native-vision-camera/)
-   [Clerk](https://clerk.dev/)
-   [NativeWind](https://www.nativewind.dev/)
