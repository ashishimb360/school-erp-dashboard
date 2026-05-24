/**
 * initialization/initializeERP.js
 * Central orchestrator and single application startup authority.
 * Coordinates system startup checks, automatic repair logic,
 * structural validation diagnostics, and safe demo resets.
 */

import { bootstrapState } from "./bootstrapState";
import { initializeStorage } from "./initializeStorage";
import { initializeSeeds } from "./initializeSeeds";
import { migrationManager } from "./migrationManager";
import { runtimeValidator } from "./runtimeValidator";
import { clearAllData } from "../persistence/storage";

/**
 * Executes startup checks synchronously to block rendering and
 * guarantee absolute storage consistency before React mounts.
 */
export const initializeERP = () => {
  if (bootstrapState.isInitialized) {
    return;
  }

  bootstrapState.isInitializing = true;
  bootstrapState.error = null;
  console.log("[InitializationEngine] Starting Centralized ERP Initialization sequence...");

  try {
    // 1. Storage Layout setup and inline repairs
    initializeStorage.ensureRequiredKeys();

    // 2. First-load detection and seeding
    initializeSeeds.checkAndSeed();

    // 3. Schema version verification & evolution
    migrationManager.runMigrations();

    // 4. Structural validation diagnostics
    const validation = runtimeValidator.validateAll();
    if (!validation.valid) {
      throw new Error(`Data Integrity Violated: ${validation.error}`);
    }

    bootstrapState.isInitialized = true;
    bootstrapState.isInitializing = false;
    console.log("[InitializationEngine] Centralized ERP Initialization completed successfully.");
  } catch (error) {
    bootstrapState.error = error.message;
    bootstrapState.isInitializing = false;
    console.error("[InitializationEngine] CRITICAL BOOT ERROR:", error);
  }
};

/**
 * Triggers a safe, targeted demo reset and complete data re-seed
 * without invoking full browser reload chaos.
 * @returns {boolean} Success status
 */
export const resetERPData = () => {
  console.warn("[InitializationEngine] Re-seeding ERP Demo Data...");
  
  try {
    // Clear all existing ERP collections in localStorage
    clearAllData();

    // Reset initialization status
    bootstrapState.isInitialized = false;

    // Force seed database
    initializeSeeds.checkAndSeed(true);

    // Re-run initialization pipeline (storage setup, migrations, validation)
    initializeERP();

    if (bootstrapState.isInitialized) {
      window.dispatchEvent(new Event("erp-reset-event"));
    }

    return bootstrapState.isInitialized;
  } catch (error) {
    console.error("[InitializationEngine] Demo Reset Failure:", error);
    return false;
  }
};

export default {
  initializeERP,
  resetERPData,
};
