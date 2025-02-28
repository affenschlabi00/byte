import React from 'react';
import Image from "next/image";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EyeIcon} from "lucide-react";

interface Asset {
    url: string;
    originalFilename: string;
    mimeType: string;
}

interface FileAsset {
    _id: string;
    url: string;
    originalFilename: string;
    mimeType: string;
}

interface Post {
    title: string;
    description: string;
    views: number;
    preview?: { asset: Asset };
    files?: { asset: FileAsset }[];
}

function PostCard({ post }: { post: Post }) {
    return (
        <Card className="max-w-sm min-w-sm w-full p-5">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{post.title}</h2>
                <div className="flex justify-between items-center gap-1">
                    <p className="text-md font-black">{post.views}</p>
                    <EyeIcon />
                </div>
            </div>
            <p className="overflow-scroll h-16 text-black-200 py-2">{post.description.length > 85 ? (post.description.slice(0, 85) + "...") : (post.description)}</p>

            <Image src={post.preview?.asset.url || ""} alt={post.preview?.asset.originalFilename || "Preview Image"}
                   className="rounded-2xl scale-100 w-full object-cover aspect-square drop-shadow"
                   width={600} height={400}/>

            <Button className="w-full">Post anschauen!</Button>
        </Card>
    );
}

export default PostCard;