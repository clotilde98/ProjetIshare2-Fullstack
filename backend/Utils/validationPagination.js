export function validatePagination(value, defaultValue, min, max, paramName) {
  let intValue = value === undefined ? defaultValue : Number(value);

  if (!Number.isInteger(intValue)) {
    intValue = defaultValue;
  }

  if (intValue < min || intValue > max) {
    throw new PaginationValidationError(
      `${paramName} must be a number between ${min} and ${max}`
    );
  }

  return intValue;
}