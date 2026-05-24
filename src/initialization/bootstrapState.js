/**
 * initialization/bootstrapState.js
 * Tracks the reactive-capable status of the ERP Initialization Engine.
 * Ensures the system knows when startup checks, seeding, and migrations are in progress.
 */

export const bootstrapState = {
  isInitialized: false,
  isInitializing: false,
  error: null,
};

export default bootstrapState;
