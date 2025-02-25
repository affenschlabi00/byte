"use client"

import { useEffect, useState } from "react";
import PostCard from "./PostCard"; // Your PostCard component
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";

const PostsGrid = () => {
    const POSTS_PER_PAGE = 3;
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPosts = async (page: number) => {
        const response = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
        const { data: {posts, totalPages} } = await response.json();

        setPosts(posts);
        setTotalPages(totalPages);
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid sm:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] grid-cols-1 gap-5 w-full p-8 justify-items-center max-w-7xl">
                {posts.map((post, index) => (
                    <PostCard post={post} key={index} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="cursor-pointer"
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={page === currentPage}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default PostsGrid;
