/**
 * persistence/seedInitializer.js
 * Seed data initialization for the EduDash ERP.
 * Refactored to delegate directly to the Centralized ERP Initialization Engine.
 *
 * RESPONSIBILITIES:
 * - Backwards compatible facade for startup and seeding routines.
 */

import { STORAGE_KEYS } from "./storageKeys";
import { hasKey } from "./storage";
import { initializeERP } from "../initialization/initializeERP";
import { initializeSeeds } from "../initialization/initializeSeeds";

/**
 * Checks if seed data needs to be initialized.
 * @returns {boolean}
 */
export const needsInitialization = () => {
  return !hasKey(STORAGE_KEYS.STUDENTS);
};

/**
 * Initializes seed data. Delegates to the Centralized Initialization Engine.
 */
export const initializeSeedData = () => {
  try {
    return initializeSeeds.checkAndSeed(true);
  } catch (error) {
    console.error("[seedInitializer] Seed initialization error:", error);
    return false;
  }
};

/**
 * Ensures seed data is initialized. Delegates to Centralized Boot sequence.
 * @returns {boolean} Success status
 */
export const ensureSeedData = () => {
  try {
    initializeERP();
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  needsInitialization,
  initializeSeedData,
  ensureSeedData,
};
