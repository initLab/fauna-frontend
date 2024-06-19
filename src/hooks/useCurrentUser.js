import { useAuth } from 'react-oidc-context';
import { useGetUserInfoQuery } from '../features/apiSlice.js';

export function useCurrentUser() {
    const auth = useAuth();
    const {
        data: user,
        isError,
        isLoading,
    } = useGetUserInfoQuery(undefined, {
        skip: !auth.isAuthenticated,
    });

    if (!auth.isAuthenticated || isLoading || isError) {
        return null;
    }

    return user;
}
