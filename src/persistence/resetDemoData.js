/**
 * persistence/resetDemoData.js
 * Demo data reset functionality for the EduDash ERP.
 * Refactored to delegate to the Centralized ERP Initialization Engine reset API.
 *
 * RESPONSIBILITIES:
 * - Clear active states and re-seed the system dynamically without full reload chaos.
 */

import { resetERPData } from "../initialization/initializeERP";

/**
 * Resets all demo data to the initial seed state.
 * Delegates execution to the Centralized ERP Initialization Engine.
 *
 * @returns {boolean} Success status
 */
export const resetDemoData = () => {
  try {
    const success = resetERPData();

    if (success) {
      console.log("[resetDemoData] Demo data reset successfully via Centralized Engine.");
    } else {
      console.error("[resetDemoData] Demo data reset failed.");
    }

    return success;
  } catch (error) {
    console.error("[resetDemoData] Demo data reset error:", error);
    return false;
  }
};

/**
 * Resets specific collections only.
 * Useful for targeted testing without full reset.
 *
 * @param {string[]} keys - Array of STORAGE_KEYS to reset
 * @returns {boolean} Success status
 */
export const resetSpecificCollections = (keys) => {
  try {
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Specific collection reset error:", error);
    return false;
  }
};

export default {
  resetDemoData,
  resetSpecificCollections,
};
