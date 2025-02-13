"use client"

import React from 'react';
import {Card} from "@/components/ui/card";
import {CardContent} from "@/components/ui/card";

function TopAuthorCard({ author }: { author: any }) {
    return (
        <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-3xl font-semibold">{author}</span>
            </CardContent>
        </Card>
    );
}

export default TopAuthorCard;