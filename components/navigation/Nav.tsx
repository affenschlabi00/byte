"use client"

import { memo } from 'react';
import Link from "next/link";
import type { User } from "next-auth";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GithubIcon, UserIcon } from "lucide-react";
import { handleGithubSignIn, handleSignOut } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

const NAVIGATION_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
] as const;

const FALLBACK_AVATAR = "https://placehold.co/32x32";
const BRAND_NAME = "Byte";

const NavigationItem = memo(function NavigationItem({ href, label }: { href: string; label: string }) {
    return (
        <NavigationMenuItem>
            <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink>
                    <Button className="h-6 text-xs">
                        {label}
                    </Button>
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    );
});

const NavigationItems = memo(function NavigationItems() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {NAVIGATION_ITEMS.map((item) => (
                    <NavigationItem key={item.href} {...item} />
                ))}
            </NavigationMenuList>
        </NavigationMenu>
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
                className="text-xs truncate max-w-[75px] overflow-hidden whitespace-nowrap" 
                href="/profile"
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
                <DropdownMenuContent>
                    <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                            <UserIcon aria-hidden="true" />
                            <span>Profil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={handleSignOut}
                        className="flex items-center gap-2"
                    >
                        <CloseIcon aria-hidden="true" />
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
            <Button className="h-6 text-xs px-2" type="submit">
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

interface NavProps {
    user: User | null;
}

export function Nav({ user }: NavProps) {
    return (
        <header className="content-center w-auto min-h-12 px-3 py-1 bg-white-100 drop-shadow mt-5 mr-5 ml-5 rounded-[16px]">
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <BrandLogo />
                    <NavigationItems />
                </div>

                <div className="flex items-center gap-2.5">
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </nav>
        </header>
    );
} 