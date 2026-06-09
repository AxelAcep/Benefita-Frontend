import { getSession } from "@/lib/services/login.service";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
const FINANCE_ROLES = ["SUPER_ADMIN", "ADMIN", "FINANCE"];

export function useRole() {
  const session = getSession();
  const role = session?.user?.role ?? "";

  return {
    role,
    isAdmin: ADMIN_ROLES.includes(role),
    isFinance: FINANCE_ROLES.includes(role),
    isLoggedIn: !!session,
  };
}
