"use client"

import { useEffect, useState, useCallback } from "react";
import PostCard from "./PostCard";
import type { Post } from "./PostCard";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationPrevious, 
    PaginationNext, 
    PaginationLink 
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface PostsGridProps {
    authorId?: string;
}

interface PostsResponse {
    data: {
        posts: Post[];
        totalPages: number;
    };
    status: number;
}

const POSTS_PER_PAGE = 3;

export function PostsGrid({ authorId }: PostsGridProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const url = new URL('/api/posts', window.location.origin);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', POSTS_PER_PAGE.toString());
            if (authorId) {
                url.searchParams.append('authorId', authorId);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data: { posts, totalPages } } = await response.json() as PostsResponse;

            setPosts(posts);
            setTotalPages(totalPages);
        } catch (error) {
            toast({
                title: "Fehler beim Laden der Posts",
                description: error instanceof Error ? error.message : "Bitte versuchen Sie es später erneut.",
                variant: "destructive",
            });
            console.error("Error fetching posts:", error);
            setPosts([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [authorId]);

    const handlePageChange = useCallback((page: number) => {
        if (page === currentPage) return;
        setCurrentPage(page);
    }, [currentPage]);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, fetchPosts]);

    const renderPaginationItems = useCallback(() => (
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
                <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                >
                    {page}
                </PaginationLink>
            </PaginationItem>
        ))
    ), [currentPage, totalPages, handlePageChange]);

    const renderSkeletons = useCallback(() => (
        Array.from({ length: POSTS_PER_PAGE }, (_, index) => (
            <Card key={`skeleton-${index}`} className="max-w-sm min-w-sm w-full p-5">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-40" />
                    <div className="flex justify-between items-center gap-1">
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </div>
                <div className="py-2">
                    <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="w-full aspect-square rounded-2xl" />
                <Skeleton className="h-9 w-full mt-4 rounded-md" />
            </Card>
        ))
    ), []);

    const renderPosts = useCallback(() => (
        posts.map((post, index) => (
            <PostCard 
                key={`post-${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${post.views}-${index}`}
                post={post}
            />
        ))
    ), [posts]);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid sm:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] grid-cols-1 gap-5 w-full p-8 justify-items-center max-w-7xl">
                {isLoading ? renderSkeletons() : renderPosts()}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-6 mb-12">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                isActive={currentPage === 1}
                                className="cursor-pointer"
                            />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                isActive={currentPage === totalPages}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
