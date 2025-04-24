import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty State Component
 * Displays a message when there is no content to show
 */
export default function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name={icon as any} size={32} color="#9CA3AF" />
      </View>
      
      <Text className="text-xl font-bold text-center">{title}</Text>
      
      <Text className="text-base text-gray-600 text-center mt-2">
        {message}
      </Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
