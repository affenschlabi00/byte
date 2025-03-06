import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileTextIcon, GithubIcon, MessageCircle, UserIcon, UsersIcon } from "lucide-react";
import { auth } from "@/auth";
import { handleGithubSignIn, handleSignOut } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import ContactForm from "@/components/ContactForm";

const HERO_IMAGE = {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Hofwil Campus",
    width: 600,
    height: 400,
};

const FEATURES = [
    {
        Icon: MessageCircle,
        title: "Chat System",
        description: "Direkte Kommunikation mit Mitschülern für Fragen und Austausch.",
    },
    {
        Icon: FileTextIcon,
        title: "Materialien",
        description: "Teile und finde Zusammenfassungen, alte Prüfungen und Notizen.",
    },
    {
        Icon: UserIcon,
        title: "Profile",
        description: "Personalisiere dein Profil und vernetze dich mit deinen Mitschülern.",
    },
    {
        Icon: UsersIcon,
        title: "Community",
        description: "Tausche dich auf Profilwänden aus und bleibe mit allen verbunden.",
    },
] as const;

function FeatureCard({ Icon, title, description }: typeof FEATURES[number]) {
    return (
        <div className="flex flex-col items-start bg-white px-8 py-8 rounded-2xl drop-shadow">
            <Icon width={64} height={64} />
            <h2 className="mt-2.5 text-3xl xl:text-4xl font-bold">{title}</h2>
            <p className="mt-2.5 text-black-100 break-words whitespace-normal">
                {description}
            </p>
        </div>
    );
}

function AuthButton({ isAuthenticated }: { isAuthenticated: boolean }) {
    if (isAuthenticated) {
        return (
            <form action={handleSignOut}>
                <Button className="h-6 text-xs px-2 mt-5" type="submit">
                    <GithubIcon className="mr-2" aria-hidden="true" />
                    <span>Abmelden</span>
                </Button>
            </form>
        );
    }

    return (
        <form action={handleGithubSignIn}>
            <Button className="h-6 text-xs px-2 mt-5" type="submit">
                <GithubIcon className="mr-2" aria-hidden="true" />
                <span>Anmelden</span>
            </Button>
        </form>
    );
}

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
                        <AuthButton isAuthenticated={!!session?.user} />
                    </div>

                    <div className="w-full lg:w-auto mt-10 xs:mt-20">
                        <Image
                            {...HERO_IMAGE}
                            className="rounded-2xl drop-shadow-xl border border-white shadow-lg w-full"
                            priority={false}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white-100 drop-shadow rounded-2xl my-12 xs:my-20 max-w-7xl mx-auto p-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>

            <Separator />
            <ContactForm />
        </div>
    );
}
