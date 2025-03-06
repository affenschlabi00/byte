"use server"

import { client, writeClient } from "@/sanity/lib/client";
import { User } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ProfileComponent, ProfileTheme } from "@/types/profile";

export async function syncUser(user: User) {
    if (!user.email || !user.id) return null;

    const existingUser = await client.fetch(
        `*[_type == "user" && (email == $email || githubId == $githubId)][0]`,
        { 
            email: user.email,
            githubId: user.id
        }
    );

    if (existingUser) {
        return await writeClient
            .patch(existingUser._id)
            .set({
                name: user.name,
                email: user.email,
                image: user.image,
                githubId: user.id,
                githubUsername: user.name,
                updatedAt: new Date().toISOString(),
            })
            .commit();
    }

    return await writeClient.create({
        _type: "user",
        name: user.name,
        email: user.email,
        image: user.image,
        githubId: user.id,
        githubUsername: user.name,
        role: "user",
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
}

export async function updateUserBio(bio: string) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Nicht autorisiert")
    }

    try {
        await writeClient
            .patch(session.user.id)
            .set({ bio })
            .commit()

        revalidatePath(`/profile/${session.user.id}`)
        return { success: true }
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Bio:", error)
        return { 
            success: false, 
            error: "Bio konnte nicht aktualisiert werden" 
        }
    }
}

export async function deleteUserAccount() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Nicht autorisiert")
    }

    try {
        // Lösche zuerst alle Posts des Benutzers
        const userPosts = await writeClient.fetch(
            `*[_type == "post" && author._ref == $userId]._id`,
            { userId: session.user.id }
        )

        // Batch-Delete für Posts
        if (userPosts.length > 0) {
            await writeClient.delete({
                query: '*[_type == "post" && author._ref == $userId]',
                params: { userId: session.user.id }
            })
        }

        // Lösche das Benutzerkonto
        await writeClient.delete(session.user.id)

        // Leite zur Startseite weiter
        redirect('/')
    } catch (error) {
        console.error("Fehler beim Löschen des Kontos:", error)
        return { 
            success: false, 
            error: "Konto konnte nicht gelöscht werden" 
        }
    }
}

interface UpdateProfileData {
    components: ProfileComponent[];
    theme: ProfileTheme;
}

export async function updateUserProfile(data: UpdateProfileData) {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Nicht autorisiert")
    }

    try {
        await writeClient
            .patch(session.user.id)
            .set({
                components: data.components,
                theme: data.theme,
                updatedAt: new Date().toISOString(),
            })
            .commit()

        revalidatePath(`/profile/${session.user.id}`)
        return { success: true }
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Profils:", error)
        return { 
            success: false, 
            error: "Profil konnte nicht aktualisiert werden" 
        }
    }
} 