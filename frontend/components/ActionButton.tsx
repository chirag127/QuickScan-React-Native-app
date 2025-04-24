import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

/**
 * Action Button Component
 * A button with an icon and label for QR code actions
 */
export default function ActionButton({ 
  icon, 
  label, 
  onPress, 
  color = "#3B82F6" 
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white border border-gray-200 rounded-lg p-3 active:bg-gray-100"
      onPress={onPress}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      
      <Text className="text-base font-medium flex-1">{label}</Text>
      
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
