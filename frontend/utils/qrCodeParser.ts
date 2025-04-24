import { v4 as uuidv4 } from "uuid";
import { QRCodeResult, QRCodeType } from "../types/qrcode";

/**
 * Parse QR code data and determine its type
 * @param data Raw QR code data
 * @returns Parsed QR code result with type and formatted display data
 */
export function parseQRCodeData(data: string): QRCodeResult {
  // Check if it's a URL
  if (isUrl(data)) {
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "URL",
      rawData: data,
      displayData: data,
    };
  }
  
  // Check if it's a Wi-Fi configuration
  if (isWifi(data)) {
    const wifiData = parseWifi(data);
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "WIFI",
      rawData: data,
      displayData: `Network: ${wifiData.ssid || "Unknown"}`,
      parsedData: wifiData,
    };
  }
  
  // Check if it's a contact (vCard or MeCard)
  if (isContact(data)) {
    const contactData = parseContact(data);
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "CONTACT",
      rawData: data,
      displayData: contactData.name || "Contact",
      parsedData: contactData,
    };
  }
  
  // Check if it's an SMS
  if (isSms(data)) {
    const smsData = parseSms(data);
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "SMS",
      rawData: data,
      displayData: `SMS to: ${smsData.number || "Unknown"}`,
      parsedData: smsData,
    };
  }
  
  // Check if it's an email
  if (isEmail(data)) {
    const emailData = parseEmail(data);
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "EMAIL",
      rawData: data,
      displayData: `Email to: ${emailData.to || "Unknown"}`,
      parsedData: emailData,
    };
  }
  
  // Check if it's a geo location
  if (isGeo(data)) {
    const geoData = parseGeo(data);
    return {
      id: uuidv4(),
      timestamp: Date.now(),
      dataType: "GEO",
      rawData: data,
      displayData: `Location: ${geoData.latitude}, ${geoData.longitude}`,
      parsedData: geoData,
    };
  }
  
  // Default to text
  return {
    id: uuidv4(),
    timestamp: Date.now(),
    dataType: "TEXT",
    rawData: data,
    displayData: data,
  };
}

/**
 * Check if the data is a URL
 */
function isUrl(data: string): boolean {
  try {
    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    return urlPattern.test(data);
  } catch (error) {
    return false;
  }
}

/**
 * Check if the data is a Wi-Fi configuration
 */
function isWifi(data: string): boolean {
  return data.startsWith("WIFI:");
}

/**
 * Parse Wi-Fi configuration data
 */
function parseWifi(data: string): {
  ssid?: string;
  password?: string;
  type?: string;
  hidden?: boolean;
} {
  const result: {
    ssid?: string;
    password?: string;
    type?: string;
    hidden?: boolean;
  } = {};
  
  // Extract SSID
  const ssidMatch = data.match(/S:(.*?)(;|$)/);
  if (ssidMatch) {
    result.ssid = ssidMatch[1];
  }
  
  // Extract password
  const passwordMatch = data.match(/P:(.*?)(;|$)/);
  if (passwordMatch) {
    result.password = passwordMatch[1];
  }
  
  // Extract type
  const typeMatch = data.match(/T:(.*?)(;|$)/);
  if (typeMatch) {
    result.type = typeMatch[1];
  }
  
  // Extract hidden
  const hiddenMatch = data.match(/H:(.*?)(;|$)/);
  if (hiddenMatch) {
    result.hidden = hiddenMatch[1] === "true";
  }
  
  return result;
}

/**
 * Check if the data is a contact (vCard or MeCard)
 */
function isContact(data: string): boolean {
  return data.startsWith("BEGIN:VCARD") || data.startsWith("MECARD:");
}

/**
 * Parse contact data (vCard or MeCard)
 */
