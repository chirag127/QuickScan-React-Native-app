import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthButtonProps {
  provider: "google" | "apple" | "facebook";
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Auth Button Component
 * A button for OAuth authentication providers
 */
export default function AuthButton({ 
  provider, 
  label, 
  onPress, 
  disabled = false 
}: AuthButtonProps) {
  // Get provider-specific properties
  const getProviderProps = () => {
    switch (provider) {
      case "google":
        return {
          icon: "logo-google",
          color: "#EA4335",
          bgColor: "#EA433520",
        };
      case "apple":
        return {
          icon: "logo-apple",
          color: "#000000",
          bgColor: "#00000020",
        };
      case "facebook":
        return {
          icon: "logo-facebook",
          color: "#1877F2",
          bgColor: "#1877F220",
        };
      default:
        return {
          icon: "person-outline",
          color: "#3B82F6",
          bgColor: "#3B82F620",
        };
    }
  };
  
  const { icon, color, bgColor } = getProviderProps();
  
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center border border-gray-300 rounded-lg p-3 ${disabled ? "opacity-50" : "active:bg-gray-100"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <View 
        className="w-8 h-8 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: bgColor }}
      >
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      
      <Text className="text-base font-medium">{label}</Text>
    </TouchableOpacity>
  );
}
