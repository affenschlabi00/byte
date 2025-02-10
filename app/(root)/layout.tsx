import React, {ReactNode} from 'react';
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";

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
        </main>
    );
}

export default Layout;