function parseContact(data: string): {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  title?: string;
  url?: string;
  note?: string;
} {
  const result: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    company?: string;
    title?: string;
    url?: string;
    note?: string;
  } = {};
  
  if (data.startsWith("BEGIN:VCARD")) {
    // Parse vCard
    const nameMatch = data.match(/FN:(.*?)(\r\n|\r|\n)/);
    if (nameMatch) {
      result.name = nameMatch[1];
    }
    
    const phoneMatch = data.match(/TEL[^:]*:(.*?)(\r\n|\r|\n)/);
    if (phoneMatch) {
      result.phone = phoneMatch[1];
    }
    
    const emailMatch = data.match(/EMAIL[^:]*:(.*?)(\r\n|\r|\n)/);
    if (emailMatch) {
      result.email = emailMatch[1];
    }
    
    const addressMatch = data.match(/ADR[^:]*:(.*?)(\r\n|\r|\n)/);
    if (addressMatch) {
      result.address = addressMatch[1];
    }
    
    const companyMatch = data.match(/ORG:(.*?)(\r\n|\r|\n)/);
    if (companyMatch) {
      result.company = companyMatch[1];
    }
    
    const titleMatch = data.match(/TITLE:(.*?)(\r\n|\r|\n)/);
    if (titleMatch) {
      result.title = titleMatch[1];
    }
    
    const urlMatch = data.match(/URL:(.*?)(\r\n|\r|\n)/);
    if (urlMatch) {
      result.url = urlMatch[1];
    }
    
    const noteMatch = data.match(/NOTE:(.*?)(\r\n|\r|\n)/);
    if (noteMatch) {
      result.note = noteMatch[1];
    }
  } else if (data.startsWith("MECARD:")) {
    // Parse MeCard
    const nameMatch = data.match(/N:(.*?)(;|$)/);
    if (nameMatch) {
      result.name = nameMatch[1];
    }
    
    const phoneMatch = data.match(/TEL:(.*?)(;|$)/);
    if (phoneMatch) {
      result.phone = phoneMatch[1];
    }
    
    const emailMatch = data.match(/EMAIL:(.*?)(;|$)/);
    if (emailMatch) {
      result.email = emailMatch[1];
    }
    
    const addressMatch = data.match(/ADR:(.*?)(;|$)/);
    if (addressMatch) {
      result.address = addressMatch[1];
    }
    
    const companyMatch = data.match(/ORG:(.*?)(;|$)/);
    if (companyMatch) {
      result.company = companyMatch[1];
    }
    
    const titleMatch = data.match(/TITLE:(.*?)(;|$)/);
    if (titleMatch) {
      result.title = titleMatch[1];
    }
    
    const urlMatch = data.match(/URL:(.*?)(;|$)/);
    if (urlMatch) {
      result.url = urlMatch[1];
    }
    
    const noteMatch = data.match(/NOTE:(.*?)(;|$)/);
    if (noteMatch) {
      result.note = noteMatch[1];
    }
  }
  
  return result;
}

/**
 * Check if the data is an SMS
 */
function isSms(data: string): boolean {
  return data.startsWith("SMSTO:") || data.startsWith("SMS:");
}

/**
 * Parse SMS data
 */
function parseSms(data: string): {
  number?: string;
  message?: string;
} {
  const result: {
    number?: string;
    message?: string;
  } = {};
  
  if (data.startsWith("SMSTO:")) {
    const parts = data.substring(6).split(":");
    if (parts.length > 0) {
      result.number = parts[0];
    }
    if (parts.length > 1) {
      result.message = parts[1];
    }
  } else if (data.startsWith("SMS:")) {
    const numberMatch = data.match(/SMS:(.*?)(:|;|$)/);
    if (numberMatch) {
      result.number = numberMatch[1];
    }
    
    const messageMatch = data.match(/BODY:(.*?)(;|$)/);
    if (messageMatch) {
      result.message = messageMatch[1];
    }
  }
  
  return result;
}

/**
 * Check if the data is an email
 */
function isEmail(data: string): boolean {
  return data.startsWith("MAILTO:") || data.startsWith("MATMSG:");
}

/**
 * Parse email data
 */
function parseEmail(data: string): {
  to?: string;
  subject?: string;
  body?: string;
} {
  const result: {
    to?: string;
    subject?: string;
    body?: string;
  } = {};
  
  if (data.startsWith("MAILTO:")) {
    const parts = data.substring(7).split("?");
    if (parts.length > 0) {
      result.to = parts[0];
    }
    
    if (parts.length > 1) {
      const params = new URLSearchParams(parts[1]);
      result.subject = params.get("subject") || undefined;
      result.body = params.get("body") || undefined;
    }
  } else if (data.startsWith("MATMSG:")) {
    const toMatch = data.match(/TO:(.*?)(;|$)/);
    if (toMatch) {
      result.to = toMatch[1];
    }
    
    const subjectMatch = data.match(/SUB:(.*?)(;|$)/);
    if (subjectMatch) {
      result.subject = subjectMatch[1];
    }
    
    const bodyMatch = data.match(/BODY:(.*?)(;|$)/);
    if (bodyMatch) {
      result.body = bodyMatch[1];
    }
  }
  
  return result;
}

/**
 * Check if the data is a geo location
 */
function isGeo(data: string): boolean {
  return data.startsWith("GEO:");
}

/**
 * Parse geo location data
 */
function parseGeo(data: string): {
  latitude: string;
  longitude: string;
} {
  const result = {
    latitude: "0",
    longitude: "0",
  };
  
  const coords = data.substring(4).split(",");
  if (coords.length >= 2) {
    result.latitude = coords[0];
    result.longitude = coords[1];
  }
  
  return result;
}
