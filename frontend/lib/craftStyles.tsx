export function craftMarkerClass(craft: string) {
  const normalized = craft.toLowerCase();

  if (normalized.includes("elektriker")) {
    return "bg-yellow-200 text-yellow-800";
  } else if (normalized.includes("maler")) {
    return "bg-blue-200 text-blue-800";
  } else if (normalized.includes("tischler")) {
    return "bg-green-200 text-green-800";
  } else if (normalized.includes("installateur")) {
    return "bg-red-200 text-red-800";
  }

  return "bg-gray-200 text-gray-800";
}
