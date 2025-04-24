import { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

import { QRCodeResult } from "../types/qrcode";
import { getActionsByType } from "../utils/qrCodeActions";
import ActionButton from "./ActionButton";

interface ScanResultModalProps {
  result: QRCodeResult;
  visible: boolean;
  onClose: () => void;
}

/**
 * Scan Result Modal Component
 * Displays the result of a QR code scan with available actions
 */
export default function ScanResultModal({ result, visible, onClose }: ScanResultModalProps) {
  const insets = useSafeAreaInsets();
  
  // Animation values
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);
  
  // Get actions for this scan type
  const actions = getActionsByType(result);
  
  // Animation styles
  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  
  // Handle animations
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { 
        duration: 400,
        easing: Easing.out(Easing.cubic)
      });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(500, { 
        duration: 400,
        easing: Easing.in(Easing.cubic)
      });
    }
  }, [visible]);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[styles.overlay, overlayAnimatedStyle]}
        className="flex-1 bg-black/50 justify-end"
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        
        <Animated.View 
          style={modalAnimatedStyle}
          className="bg-surface rounded-t-3xl"
        >
          {/* Handle bar */}
          <View className="items-center pt-2 pb-4">
            <View className="w-12 h-1 rounded-full bg-gray-300" />
          </View>
          
          <ScrollView
            className="px-6"
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Ionicons 
                  name={
                    result.dataType === "URL" ? "link-outline" :
                    result.dataType === "TEXT" ? "text-outline" :
                    result.dataType === "WIFI" ? "wifi-outline" :
                    result.dataType === "CONTACT" ? "person-outline" :
                    result.dataType === "SMS" ? "chatbox-outline" :
                    result.dataType === "EMAIL" ? "mail-outline" :
                    result.dataType === "GEO" ? "location-outline" :
                    "qr-code-outline"
                  } 
                  size={24} 
                  color="#3B82F6" 
                />
              </View>
              
              <View className="flex-1">
                <Text className="text-xl font-bold">{result.dataType}</Text>
                <Text className="text-gray-600">Scanned QR Code</Text>
              </View>
              
              <TouchableOpacity
                className="p-2"
                onPress={onClose}
              >
                <Ionicons name="close-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Content */}
            <View className="bg-gray-100 p-4 rounded-lg mb-6">
              <Text className="text-base">{result.displayData}</Text>
            </View>
            
            {/* Actions */}
            {actions.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3">Actions</Text>
                <View className="space-y-2">
                  {actions.map((action, index) => (
                    <ActionButton
                      key={index}
                      icon={action.icon}
                      label={action.label}
                      onPress={() => {
                        action.action(result);
                        if (action.closeAfter) {
                          onClose();
                        }
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
