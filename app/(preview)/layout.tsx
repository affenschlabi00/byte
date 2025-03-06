
import {Toaster} from "@/components/ui/toaster";
import {ReactNode} from "react";
import { AuthenticatedMobileNav } from "@/components/navigation/AuthenticatedMobileNav";
import { AuthenticatedNav } from "@/components/navigation/AuthenticatedNav";
function Layout({ children }: { children: ReactNode }) {

    return (
        <main className="font-inter">
            <div className="hidden xs:block">
                <AuthenticatedNav />
            </div>

            <div className="block xs:hidden">
                <AuthenticatedMobileNav />
            </div>
            {children}
            <Toaster />
        </main>
    );
}

export default Layout;