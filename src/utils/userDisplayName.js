export function getUserDisplayName(user) {
  if (!user) {
    return 'User';
  }

  const displayName = typeof user.displayName === 'string' ? user.displayName.trim() : '';

  if (displayName) {
    return displayName;
  }

  const email = typeof user.email === 'string' ? user.email.trim() : '';

  if (email) {
    return email;
  }

  return 'User';
}
