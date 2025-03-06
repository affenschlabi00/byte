import { auth } from "@/auth";
import { DynamicProfile } from "@/components/DynamicProfile";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Profile } from "@/types/profile";
import { EditProfileButton } from "@/components/EditProfileButton";

interface ProfilePageProps {
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

export default async function ProfilePage({ params }: ProfilePageProps) {
    const session = await auth();
    const { id } = await params;
    const profile = await getProfileData(id);

    if (!profile) {
        notFound();
    }

    const isOwnProfile = session?.user?.id === profile._id;

    return (
        <div className="w-full relative mt-5">
            {isOwnProfile && (
                <div className="absolute top-5 right-4 z-10">
                    <EditProfileButton profileId={id} />
                </div>
            )}
            <DynamicProfile profile={profile} />
        </div>
    );
} 