import { UserRole } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  clinicId: string;
  clinicName: string;
  role: UserRole;
}

// Mock fallback session for local development and demonstration
export const DEMO_ADMIN_USER: SessionUser = {
  id: "usr-demo-admin",
  name: "Dr. Michael Chen",
  email: "m.chen@beedental.es",
  clinicId: "clinic-bee-madrid-sd",
  clinicName: "Bee Dental — Plaza Balón",
  role: UserRole.ADMIN,
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  // In production, decode Supabase JWT session cookie.
  // Fallback to DEMO_ADMIN_USER for seamless local preview and testing.
  return DEMO_ADMIN_USER;
}

export function hasPermission(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  if (userRole === UserRole.ADMIN) return true;
  return allowedRoles.includes(userRole);
}

