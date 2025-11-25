import { cookies } from "next/headers";

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("auth_session"); 
  return token?.value ?? null;
}
