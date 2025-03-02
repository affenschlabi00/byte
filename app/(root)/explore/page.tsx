import {auth} from "@/auth";
import Form from "next/form";
import {SearchIcon, CloseIcon} from "@sanity/icons";
import {Button} from "@/components/ui/button";
import { PostsGrid } from "@/components/PostsGrid";
import {HeartIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import { TopAuthorsGrid } from "@/components/TopAuthorsGrid";

function SearchBar() {
    return (
        <Form action="/explore" scroll={false} className="flex items-center w-full border-2 border-white-200 rounded-full">
            <SearchIcon width={64} height={64} className="text-white-200 size-12 md:size-16" />
            <input
                autoComplete="off"
                name="query"
                defaultValue=""
                className="focus:outline-none md:py-6 py-1.5 w-full rounded-full text-xs md:text-sm"
                placeholder="Dürchstöbere Dokumente..."
                aria-label="Suche nach Dokumenten"
            />
            <Button className="rounded-full w-6 h-8 md:h-12 md:w-12 mr-3" aria-label="Suche zurücksetzen">
                <CloseIcon width={32} height={32} />
            </Button>
        </Form>
    );
}

function Footer() {
    return (
        <div className="w-full flex justify-center items-center p-8 md:p-16 text-black-100">
            <div className="flex justify-between gap-1.5">
                Made with <HeartIcon aria-hidden="true" /> by Kinu!
            </div>
        </div>
    );
}

export default async function ExplorePage() {
    const session = await auth();

    if (!session?.user) {
        return <div>Nope</div>;
    }

    return (
        <div className="flex flex-col items-center contain-content">
            <div className="flex container flex-col w-full items-center my-16 py-16 bg-white-100 drop-shadow rounded-xl">
                <h1 className="text-7xl font-black">Explore!</h1>
                <p className="xl:text-2xl md:text-xl text-xs font-bold text-black-200 pt-4">
                    Entdecke Notizen, alte Prüfungen und sonstige Dokumente.
                </p>
            </div>

            <Separator />
            <div className="w-full flex flex-col items-center justify-center bg-white-100">
                <TopAuthorsGrid />
            </div>

            <Separator />
            <div className="w-full flex flex-col items-center justify-center p-8 md:p-16">
                <SearchBar />
            </div>

            <PostsGrid />
            <Separator />
            <Footer />
        </div>
    );
}
