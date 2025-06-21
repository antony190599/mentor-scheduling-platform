import { mockMentors } from "../mock-data/mentors";
import { User } from "../types/session";

export function useMockMentors(): { mentors: User[] } {
  return { mentors: mockMentors };
}
