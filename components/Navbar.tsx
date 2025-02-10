import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {Button} from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {GithubIcon} from "lucide-react";

function Navbar() {

    const login = true;

    return (
        <header className="content-center w-auto min-h-12 px-3 py-1 bg-white-100 drop-shadow mt-5 mr-5 ml-5 rounded-[16px]">
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Link href="/">
                        <p className="font-black tracking-tighter text-2xl">
                            Byte
                        </p>
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        <Button className="h-6 text-xs">
                                            Home
                                        </Button>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/explore" legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        <Button className="h-6 text-xs">
                                            Explore
                                        </Button>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/about" legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        <Button className="h-6 text-xs">
                                            About
                                        </Button>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-2.5">
                    {login ? (
                        <>
                            {/* TODO: Link to user-page */}
                            <Link className="text-xs" href="/">
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
                        <Button className="h-6 text-xs px-2">
                            <GithubIcon /> Anmelden
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;