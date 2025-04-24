import { useState, useEffect } from "react";
import { Camera } from "react-native-vision-camera";
import * as Contacts from "expo-contacts";

/**
 * Permissions Hook
 * Manages app permissions for camera, contacts, etc.
 */
export function usePermissions() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasContactsPermission, setHasContactsPermission] = useState<boolean | null>(null);
  
  // Check camera permission on mount
  useEffect(() => {
    checkCameraPermission();
  }, []);
  
  // Check camera permission
  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasCameraPermission(status === "granted");
  };
  
  // Request camera permission
  const requestCameraPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasCameraPermission(status === "granted");
    return status === "granted";
  };
  
  // Check contacts permission
  const checkContactsPermission = async () => {
    const { status } = await Contacts.getPermissionsAsync();
    setHasContactsPermission(status === "granted");
    return status === "granted";
  };
  
  // Request contacts permission
  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasContactsPermission(status === "granted");
    return status === "granted";
  };
  
  return {
    hasCameraPermission,
    hasContactsPermission,
    checkCameraPermission,
    requestCameraPermission,
    checkContactsPermission,
    requestContactsPermission,
  };
}
