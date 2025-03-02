"use client"

import { memo } from 'react';
import Link from "next/link";
import type { User } from "next-auth";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EarthIcon, HomeIcon, MenuIcon, TextIcon, UserIcon } from "lucide-react";
import { GithubIcon } from "lucide-react";
import { handleGithubSignIn, handleSignOut } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

const NAVIGATION_ITEMS = [
    { href: "/", label: "Home", Icon: HomeIcon },
    { href: "/explore", label: "Explore", Icon: EarthIcon },
    { href: "/about", label: "About", Icon: TextIcon },
] as const;

const FALLBACK_AVATAR = "https://placehold.co/32x32";
const BRAND_NAME = "Byte";

interface NavigationItemProps {
    href: string;
    label: string;
    Icon: typeof HomeIcon;
}

const NavigationItem = memo(function NavigationItem({ href, label, Icon }: NavigationItemProps) {
    return (
        <Button className="w-full mb-2" asChild>
            <Link href={href} className="relative flex items-center justify-center">
                <Icon className="absolute left-3" aria-hidden="true" />
                <span>{label}</span>
            </Link>
        </Button>
    );
});

const NavigationItems = memo(function NavigationItems() {
    return (
        <>
            {NAVIGATION_ITEMS.map((item) => (
                <NavigationItem key={item.href} {...item} />
            ))}
        </>
    );
});

interface UserMenuProps {
    user: Pick<User, "name" | "image">;
}

const UserMenu = memo(function UserMenu({ user }: UserMenuProps) {
    const displayName = user.name || "Unbekannt";
    const avatarUrl = user.image || FALLBACK_AVATAR;
    
    return (
        <>
            <Link 
                className="text-xs mr-2 truncate max-w-[100px] overflow-hidden whitespace-nowrap" 
                href="/"
                title={displayName}
            >
                @{displayName}
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar>
                        <AvatarImage 
                            src={avatarUrl} 
                            alt={`${displayName}'s Avatar`}
                        />
                        <AvatarFallback>
                            <Skeleton className="h-12 w-12 rounded-full"/>
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/" className="flex items-center">
                            <UserIcon className="mr-2" aria-hidden="true" />
                            <span>Profil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={handleSignOut}
                        className="flex items-center"
                    >
                        <span className="mr-2">
                            <CloseIcon aria-hidden="true" />
                        </span>
                        <span>Abmelden</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
});

const LoginButton = memo(function LoginButton() {
    return (
        <form action={handleGithubSignIn}>
            <Button className="text-xs px-2" type="submit">
                <GithubIcon className="mr-2" aria-hidden="true" />
                <span>Anmelden</span>
            </Button>
        </form>
    );
});

const BrandLogo = memo(function BrandLogo() {
    return (
        <Link href="/">
            <p className="font-black tracking-tighter text-2xl">
                {BRAND_NAME}
            </p>
        </Link>
    );
});

interface MobileNavProps {
    user: User | null;
}

export function MobileNav({ user }: MobileNavProps) {
    return (
        <header className="content-center w-auto min-h-12 px-3 py-1 bg-white-100 drop-shadow mt-5 mx-5 rounded-[16px]">
            <nav className="flex items-center justify-between" aria-label="Mobile navigation">
                <BrandLogo />

                <Sheet>
                    <SheetTrigger aria-label="Open menu">
                        <MenuIcon />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col h-full">
                        <SheetHeader>
                            <SheetTitle className="font-black tracking-tighter text-2xl">
                                {BRAND_NAME}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-auto">
                            <NavigationItems />
                        </div>
                        <SheetFooter>
                            <div className="flex items-center justify-center">
                                {user ? (
                                    <UserMenu user={user} />
                                ) : (
                                    <LoginButton />
                                )}
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    );
} 