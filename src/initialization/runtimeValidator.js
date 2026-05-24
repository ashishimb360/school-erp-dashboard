/**
 * initialization/runtimeValidator.js
 * Validates active localStorage structures to ensure structural and ID consistency.
 * Prevents corrupted data streams from propagating into the view layer.
 */

import { STORAGE_KEYS } from "../persistence/storageKeys";
import { getItem } from "../persistence/storage";

/**
 * Validates a specific collection for structure and required fields.
 */
export const validateCollection = (key, requiredFields = [], expectedIdPrefix = "") => {
  const data = getItem(key);
  
  // A missing collection is invalid if it is a critical table
  if (!data) {
    return { valid: false, error: `Collection "${key}" is missing from storage.` };
  }
  
  if (!Array.isArray(data)) {
    return { valid: false, error: `Collection "${key}" is not formatted as an array.` };
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    if (!item || typeof item !== "object") {
      return { valid: false, error: `Item at index ${i} in "${key}" is not a valid object.` };
    }

    // Required fields check
    for (const field of requiredFields) {
      let value = item[field];
      if (field === "name" && key === STORAGE_KEYS.TEACHERS) {
        value = (item.name !== undefined && item.name !== null) ? item.name : item.metadata?.name;
      }
      if (value === undefined || value === null) {
        return { valid: false, error: `Item at index ${i} in "${key}" is missing required field "${field}".` };
      }
    }

    // ID prefix check for prefix stability
    if (expectedIdPrefix && typeof item.id === "string" && !item.id.startsWith(expectedIdPrefix)) {
      console.warn(`[RuntimeValidator] Item ID "${item.id}" at index ${i} in "${key}" does not match expected prefix "${expectedIdPrefix}".`);
    }
  }

  return { valid: true };
};

export const runtimeValidator = {
  /**
   * Run structural diagnostics across all critical institutional entities.
   * Checks students, teachers, classes, subjects, streams, and system credentials.
   */
  validateAll: () => {
    const validations = [
      { key: STORAGE_KEYS.STUDENTS, fields: ["id", "name", "classId"], prefix: "stud-" },
      { key: STORAGE_KEYS.TEACHERS, fields: ["id", "name"], prefix: "teach-" },
      { key: STORAGE_KEYS.CLASSES, fields: ["id", "name"], prefix: "" },
      { key: STORAGE_KEYS.SUBJECTS, fields: ["id", "name"], prefix: "" },
      { key: STORAGE_KEYS.STREAMS, fields: ["id", "name", "subjectIds"], prefix: "" },
      { key: STORAGE_KEYS.AUTH_USERS, fields: ["id", "username", "role", "linkedEntityId"], prefix: "" },
    ];

    for (const validation of validations) {
      const res = validateCollection(validation.key, validation.fields, validation.prefix);
      if (!res.valid) {
        return res;
      }
    }

    return { valid: true };
  }
};

export default runtimeValidator;
