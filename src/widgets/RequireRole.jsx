import { useCurrentUser } from '../hooks/useCurrentUser.js';

const RequireRole = ({
    children,
    roles,
}) => {
    const user = useCurrentUser();
    const userRoles = Object.keys(user?.['urn:zitadel:iam:org:project:roles'] ?? {});

    const searchRoles = typeof roles === 'string' ? [roles] : Array.from(roles);
    const isAllowed = userRoles.some(userRole => searchRoles.includes(userRole));

    return isAllowed ? children : null;
};

export default RequireRole;
