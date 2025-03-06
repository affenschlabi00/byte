'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteUserAccount } from '@/lib/user'
import { toast } from '@/hooks/use-toast'

interface DeleteAccountModalProps {
    isOpen: boolean
    onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const result = await deleteUserAccount()
            
            if (result.success) {
                toast({
                    title: "Konto gelöscht",
                    description: "Ihr Konto wurde erfolgreich gelöscht.",
                })
                // Weiterleitung erfolgt automatisch durch die Server Action
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            toast({
                title: "Fehler",
                description: error instanceof Error ? error.message : "Konto konnte nicht gelöscht werden",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konto löschen</DialogTitle>
                    <DialogDescription>
                        Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                        Alle Ihre Beiträge und Daten werden permanent gelöscht.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        Konto löschen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 