import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

interface SettingsItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  rightElement?: ReactNode;
  onPress?: () => void;
}

/**
 * Settings Item Component
 * A single item in a settings section
 */
export default function SettingsItem({
  icon,
  iconColor = "#3B82F6",
  title,
  subtitle,
  showChevron = false,
  rightElement,
  onPress,
}: SettingsItemProps) {
  const content = (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      
      {rightElement && rightElement}
      
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity
        className="active:bg-gray-100"
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
}
