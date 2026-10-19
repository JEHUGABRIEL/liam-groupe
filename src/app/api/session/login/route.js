import { openSession } from "../_shared";

export function POST(request) {
  return openSession(request, "/api/auth/login");
}
