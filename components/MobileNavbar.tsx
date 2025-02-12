import React from 'react';
import Link from "next/link";
import {
    Sheet,
    SheetContent, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {EarthIcon, GithubIcon, HomeIcon, MenuIcon, TextIcon, UserIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {auth, signIn, signOut} from "@/auth";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";


async function MobileNavbar() {

    const session = await auth()

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
                                {session && session?.user ? (
                                    <>
                                        <Link className="text-xs mr-2 truncate max-w-[100px] overflow-hidden whitespace-nowrap" href="/">
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
                                    /* TODO: Add Sign-in functionality */
                                    <form
                                        action={async () => {
                                            "use server"
                                            await signIn("github")
                                        }}
                                    >
                                        <Button className="text-xs px-2" type="submit">
                                            <GithubIcon /> Anmelden
                                        </Button>
                                    </form>
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