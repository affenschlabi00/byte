"use client"

import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import React, {useState} from "react";

function ContactForm() {

    const [text, setText] = useState(null);

    return (
        <div className="my-12 xs:my-20 flex flex-col items-center max-w-4xl w-full">
            <h1 className="text-black md:text-4xl xs:text-3xl lg:text-5xl text-2xl font-bold ">
                Verbesserungsvorschläge?
            </h1>
            <p className="text-black-100 mt-5 mb-8">
                Kontaktiert mich.
            </p>
            <div className="grid w-full gap-2">
                <Textarea onChange={() => {
                    text
                }} placeholder="Schreib deine Nachricht hier." className="h-32 resize-none"/>
                <Button
                    onClick={() => {
                        toast({
                            title: "Nachricht gesendet!",
                            description: "Deine Nachricht wurde übermittelt. Vielen Dank!",
                        })
                    }}
                >
                    Nachricht schicken
                </Button>
            </div>
        </div>
    );
}

export default ContactForm;