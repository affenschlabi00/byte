"use server";

import { signIn, signOut } from "@/auth";

export async function handleGithubSignIn() {
    await signIn("github");
}

export async function handleSignOut() {
    await signOut();
} 