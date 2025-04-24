import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import { QRCodeResult } from "../types/qrcode";
import { formatDate } from "../utils/dateUtils";

interface HistoryItemProps {
  scan: QRCodeResult;
  onPress: () => void;
  onDelete: () => void;
}

/**
 * History Item Component
 * Displays a single scan history item with swipe-to-delete functionality
 */
export default function HistoryItem({ scan, onPress, onDelete }: HistoryItemProps) {
  const [showActions, setShowActions] = useState(false);
  
  // Get icon based on data type
  const getIcon = () => {
    switch (scan.dataType) {
      case "URL":
        return "link-outline";
      case "TEXT":
        return "text-outline";
      case "WIFI":
        return "wifi-outline";
      case "CONTACT":
        return "person-outline";
      case "SMS":
        return "chatbox-outline";
      case "EMAIL":
        return "mail-outline";
      case "GEO":
        return "location-outline";
      default:
        return "qr-code-outline";
    }
  };
  
  // Toggle actions
  const toggleActions = () => {
    setShowActions(!showActions);
  };
  
  return (
    <View className="mx-4 mb-3">
      <TouchableOpacity
        className="bg-surface rounded-lg overflow-hidden border border-gray-200"
        onPress={onPress}
        onLongPress={toggleActions}
      >
        <View className="p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name={getIcon()} size={20} color="#3B82F6" />
            </View>
            
            <View className="flex-1">
              <Text className="text-base font-medium">{scan.dataType}</Text>
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {scan.displayData}
              </Text>
            </View>
            
            <Text className="text-xs text-gray-500 ml-2">
              {formatDate(new Date(scan.timestamp))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {showActions && (
        <Animated.View 
          entering={FadeIn.duration(200)}
          className="flex-row justify-end mt-2 space-x-2"
        >
          <TouchableOpacity
            className="bg-red-500 p-2 rounded-lg"
            onPress={() => {
              onDelete();
              setShowActions(false);
            }}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-gray-500 p-2 rounded-lg"
            onPress={toggleActions}
          >
            <Ionicons name="close-outline" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
