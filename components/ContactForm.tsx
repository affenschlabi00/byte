"use client"

import { type ChangeEvent, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const MAX_MESSAGE_LENGTH = 1000;
const SIMULATED_API_DELAY = 1000;

const TOAST_MESSAGES = {
    empty: {
        title: "Fehler",
        description: "Bitte gib eine Nachricht ein.",
        variant: "destructive"
    },
    success: {
        title: "Nachricht gesendet!",
        description: "Deine Nachricht wurde übermittelt. Vielen Dank!"
    },
    error: {
        title: "Fehler",
        description: "Deine Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.",
        variant: "destructive"
    }
} as const;

export default function ContactForm() {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_MESSAGE_LENGTH) {
            setMessage(value);
        }
    }, []);

    const showToast = useCallback((messageType: keyof typeof TOAST_MESSAGES) => {
        toast(TOAST_MESSAGES[messageType]);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!message.trim()) {
            showToast("empty");
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: Implement actual message sending logic
            await new Promise(resolve => setTimeout(resolve, SIMULATED_API_DELAY));
            showToast("success");
            setMessage("");
        } catch (error) {
            showToast("error");
            console.error("Failed to send message:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [message, showToast]);

    const characterCount = message.length;
    const isMessageEmpty = !message.trim();

    return (
        <div className="my-12 xs:my-20 flex flex-col items-center max-w-4xl w-full">
            <h1 className="text-black md:text-4xl xs:text-3xl lg:text-5xl text-2xl font-bold text-center">
                Verbesserungsvorschläge?
            </h1>
            <p className="text-black-100 mt-5 mb-8 text-center">
                Kontaktiert mich.
            </p>
            <div className="grid w-full gap-2">
                <div className="relative">
                    <Textarea 
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Schreib deine Nachricht hier."
                        className="h-32 resize-none"
                        disabled={isSubmitting}
                        maxLength={MAX_MESSAGE_LENGTH}
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {characterCount}/{MAX_MESSAGE_LENGTH}
                    </span>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isMessageEmpty}
                >
                    {isSubmitting ? "Wird gesendet..." : "Nachricht schicken"}
                </Button>
            </div>
        </div>
    );
}