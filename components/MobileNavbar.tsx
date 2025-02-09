import React from 'react';
import Link from "next/link";
import {
    Sheet,
    SheetContent, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {EarthIcon, GithubIcon, HomeIcon, MenuIcon, TextIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


function MobileNavbar() {

    const login = false;

    return (
        <header className="content-center w-auto min-h-12 px-3 py-1 bg-white-100 drop-shadow mt-5 mr-5 ml-5 rounded-[16px]">
            <nav className="flex items-center justify-between">
                <Link href="/">
                    <p className="font-black tracking-tighter text-2xl">
                        Byte
                    </p>
                </Link>

                <Sheet>
                    <SheetTrigger><MenuIcon /></SheetTrigger>
                    <SheetContent className="flex flex-col h-full">
                        <SheetHeader>
                            <SheetTitle className="font-black tracking-tighter text-2xl">Byte</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-auto">
                            <Button className="w-full mb-2" asChild>
                                <Link href="/" className="relative flex items-center justify-center">
                                    <HomeIcon className="absolute left-3"/> Home
                                </Link>
                            </Button>
                            <Button className="w-full mb-2" asChild>
                                <Link href="/explore" className="relative flex items-center justify-center">
                                    <EarthIcon className="absolute left-3"/> Explore
                                </Link>
                            </Button>
                            <Button className="w-full mb-2" asChild>
                                <Link href="/about" className="relative flex items-center justify-center">
                                    <TextIcon className="absolute left-3"/> About
                                </Link>
                            </Button>
                        </div>
                        <SheetFooter>
                            <div className="flex items-center justify-center">
                                {login ? (
                                    <>
                                        {/* TODO: Link to user-page */}
                                        <Link className="text-xs mr-2" href="/">
                                            @username
                                        </Link>
                                        <Avatar>
                                            {/* TODO: Use users avatar */}
                                            <AvatarImage src="https://placehold.co/64x64" alt="avatar" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </>
                                ) : (
                                    /* TODO: Add Sign-in functionality */
                                    <Button className="text-xs px-2">
                                        <GithubIcon /> Anmelden
                                    </Button>
                                )}
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    );
}

export default MobileNavbar;