import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import {ReactNode} from "react";
import {Toaster} from "@/components/ui/toaster";

function Layout({ children }: { children: ReactNode }) {

    return (
        <main className="font-inter">
            <div className="hidden xs:block">
                <Navbar />
            </div>

            <div className="block xs:hidden">
                <MobileNavbar />
            </div>
            {children}
            <Toaster />
        </main>
    );
}

export default Layout;