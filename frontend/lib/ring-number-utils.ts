export const RING_PREFIX = "GL-";
export const CURRENT_YEAR = new Date().getFullYear().toString().slice(-2);

/**
 * Normalizes a ring number by ensuring it starts with the correct prefix
 * and follows the standard format (e.g., GL-YEAR-NUMBER or GL-NUMBER).
 */
export const normalizeRingNumber = (value: string): string => {
    let cleaned = value.toUpperCase().trim();

    if (!cleaned) return "";

    // Remove existing prefix if it's already there to re-add it correctly
    if (cleaned.startsWith(RING_PREFIX)) {
        cleaned = cleaned.replace(RING_PREFIX, "");
    }

    // Ensure it doesn't have multiple 'GL-'
    return `${RING_PREFIX}${cleaned}`;
};

/**
 * Generates a default ring number suggestion for new pigeons.
 */
export const suggestRingNumber = (lastNumber?: number): string => {
    const year = CURRENT_YEAR;
    const nextNumber = lastNumber ? (lastNumber + 1).toString().padStart(4, "0") : "0001";
    return `${RING_PREFIX}${year}-${nextNumber}`;
};
