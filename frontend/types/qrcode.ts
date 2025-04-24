/**
 * QR Code data types
 */
export type QRCodeType = 
  | "URL" 
  | "TEXT" 
  | "WIFI" 
  | "CONTACT" 
  | "SMS" 
  | "EMAIL" 
  | "GEO" 
  | "UNKNOWN";

/**
 * QR Code scan result
 */
export interface QRCodeResult {
  id: string;
  timestamp: number;
  dataType: QRCodeType;
  rawData: string;
  displayData: string;
  parsedData?: any;
}
