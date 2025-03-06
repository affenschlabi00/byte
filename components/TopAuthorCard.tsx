"use client"

import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Author {
    _id: string;
    name: string;
    image: string;
    postCount: number;
    bio?: string;
}

interface TopAuthorCardProps {
    author: Author;
    className?: string;
}

export default memo(function TopAuthorCard({ author, className }: TopAuthorCardProps) {
    const { name, image, postCount } = author;

    return (
        <Card className={cn("w-full", className)}>
            <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{postCount} Posts</p>
            </CardContent>
        </Card>
    );
});