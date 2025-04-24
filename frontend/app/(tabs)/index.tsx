import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

import { useScanStore } from "../../hooks/useScanStore";
import { QRCodeResult } from "../../types/qrcode";
import { parseQRCodeData } from "../../utils/qrCodeParser";
import ScanResultModal from "../../components/ScanResultModal";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * Main QR code scanning screen
 * Provides a camera view with QR code detection capabilities
 */
export default function ScanScreen() {
  const device = useCameraDevice("back");
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasCameraPermission, requestCameraPermission } = usePermissions();
  
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<QRCodeResult | null>(null);
  
  const { addScan } = useScanStore();
  
  // Animation values
  const scannerOpacity = useSharedValue(0);
  const scannerScale = useSharedValue(0.8);
  
  // Refs
  const cameraRef = useRef<Camera>(null);
  
  // Code scanner setup
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (!isScanning || codes.length === 0) return;
      
      // Get the first detected QR code
      const scannedCode = codes[0];
      
      // Parse the QR code data
      if (scannedCode.value) {
        const parsedData = parseQRCodeData(scannedCode.value);
        
        // Provide haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Update state
        setIsScanning(false);
        setScanResult(parsedData);
        
        // Save to history
        addScan(parsedData);
      }
    }
  });
  
  // Animation styles
  const scannerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: scannerOpacity.value,
      transform: [{ scale: scannerScale.value }],
    };
  });
  
  // Effects
  useEffect(() => {
    // Start scanner animation
    scannerOpacity.value = withTiming(1, { duration: 300 });
    scannerScale.value = withTiming(1, { 
      duration: 500,
      easing: Easing.out(Easing.cubic)
    });
    
    // Request camera permission if needed
    if (!hasCameraPermission) {
      requestCameraPermission();
    }
  }, []);
  
  // Handle permission denied
  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Ionicons name="camera-off-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold mt-4 text-center">Camera Permission Required</Text>
        <Text className="text-base text-center mt-2 text-gray-600">
          QR Code Scanner Pro needs camera access to scan QR codes.
        </Text>
        <TouchableOpacity 
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={requestCameraPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Handle no camera device
  if (!device) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Ionicons name="alert-circle-outline" size={64} color="#F59E0B" />
        <Text className="text-xl font-bold mt-4 text-center">Camera Not Available</Text>
        <Text className="text-base text-center mt-2 text-gray-600">
          We couldn't access your device's camera. Please check your device settings.
        </Text>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-black">
      {/* Camera */}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        torch={isTorchOn ? "on" : "off"}
        enableZoomGesture
      />
      
      {/* Scanner overlay */}
      <Animated.View 
        style={[styles.scannerOverlay, scannerAnimatedStyle]}
        className="absolute inset-0 items-center justify-center"
      >
        <View className="w-64 h-64 border-2 border-white rounded-lg" />
      </Animated.View>
      
      {/* Top controls */}
      <View 
        className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-black/30"
          onPress={() => router.push("/(tabs)/history")}
        >
          <Ionicons name="time-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-black/30"
          onPress={() => setIsTorchOn(!isTorchOn)}
        >
          <Ionicons 
            name={isTorchOn ? "flash" : "flash-outline"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Scan result modal */}
      {scanResult && (
        <ScanResultModal
          result={scanResult}
          visible={!!scanResult}
          onClose={() => {
            setScanResult(null);
            setIsScanning(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
