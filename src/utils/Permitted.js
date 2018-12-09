import { renderAuthorizeOnPermissions } from '@/components/Authorized';

import { getPermissions } from './permissions';

let Authorized = renderAuthorizeOnPermissions(getPermissions()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = renderAuthorizeOnPermissions(getPermissions());
};

export { reloadAuthorized };
export default Authorized;
