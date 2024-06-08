import { useAuth } from 'react-oidc-context';

const RequireRole = ({
    children,
    roles,
}) => {
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return null;
    }

    const userRoles = Object.keys(auth.user.profile?.['urn:zitadel:iam:org:project:roles'] ?? {});

    const searchRoles = typeof roles === 'string' ? [roles] : Array.from(roles);
    const isAllowed = userRoles.some(userRole => searchRoles.includes(userRole));

    return isAllowed ? children : null;
};

export default RequireRole;
