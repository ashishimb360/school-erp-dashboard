/**
 * data/index.js
 * 
 * Data Access Layer Entry Point
 * 
 * This is the main export for the data provider abstraction layer.
 * Services should import from here:
 * 
 *   import { getDataProvider } from '../data';
 *   const provider = getDataProvider();
 *   const students = await provider.getStudents();
 * 
 * This centralizes data access and enables provider switching.
 */

export { getDataProvider } from "./providers/providerFactory";
export { default as localProvider } from "./providers/localProvider";
export { default as apiProvider } from "./providers/apiProvider";
export { validateProvider } from "./providers/providerInterface";
