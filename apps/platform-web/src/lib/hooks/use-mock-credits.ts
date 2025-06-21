import { mockCredits } from "../mock-data/credits";
import { CreditsSummary } from "../types/credits";

export function useMockCredits(): { credits: CreditsSummary } {
  return { credits: mockCredits };
}
