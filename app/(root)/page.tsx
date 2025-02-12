import Image from "next/image";
import { Button } from "@/components/ui/button";
import {FileTextIcon, GithubIcon, MessageCircle, UserIcon, UsersIcon} from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import React from "react";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {Separator} from "@/components/ui/separator";
import ContactForm from "@/components/ContactForm";

export default async function Home() {
    const session = await auth();

    return (
        <div className="flex flex-col items-center mx-5">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-x-6 gap-y-4">
                    <div className="w-full lg:w-auto mt-12 xs:mt-20">
                        <h1 className="font-bold 2xl:text-8xl md:text-7xl xs:text-6xl text-5xl max-w-lg 2xl:max-w-xl">
                            Dein Hofwil Netzwerk.
                        </h1>
                        <p className="font-medium 2xl:text-4xl lg:text-3xl md:text-2xl xs:text-xl text-lg text-black-200 mt-5">
                            Cooooookies.
                        </p>
                        <p className="font-medium 2xl:text-2xl lg:text-xl md:text-lg xs:text-md text-xs text-black-100 mt-5">
                            Die exklusive Plattform für Hofwil-Schüler.
                        </p>
                        {session && session?.user ? (
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut();
                                }}
                            >
                                <Button className="h-6 text-xs px-2 mt-5" type="submit">
                                    <CloseIcon /> Abmelden
                                </Button>
                            </form>
                        ) : (
                            <form
                                action={async () => {
                                    "use server";
                                    await signIn("github");
                                }}
                            >
                                <Button className="h-6 text-xs px-2 mt-5" type="submit">
                                    <GithubIcon /> Anmelden
                                </Button>
                            </form>
                        )}
                    </div>
                    <div className="w-full lg:w-auto mt-10 xs:mt-20">
                        <Image
                            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="hero-image"
                            priority={false}
                            className="rounded-2xl drop-shadow-xl border border-white shadow-lg w-full"
                            width={600}
                            height={400}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white-100 drop-shadow rounded-2xl my-12 xs:my-20 max-w-7xl mx-auto p-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <div className="flex flex-col items-start bg-white px-8 py-8 rounded-2xl drop-shadow">
                        <MessageCircle width={64} height={64} />
                        <h1 className="mt-2.5 text-3xl xl:text-4xl font-bold">Chat System</h1>
                        <p className="mt-2.5 text-black-100 break-words whitespace-normal">
                            Direkte Kommunikation mit Mitschülern für Fragen und Austausch.
                        </p>
                    </div>
                    <div className="flex flex-col items-start bg-white px-8 py-8 rounded-2xl drop-shadow">
                        <FileTextIcon width={64} height={64} />
                        <h1 className="mt-2.5 text-3xl xl:text-4xl  font-bold">Materialien</h1>
                        <p className="mt-2.5 text-black-100 break-words whitespace-normal">
                            Teile und finde Zusammenfassungen, alte Prüfungen und Notizen.
                        </p>
                    </div>
                    <div className="flex flex-col items-start bg-white px-8 py-8 rounded-2xl drop-shadow">
                        <UserIcon width={64} height={64} />
                        <h1 className="mt-2.5 text-3xl xl:text-4xl  font-bold">Profile</h1>
                        <p className="mt-2.5 text-black-100 break-words whitespace-normal">
                            Personalisiere dein Profil und vernetze dich mit deinen Mitschülern.
                        </p>
                    </div>
                    <div className="flex flex-col items-start bg-white px-8 py-8 rounded-2xl drop-shadow">
                        <UsersIcon width={64} height={64} />
                        <h1 className="mt-2.5 text-3xl xl:text-4xl  font-bold">Community</h1>
                        <p className="mt-2.5 text-black-100 break-words whitespace-normal">
                            Tausche dich auf Profilwänden aus und bleibe mit allen verbunden.
                        </p>
                    </div>
                </div>
            </div>

            <Separator />
            <ContactForm />
        </div>
    );
}
