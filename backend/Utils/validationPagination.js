import { PaginationValidationError } from "../errors/PaginationValidationError.js"; 

export function validatePagination(value, defaultValue, min, max, paramName) {
  
    const intValue = value === undefined ? defaultValue : Number(value);

  if (!Number.isFinite(intValue) || intValue < min || intValue > max) {
    throw new PaginationValidationError(`${paramName} must be a number between ${min} and ${max}`);
  }

  return intValue;
} 