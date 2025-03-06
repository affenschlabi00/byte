"use client"

import { useEffect, useState, useCallback } from "react";
import TopAuthorCard, { Author } from "./TopAuthorCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorsResponse {
    data: Author[];
    status: number;
}

export function TopAuthorsGrid() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAuthors = useCallback(async () => {
        try {
            const response = await fetch('/api/authors');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { data } = await response.json() as AuthorsResponse;
            setAuthors(data);
        } catch (error) {
            toast({
                title: "Fehler beim Laden der Top-Autoren",
                description: error instanceof Error ? error.message : "Bitte versuchen Sie es später erneut.",
                variant: "destructive",
            });
            console.error("Error fetching authors:", error);
            setAuthors([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    const renderSkeletons = useCallback(() => (
        Array.from({ length: 5 }, (_, index) => (
            <CarouselItem key={`skeleton-${index}`} className="pl-1 md:basis-1/2 lg:basis-1/5">
                <Card className="p-1">
                    <div className="pt-6 flex flex-col items-center">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 mt-4" />
                        <Skeleton className="h-4 w-16 mt-2" />
                    </div>
                </Card>
            </CarouselItem>
        ))
    ), []);

    const renderAuthors = useCallback(() => (
        authors.map((author) => (
            <CarouselItem key={author._id} className="pl-1 md:basis-1/2 lg:basis-1/5">
                <div className="p-1">
                    <TopAuthorCard author={author} />
                </div>
            </CarouselItem>
        ))
    ), [authors]);

    return (
        <div className="w-full 2xl:max-w-[85rem] lg:max-w-4xl md:max-w-xl xs:max-w-64 max-w-48 flex flex-col items-center my-10">
            <h2 className="text-black font-bold md:text-2xl text-xl">Top Autoren</h2>
            <p className="text-black-100 md:text-md text-xs text-nowrap">
                Hier ist eine kleine Auflistung der momentan besten Autoren!
            </p>
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {isLoading ? renderSkeletons() : renderAuthors()}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
} 