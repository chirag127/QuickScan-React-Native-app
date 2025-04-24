import { View, Text } from "react-native";
import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * Settings Section Component
 * A section in the settings screen with a title and content
 */
export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-500 px-4 mb-2 mt-4">
        {title.toUpperCase()}
      </Text>
      
      <View className="bg-surface rounded-lg overflow-hidden">
        {children}
      </View>
    </View>
  );
}
