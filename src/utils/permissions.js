export function getPermissions(str) {
  const permissionString = typeof str === 'undefined' ? localStorage.getItem('auth') : str;

  let permission;
  try {
    permission = JSON.parse(permissionString);
  } catch (e) {
    permission = permissionString;
  }
  if (typeof permission === 'string') {
    return [permission];
  }
  console.log(permission);

  return permission || [];
}

export function setPermissions(permission) {
  const proPermission = typeof permission === 'string' ? [permission] : permission;
  return localStorage.setItem('auth', JSON.stringify(proPermission));
}
