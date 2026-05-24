/**
 * providerFactory.js
 *
 * Provider Factory for Runtime Data Provider Switching
 *
 * This factory allows switching between localStorage and API providers
 * at runtime via configuration.
 *
 * CONFIGURATION:
 * - Set DATA_PROVIDER environment variable to "local" or "api"
 * - Default: "local" (localStorage)
 *
 * USAGE:
 *   import { getDataProvider } from './data/providers/providerFactory';
 *   const provider = getDataProvider();
 *   const students = await provider.getStudents();
 *
 * IMPORTANT:
 * - Services should use this factory, NOT import providers directly
 * - This enables seamless backend migration without service changes
 */

import localProvider from "./localProvider";
import apiProvider from "./apiProvider";
import { validateProvider } from "./providerInterface";

// Provider type configuration
const PROVIDER_TYPES = {
  LOCAL: "local",
  API: "api",
};

// Default provider type (can be overridden by environment variable)
let currentProviderType = PROVIDER_TYPES.LOCAL;

// Check for environment variable (for future backend switch)
// Note: process.env is Node.js only, window.DATA_PROVIDER for browser
if (typeof window !== "undefined" && window.DATA_PROVIDER) {
  // Support window-level configuration for browser environments
  currentProviderType = window.DATA_PROVIDER.toLowerCase();
}

// Validate provider type
if (
  currentProviderType !== PROVIDER_TYPES.LOCAL &&
  currentProviderType !== PROVIDER_TYPES.API
) {
  console.warn(
    `[providerFactory] Invalid DATA_PROVIDER "${currentProviderType}", defaulting to "local"`,
  );
  currentProviderType = PROVIDER_TYPES.LOCAL;
}

// Select provider based on configuration
const selectedProvider =
  currentProviderType === PROVIDER_TYPES.API ? apiProvider : localProvider;

// Validate the selected provider implements the interface
try {
  validateProvider(selectedProvider);
  console.log(
    `[providerFactory] Using ${currentProviderType.toUpperCase()} provider`,
  );
} catch (error) {
  console.error(
    `[providerFactory] Provider validation failed: ${error.message}`,
  );
  throw new Error(
    `Data provider does not implement required interface: ${error.message}`,
  );
}

/**
 * Gets the currently configured data provider
 * @returns {Object} Data provider instance implementing DataProviderInterface
 */
export function getDataProvider() {
  return selectedProvider;
}

/**
 * Gets the current provider type
 * @returns {string} Provider type ("local" or "api")
 */
export function getProviderType() {
  return currentProviderType;
}

/**
 * Sets the provider type at runtime (for testing or dynamic switching)
 * WARNING: This should typically only be used in development/testing
 * @param {string} providerType - "local" or "api"
 */
export function setProviderType(providerType) {
  if (
    providerType !== PROVIDER_TYPES.LOCAL &&
    providerType !== PROVIDER_TYPES.API
  ) {
    throw new Error(`Invalid provider type: ${providerType}`);
  }

  console.warn(
    `[providerFactory] Switching provider from "${currentProviderType}" to "${providerType}"`,
  );
  currentProviderType = providerType;
  // Note: This doesn't actually switch the provider in this simple implementation
  // In a more advanced implementation, you'd want to re-initialize the provider
}

/**
 * Checks if using local storage provider
 * @returns {boolean}
 */
export function isLocalProvider() {
  return currentProviderType === PROVIDER_TYPES.LOCAL;
}

/**
 * Checks if using API provider
 * @returns {boolean}
 */
export function isApiProvider() {
  return currentProviderType === PROVIDER_TYPES.API;
}

export default getDataProvider;
