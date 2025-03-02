import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { rateLimit } from "../limiter";
import { auth } from "@/auth";

const cache = new Map(); // use REDIS in future!!!

interface Author {
    _id: string;
    name: string;
    image: string;
    postCount: number;
    bio?: string;
}

const TOP_AUTHORS_QUERY = `
    *[_type == "user" && count(posts) > 0] | order(count(posts) desc)[0...5] {
        _id,
        name,
        image,
        bio,
        "postCount": count(posts)
    }
`;

async function getCachedData(key: string) {
    return cache.get(key) || null;
}

async function setCachedData(key: string, data: Author[], ttl = 60) {
    cache.set(key, data);
    setTimeout(() => cache.delete(key), ttl * 1000);
}

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const rateLimitResult = await rateLimit();
    if (rateLimitResult.limited) {
        return NextResponse.json(
            { error: rateLimitResult.message }, 
            { status: 429 }
        );
    }

    try {
        const cacheKey = "top-authors";
        let cachedData = await getCachedData(cacheKey);

        if (!cachedData) {
            const authors = await client.fetch(TOP_AUTHORS_QUERY);
            cachedData = authors;
            await setCachedData(cacheKey, cachedData);
        }

        return NextResponse.json({
            status: 200,
            data: cachedData
        });
    } catch (error) {
        console.error("Error fetching top authors:", error);
        return NextResponse.json(
            { error: "Could not fetch top authors" }, 
            { status: 400 }
        );
    }
} 