import { POSTS_QUERY, TOTAL_POSTS_COUNT_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import {NextResponse} from "next/server";
import { rateLimit } from "../limiter";

const cache = new Map(); // use REDIS in future!!!

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

async function getCachedData(key: string) {
    return cache.get(key) || null;
}

async function setCachedData(key: string, data: { posts: Post[], totalPages: number, currentPage: number }, ttl = 60) {
    cache.set(key, data);
    setTimeout(() => cache.delete(key), ttl * 1000);
}

export async function GET(req: Request) {

    const rateLimitResult = await rateLimit();
    if (rateLimitResult.limited) {
        return NextResponse.json({ error: rateLimitResult.message }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "9";

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    try {
        const cacheKey = `posts-${pageNumber}-${limitNumber}`;
        let cachedData = await getCachedData(cacheKey);

        if (!cachedData) {
            const posts = await client.fetch(POSTS_QUERY(pageNumber, limitNumber));
            const totalPosts = await client.fetch(TOTAL_POSTS_COUNT_QUERY);
            const totalPages = Math.ceil(totalPosts / limitNumber);

            cachedData = { posts, totalPages, currentPage: pageNumber };
            await setCachedData(cacheKey, cachedData);
        }

        return NextResponse.json({
            status: 200,
            data: cachedData
        })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Could not fetch posts"}, { status: 400})
    }
}
