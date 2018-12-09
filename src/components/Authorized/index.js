import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

/* eslint-disable import/no-mutable-exports */
let Granted = [];
/**
 * use  authority or getAuthority
 * @param {Array|()=>Array} grantedPermissions
 */

export const renderAuthorizeOnPermissions = Permitted => grantedPermissions => {
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
  return Permitted;
};

export { Granted };

export default renderAuthorize(Authorized);
