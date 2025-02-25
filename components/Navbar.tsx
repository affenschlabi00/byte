import React from 'react';
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Button} from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {GithubIcon, UserIcon} from "lucide-react";
import {auth, signIn, signOut} from "@/auth";
import {Skeleton} from "@/components/ui/skeleton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

async function Navbar() {

    const session = await auth()

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
                    {session && session?.user ? (
                        <>
                            {/* TODO: Link to user-page */}
                            <Link className="text-xs truncate max-w-[75px] overflow-hidden whitespace-nowrap" href="/">
                                @{session.user.name}
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <Avatar>
                                        <AvatarImage src={session.user.image ? session.user.image : "https://placehold.co/32x32"} alt="avatar" />
                                        <AvatarFallback><Skeleton className="h-12 w-12 rounded-full"/></AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        {/* TODO: Link to user-page */}
                                        <Link href="/">
                                            <UserIcon />Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={async () => {
                                            "use server"

                                            await signOut();
                                        }}
                                    >
                                        <CloseIcon/> Abmelden
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (

                        <form
                            action={async () => {
                                "use server"
                                await signIn("github")
                            }}
                        >
                            <Button className="h-6 text-xs px-2" type="submit">
                                <GithubIcon /> Anmelden
                            </Button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;