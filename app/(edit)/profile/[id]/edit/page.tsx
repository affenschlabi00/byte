import { auth } from "@/auth";
import { ProfileBuilder } from "@/components/ProfileBuilder";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Profile } from "@/types/profile";

interface EditProfilePageProps {
    params: {
        id: string;
    };
}

async function getProfileData(userId: string): Promise<Profile | null> {
    const query = groq`*[_type == "user" && _id == $userId][0]{
        _id,
        name,
        email,
        image,
        bio,
        githubUsername,
        components,
        theme,
        role,
        joinedAt
    }`;

    try {
        const profile = await client.fetch<Profile>(query, { userId });
        return profile;
    } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
        return null;
    }
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
    const session = await auth();
    const { id } = await params;
    const profile = await getProfileData(id);

    if (!profile) {
        notFound();
    }

    const isOwnProfile = session?.user?.id === profile._id;

    if (!isOwnProfile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-4">
                <div className="bg-white rounded-lg shadow-sm">
                    <ProfileBuilder profile={profile} />
                </div>
            </div>
        </div>
    );
} 