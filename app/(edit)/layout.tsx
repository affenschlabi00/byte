import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

export default function EditLayout({ children }: { children: ReactNode }) {
    return (
        <main className="font-inter">
            {children}
            <Toaster />
        </main>
    );
} 