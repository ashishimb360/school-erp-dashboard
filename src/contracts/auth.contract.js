/**
 * Auth Contracts
 * Defines the strict boundaries for authentication payloads.
 */
export const AuthContract = {
  createLoginResponse(data) {
    return {
      token: data?.token ?? '',
      refreshToken: data?.refreshToken ?? '',
      user: {
        id: data?.user?.id ?? '',
        role: data?.user?.role ?? '',
        name: data?.user?.name ?? '',
        email: data?.user?.email ?? ''
      },
      permissions: Array.isArray(data?.permissions) ? data.permissions : []
    };
  },
  createCurrentUser(data) {
    return {
      id: data?.id ?? '',
      role: data?.role ?? '',
      name: data?.name ?? '',
      email: data?.email ?? '',
      permissions: Array.isArray(data?.permissions) ? data.permissions : []
    };
  }
};
