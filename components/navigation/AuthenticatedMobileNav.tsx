import { auth } from "@/auth";
import { MobileNav } from "./MobileNav";

export async function AuthenticatedMobileNav() {
    const session = await auth();
    return <MobileNav user={session?.user ?? null} />;
} 