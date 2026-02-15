import { useLofts } from "./useLofts";
import { useBirds } from "./useBirds";

export type OnboardingStatus =
  | "loading"
  | "needs_loft"
  | "needs_bird"
  | "ready";

export function useOnboardingStatus() {
  const { lofts, isLoading: isLoftsLoading } = useLofts();
  const { data: birdsData, isLoading: isBirdsLoading } = useBirds({ limit: 1 });

  if (isLoftsLoading || isBirdsLoading) {
    return "loading";
  }

  if (!lofts || lofts.length === 0) {
    return "needs_loft";
  }

  if (!birdsData || birdsData.total === 0) {
    return "needs_bird";
  }

  return "ready";
}
