
/**
 * Get initials from a name (first letter of first name and first letter of last name)
 * @param name Full name
 * @returns Initials (2 letters max)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}
