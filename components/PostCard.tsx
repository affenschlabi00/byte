"use client"

import React, { memo } from 'react';
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
    url: string;
    originalFilename: string;
    mimeType: string;
}

interface FileAsset extends Asset {
    _id: string;
}

export interface Post {
    title: string;
    description: string;
    views: number;
    preview?: { asset: Asset };
    files?: { asset: FileAsset }[];
}

interface PostCardProps {
    post: Post;
    className?: string;
}

const DESCRIPTION_MAX_LENGTH = 85;

export default memo(function PostCard({ post, className }: PostCardProps) {
    const {
        title,
        description,
        views,
        preview
    } = post;

    const truncatedDescription = description.length > DESCRIPTION_MAX_LENGTH
        ? `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`
        : description;

    return (
        <Card className={cn("max-w-sm min-w-sm w-full p-5", className)}>
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold line-clamp-1">{title}</h2>
                <div className="flex justify-between items-center gap-1">
                    <p className="text-md font-black">{views}</p>
                    <EyeIcon className="h-5 w-5" />
                </div>
            </div>
            
            <p className="h-16 text-black-200 py-2 overflow-y-auto scrollbar-thin">
                {truncatedDescription}
            </p>

            <div className="relative w-full aspect-square">
                <Image 
                    src={preview?.asset.url || "/placeholder.jpg"}
                    alt={preview?.asset.originalFilename || title}
                    className="rounded-2xl object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
            </div>

            <Button className="w-full mt-4">
                Post anschauen!
            </Button>
        </Card>
    );
});