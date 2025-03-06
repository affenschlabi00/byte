import { client, writeClient } from "@/sanity/lib/client";
import { User } from "next-auth";

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
                githubUsername: user.email?.split("@")[0] || "",
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
        githubUsername: user.email?.split("@")[0] || "",
        role: "user",
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
}

export async function getUser(githubId: string) {
    return await client.fetch(
        `*[_type == "user" && githubId == $githubId][0]`,
        { githubId }
    );
} 