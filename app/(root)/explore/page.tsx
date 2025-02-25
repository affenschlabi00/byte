import {auth} from "@/auth";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import TopAuthorCard from "@/components/TopAuthorCard";
import React from "react";
import {Separator} from "@/components/ui/separator";
import Form from "next/form";
import {SearchIcon, CloseIcon} from "@sanity/icons";
import {Button} from "@/components/ui/button";
import PostsGrid from "@/components/PostsGrid";
import {HeartIcon} from "lucide-react";


export default async function Home() {

    const session = await auth();

    return (

        session && session?.user ? (
        <div className="flex flex-col items-center contain-content">
            <div className="flex container flex-col w-full items-center my-16 py-16 bg-white-100 drop-shadow rounded-xl">
                <h1 className="text-7xl font-black">Explore!</h1>
                <p className="xl:text-2xl md:text-xl text-xs font-bold text-black-200 pt-4">
                    Entdecke Notizen, alte Prüfungen und sonstige Dokumente.
                </p>
            </div>

            <Separator />
            <div className="w-full flex flex-col items-center justify-center bg-white-100">
                <div className="w-full 2xl:max-w-[85rem] lg:max-w-4xl md:max-w-xl xs:max-w-64 max-w-48 flex flex-col items-center my-10 ">
                    <h1 className="text-black font-bold md:text-2xl text-xl">Top Authoren</h1>
                    <p className="text-black-100 md:text-md text-xs text-nowrap">Hier ist eine kleine Auflistung der momentan besten Authoren! </p>
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/5">
                                    <div className="p-1">
                                        <TopAuthorCard author={index} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>

            <Separator />

            <div className="w-full flex flex-col items-center justify-center p-8 md:p-16">
                <Form action="/explore" scroll={false} className="flex items-center w-full border-2 border-white-200 rounded-full">
                    <SearchIcon width={64} height={64} className="text-white-200 size-12 md:size-16" />
                    <input
                        autoComplete="off"
                        name="query"
                        defaultValue=""
                        className="focus:outline-none md:py-6 py-1.5 w-full rounded-full text-xs md:text-sm"
                        placeholder="Dürchstöbere Dokumente..."
                    />
                    <Button className="rounded-full w-6 h-8 md:h-12 md:w-12 mr-3">
                        <CloseIcon width={32} height={32} />
                    </Button>
                </Form>
            </div>

            <PostsGrid />

            <Separator />

            <div className="w-full flex justify-center items-center p-8 md:p-16 text-black-100">
                <div className="flex justify-between gap-1.5">
                    Made with <HeartIcon/> by Kinu!
                </div>
            </div>
        </div>) : (
            <div>
                Nope
            </div>
        )
    );
}
