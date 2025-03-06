'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateUserBio } from '@/lib/user'
import { toast } from '@/hooks/use-toast'

interface BioModalProps {
    isOpen: boolean
    onClose: () => void
    currentBio?: string
}

export function BioModal({ isOpen, onClose, currentBio = "" }: BioModalProps) {
    const [bio, setBio] = useState(currentBio)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const result = await updateUserBio(bio)
            
            if (result.success) {
                toast({
                    title: "Bio aktualisiert",
                    description: "Ihre Bio wurde erfolgreich aktualisiert.",
                })
                onClose()
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            toast({
                title: "Fehler",
                description: error instanceof Error ? error.message : "Bio konnte nicht aktualisiert werden",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bio bearbeiten</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Erzählen Sie etwas über sich..."
                        className="min-h-[100px]"
                        disabled={isLoading}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 