import React from 'react';
import { renderAuthorizeOnPermissions } from '@/components/Authorized';
import { getPermissions } from '@/utils/permissions';
import Redirect from 'umi/redirect';

const Permissions = getPermissions();
const Authorized = renderAuthorizeOnPermissions(Permissions);

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
