import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

/**
 * Terms of Service Screen
 * Displays the app's terms of service
 */
export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: "Terms of Service",
        }}
      />
      
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text className="text-2xl font-bold mb-6">Terms of Service</Text>
        
        <TermsSection
          title="1. Acceptance of Terms"
          content="By accessing or using QR Code Scanner Pro, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application."
        />
        
        <TermsSection
          title="2. Description of Service"
          content="QR Code Scanner Pro is a mobile application that allows users to scan QR codes, view their content, and take relevant actions based on the content type."
        />
        
        <TermsSection
          title="3. User Accounts"
          content="Some features of QR Code Scanner Pro may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
        />
        
        <TermsSection
          title="4. User Conduct"
          content="You agree not to use QR Code Scanner Pro for any illegal or unauthorized purpose. You must not attempt to gain unauthorized access to any part of the service."
        />
        
        <TermsSection
          title="5. Intellectual Property"
          content="QR Code Scanner Pro and its original content, features, and functionality are owned by the app developers and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."
        />
        
        <TermsSection
          title="6. Disclaimer of Warranties"
          content="QR Code Scanner Pro is provided 'as is' and 'as available' without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement."
        />
        
        <TermsSection
          title="7. Limitation of Liability"
          content="In no event shall the developers of QR Code Scanner Pro be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
        />
        
        <TermsSection
          title="8. Changes to Terms"
          content="We reserve the right to modify or replace these Terms of Service at any time. It is your responsibility to review these Terms periodically for changes."
        />
        
        <TermsSection
          title="9. Governing Law"
          content="These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the app developers operate, without regard to its conflict of law provisions."
        />
        
        <TermsSection
          title="10. Contact Us"
          content="If you have any questions about these Terms, please contact us at terms@qrcodescannerpro.com."
        />
        
        <Text className="text-sm text-gray-500 mt-6 text-center">
          Last updated: April 24, 2025
        </Text>
      </ScrollView>
    </View>
  );
}

/**
 * Terms Section Component
 * Displays a section of the terms of service with a title and content
 */
function TermsSection({ 
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
