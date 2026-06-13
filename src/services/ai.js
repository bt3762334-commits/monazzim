export function classifyTask(text) {
  const t = text.toLowerCase();

  if (t.includes("urgent") || t.includes("today")) {
    return "urgent-important";
  }

  if (t.includes("important")) {
    return "important";
  }

  if (t.includes("soon")) {
    return "urgent";
  }

  return "low";
}