import { auth } from "@/auth";
import { Nav } from "./Nav";

export async function AuthenticatedNav() {
    const session = await auth();
    return <Nav user={session?.user ?? null} />;
} 