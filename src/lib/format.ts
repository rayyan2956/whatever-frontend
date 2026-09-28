export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

// "Chrome on Linux" style label from a user agent.
export function describeDevice(deviceName: string | null, userAgent: string | null) {
  if (deviceName) return deviceName;
  if (!userAgent) return "Unknown device";
  const browser =
    /Edg\//.test(userAgent) ? "Edge"
    : /Chrome\//.test(userAgent) ? "Chrome"
    : /Firefox\//.test(userAgent) ? "Firefox"
    : /Safari\//.test(userAgent) ? "Safari"
    : /okhttp|Expo|CFNetwork/i.test(userAgent) ? "Mobile app"
    : "Browser";
  const os =
    /Windows/.test(userAgent) ? "Windows"
    : /Android/.test(userAgent) ? "Android"
    : /iPhone|iPad|iOS/.test(userAgent) ? "iOS"
    : /Mac OS/.test(userAgent) ? "macOS"
    : /Linux/.test(userAgent) ? "Linux"
    : "";
  return os ? `${browser} on ${os}` : browser;
}
