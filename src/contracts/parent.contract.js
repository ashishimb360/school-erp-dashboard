/**
 * Parent Contracts
 * Defines the strict boundaries for parent-related payloads.
 */
export const ParentContract = {
  createParentProfile(data) {
    return {
      id: data?.id ?? '',
      name: data?.name ?? '',
      email: data?.email ?? '',
      phoneNumber: data?.phoneNumber ?? '',
      children: Array.isArray(data?.children) ? data.children : []
    };
  }
};
