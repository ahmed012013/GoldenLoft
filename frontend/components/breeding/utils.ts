import { EggStatus } from "@/lib/breeding-api";

/**
 * Returns the CSS classes for status badges based on the status string.
 * This function handles both EggStatus and general health statuses (healthy/sick).
 */
export function getSquabStatusColor(status: string | EggStatus): string {
    switch (status) {
        // Egg Statuses
        case EggStatus.LAID:
            return "bg-yellow-100 text-yellow-800";
        case EggStatus.HATCHED:
        case "healthy": // Also used for squabs
            return "bg-green-100 text-green-800";
        case EggStatus.INFERTILE:
        case "sick": // Also used for squabs
            return "bg-red-100 text-red-800";
        case EggStatus.BROKEN:
            return "bg-orange-100 text-orange-800";
        case EggStatus.DEAD_IN_SHELL:
            return "bg-gray-100 text-gray-800";

        // Default fallback
        default:
            return "bg-gray-100 text-gray-800";
    }
}
