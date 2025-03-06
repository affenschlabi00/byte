import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfileRedirect() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }
    
    redirect(`/profile/${session.user.id}`);
} 