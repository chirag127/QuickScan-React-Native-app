import { Linking, Alert, Platform } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import * as Contacts from "expo-contacts";
import * as Haptics from "expo-haptics";

import { QRCodeResult } from "../types/qrcode";
import { usePermissions } from "../hooks/usePermissions";

/**
 * Action interface for QR code actions
 */
interface QRCodeAction {
  icon: string;
  label: string;
  action: (result: QRCodeResult) => void;
  closeAfter?: boolean;
}

/**
 * Get available actions based on QR code type
 * @param result QR code scan result
 * @returns Array of available actions
 */
export function getActionsByType(result: QRCodeResult): QRCodeAction[] {
  const actions: QRCodeAction[] = [];
  
  // Add copy action for all types
  actions.push({
    icon: "copy-outline",
    label: "Copy to Clipboard",
    action: (result) => {
      Clipboard.setString(result.rawData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied", "Content copied to clipboard");
    },
    closeAfter: true,
  });
  
  // Add type-specific actions
  switch (result.dataType) {
    case "URL":
      actions.unshift({
        icon: "open-outline",
        label: "Open URL",
        action: (result) => {
          Linking.openURL(result.rawData).catch(() => {
            Alert.alert("Error", "Could not open URL");
          });
        },
        closeAfter: true,
      });
      break;
      
    case "WIFI":
      if (result.parsedData) {
        const wifiData = result.parsedData as {
          ssid?: string;
          password?: string;
          type?: string;
        };
        
        // Add connect to Wi-Fi action
        actions.unshift({
          icon: "wifi-outline",
          label: "Connect to Wi-Fi",
          action: async (result) => {
            try {
              // On Android, we can try to connect to Wi-Fi
              if (Platform.OS === "android") {
                // This is a simplified approach - actual implementation would require native modules
                Alert.alert(
                  "Wi-Fi Information",
                  `Network: ${wifiData.ssid || "Unknown"}\nPassword: ${wifiData.password || "None"}\nType: ${wifiData.type || "Unknown"}`,
                  [
                    { text: "OK" }
                  ]
                );
              } else {
                // On iOS, we can only show the information
                Alert.alert(
                  "Wi-Fi Information",
                  `Network: ${wifiData.ssid || "Unknown"}\nPassword: ${wifiData.password || "None"}\nType: ${wifiData.type || "Unknown"}`,
                  [
                    { text: "OK" }
                  ]
                );
              }
            } catch (error) {
              Alert.alert("Error", "Could not connect to Wi-Fi");
            }
          },
          closeAfter: false,
        });
        
        // Add copy password action
        if (wifiData.password) {
          actions.push({
            icon: "key-outline",
            label: "Copy Password",
            action: (result) => {
              Clipboard.setString(wifiData.password || "");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Copied", "Password copied to clipboard");
            },
            closeAfter: true,
          });
        }
      }
      break;
      
    case "CONTACT":
      if (result.parsedData) {
        const contactData = result.parsedData as {
          name?: string;
          phone?: string;
          email?: string;
          address?: string;
          company?: string;
          title?: string;
        };
        
        // Add add to contacts action
        actions.unshift({
          icon: "person-add-outline",
          label: "Add to Contacts",
          action: async (result) => {
            try {
              // Request contacts permission
              const { requestContactsPermission } = usePermissions();
              const hasPermission = await requestContactsPermission();
              
              if (!hasPermission) {
                Alert.alert("Permission Required", "Contact permission is required to add contacts");
                return;
              }
              
              // Create contact
              const contact: Contacts.Contact = {
                [Contacts.Fields.FirstName]: contactData.name || "Unknown",
                [Contacts.Fields.PhoneNumbers]: contactData.phone ? [{ number: contactData.phone }] : undefined,
                [Contacts.Fields.Emails]: contactData.email ? [{ email: contactData.email }] : undefined,
                [Contacts.Fields.Addresses]: contactData.address ? [{ street: contactData.address }] : undefined,
                [Contacts.Fields.Company]: contactData.company,
                [Contacts.Fields.JobTitle]: contactData.title,
              };
              
              // Save contact
              await Contacts.addContactAsync(contact);
              Alert.alert("Success", "Contact added successfully");
            } catch (error) {
              Alert.alert("Error", "Could not add contact");
            }
          },
          closeAfter: true,
        });
        
        // Add call action if phone number is available
        if (contactData.phone) {
          actions.push({
            icon: "call-outline",
            label: "Call",
            action: (result) => {
              Linking.openURL(`tel:${contactData.phone}`).catch(() => {
                Alert.alert("Error", "Could not make call");
              });
            },
            closeAfter: true,
          });
        }
        
        // Add email action if email is available
        if (contactData.email) {
          actions.push({
            icon: "mail-outline",
            label: "Send Email",
            action: (result) => {
              Linking.openURL(`mailto:${contactData.email}`).catch(() => {
                Alert.alert("Error", "Could not open email");
              });
            },
            closeAfter: true,
          });
        }
      }
      break;
      
    case "SMS":
      if (result.parsedData) {
        const smsData = result.parsedData as {
          number?: string;
          message?: string;
        };
        
        // Add send SMS action
        if (smsData.number) {
          actions.unshift({
            icon: "chatbox-outline",
            label: "Send SMS",
            action: (result) => {
              const url = `sms:${smsData.number}${smsData.message ? `?body=${encodeURIComponent(smsData.message)}` : ""}`;
              Linking.openURL(url).catch(() => {
                Alert.alert("Error", "Could not open SMS");
              });
            },
            closeAfter: true,
          });
          
          // Add call action
          actions.push({
            icon: "call-outline",
            label: "Call",
            action: (result) => {
              Linking.openURL(`tel:${smsData.number}`).catch(() => {
                Alert.alert("Error", "Could not make call");
              });
            },
            closeAfter: true,
          });
        }
      }
      break;
      
    case "EMAIL":
      if (result.parsedData) {
        const emailData = result.parsedData as {
          to?: string;
          subject?: string;
          body?: string;
        };
        
        // Add send email action
        if (emailData.to) {
          actions.unshift({
            icon: "mail-outline",
            label: "Send Email",
            action: (result) => {
              const url = `mailto:${emailData.to}${emailData.subject ? `?subject=${encodeURIComponent(emailData.subject)}` : ""}${emailData.body ? `${emailData.subject ? "&" : "?"}body=${encodeURIComponent(emailData.body)}` : ""}`;
              Linking.openURL(url).catch(() => {
                Alert.alert("Error", "Could not open email");
              });
            },
            closeAfter: true,
          });
        }
      }
      break;
      
    case "GEO":
      if (result.parsedData) {
        const geoData = result.parsedData as {
          latitude: string;
          longitude: string;
        };
        
        // Add open in maps action
        actions.unshift({
          icon: "map-outline",
          label: "Open in Maps",
          action: (result) => {
            const url = Platform.select({
              ios: `maps:?q=${geoData.latitude},${geoData.longitude}`,
              android: `geo:${geoData.latitude},${geoData.longitude}?q=${geoData.latitude},${geoData.longitude}`,
            });
            
            if (url) {
              Linking.openURL(url).catch(() => {
                // Fallback to Google Maps
                Linking.openURL(`https://maps.google.com/maps?q=${geoData.latitude},${geoData.longitude}`).catch(() => {
                  Alert.alert("Error", "Could not open maps");
                });
              });
            }
          },
          closeAfter: true,
        });
      }
      break;
      
    case "TEXT":
      // Add share action
      actions.unshift({
        icon: "share-outline",
        label: "Share Text",
        action: async (result) => {
          try {
            await Linking.openURL(`sms:?body=${encodeURIComponent(result.rawData)}`);
          } catch (error) {
            Alert.alert("Error", "Could not share text");
          }
        },
        closeAfter: true,
      });
      break;
  }
  
  return actions;
}
