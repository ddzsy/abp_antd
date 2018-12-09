/* eslint-disable import/no-mutable-exports */
let Granted = [];
/**
 * use  authority or getAuthority
 * @param {Array|()=>Array} grantedPermissions
 */
const renderAuthorizeOnPermissions = Authorized => grantedPermissions => {
  if (grantedPermissions) {
    if (typeof grantedPermissions === 'function') {
      Granted = grantedPermissions();
    }
    if (
      Object.prototype.toString.call(grantedPermissions) === '[object Array]' ||
      Array.isArray(grantedPermissions)
    ) {
      Granted = grantedPermissions;
    }
  } else {
    Granted = [];
  }
  return Authorized;
};

export { Granted };
export default Authorized => renderAuthorizeOnPermissions(Authorized);
