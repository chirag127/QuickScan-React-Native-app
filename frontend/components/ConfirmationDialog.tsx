import { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation Dialog Component
 * A modal dialog for confirming user actions
 */
export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmColor = "#3B82F6",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  // Animation values
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  
  // Animation styles
  const dialogAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
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
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { 
        duration: 250,
        easing: Easing.out(Easing.cubic)
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { 
        duration: 250,
        easing: Easing.in(Easing.cubic)
      });
    }
  }, [visible]);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <Animated.View 
        style={[styles.overlay, overlayAnimatedStyle]}
        className="flex-1 bg-black/50 items-center justify-center px-6"
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        
        <Animated.View 
          style={dialogAnimatedStyle}
          className="bg-white rounded-xl w-full max-w-sm overflow-hidden"
        >
          <View className="p-6">
            <Text className="text-xl font-bold mb-2">{title}</Text>
            <Text className="text-base text-gray-700">{message}</Text>
          </View>
          
          <View className="flex-row border-t border-gray-200">
            <TouchableOpacity
              className="flex-1 p-4 items-center justify-center border-r border-gray-200"
              onPress={onCancel}
            >
              <Text className="text-base font-medium text-gray-700">
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 p-4 items-center justify-center"
              onPress={onConfirm}
            >
              <Text 
                className="text-base font-medium"
                style={{ color: confirmColor }}
              >
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
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
