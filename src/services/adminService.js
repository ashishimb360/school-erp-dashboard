import { getDataProvider } from "../data";

/**
 * adminService.js
 *
 * Service layer for administrative users management.
 */

export const getAllAdmins = async () => {
  const provider = getDataProvider();
  const users = await provider.getAuthUsers();
  return users.filter((u) => u.role === "admin" || u.role === "ADMIN");
};

export const updateAdminProfile = async (id, updates) => {
  const provider = getDataProvider();
  const users = await provider.getAuthUsers();
  const user = users.find((u) => u.id === id || u.linkedEntityId === id);
  if (!user) throw new Error("Admin not found");
  return await provider.updateAuthUser(user.id, updates);
};
