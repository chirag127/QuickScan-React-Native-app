import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

/**
 * Privacy Policy Screen
 * Displays the app's privacy policy
 */
export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: "Privacy Policy",
        }}
      />
      
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text className="text-2xl font-bold mb-6">Privacy Policy</Text>
        
        <PolicySection
          title="Introduction"
          content="This Privacy Policy explains how QR Code Scanner Pro collects, uses, and discloses your information when you use our mobile application. Please read this Privacy Policy carefully."
        />
        
        <PolicySection
          title="Information We Collect"
          content="We collect information that you provide directly to us, such as when you create an account, scan QR codes, or contact us for support. This may include your email address, name, and the content of QR codes you scan."
        />
        
        <PolicySection
          title="How We Use Your Information"
          content="We use the information we collect to provide, maintain, and improve our services, to communicate with you, to develop new features, and to protect our users and services."
        />
        
        <PolicySection
          title="Data Storage"
          content="QR code scan history is stored locally on your device. If you create an account, basic account information is stored securely with our authentication provider."
        />
        
        <PolicySection
          title="Camera Access"
          content="QR Code Scanner Pro requires camera access to scan QR codes. We do not store or transmit images or video from your camera."
        />
        
        <PolicySection
          title="Third-Party Services"
          content="We use third-party services such as Clerk for authentication. These services have their own privacy policies, and we recommend you review them."
        />
        
        <PolicySection
          title="Data Security"
          content="We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure."
        />
        
        <PolicySection
          title="Children's Privacy"
          content="Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13."
        />
        
        <PolicySection
          title="Changes to This Privacy Policy"
          content="We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."
        />
        
        <PolicySection
          title="Contact Us"
          content="If you have any questions about this Privacy Policy, please contact us at privacy@qrcodescannerpro.com."
        />
        
        <Text className="text-sm text-gray-500 mt-6 text-center">
          Last updated: April 24, 2025
        </Text>
      </ScrollView>
    </View>
  );
}

/**
 * Policy Section Component
 * Displays a section of the privacy policy with a title and content
 */
function PolicySection({ 
  title, 
  content 
}: { 
  title: string; 
  content: string;
}) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-2">{title}</Text>
      <Text className="text-base text-gray-700">{content}</Text>
    </View>
  );
}
