'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EditProfileButtonProps {
    profileId: string;
}

export function EditProfileButton({ profileId }: EditProfileButtonProps) {
    const router = useRouter();

    return (
        <Button 
            variant="outline" 
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => {
                router.push(`/profile/${profileId}/edit`);
            }}
        >
            Profil bearbeiten
        </Button>
    );
} 