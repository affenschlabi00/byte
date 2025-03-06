'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BioModal } from "@/components/modals/BioModal"
import { DeleteAccountModal } from "@/components/modals/DeleteAccountModal"

interface ProfileSettingsProps {
    currentBio?: string
}

export function ProfileSettings({ currentBio }: ProfileSettingsProps) {
    const [isBioModalOpen, setIsBioModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Profileinstellungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio bearbeiten</label>
                        <div className="flex flex-col gap-2">
                            <Button 
                                variant="outline" 
                                className="justify-start"
                                onClick={() => setIsBioModalOpen(true)}
                            >
                                Bio aktualisieren
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Konto</label>
                        <div className="flex flex-col gap-2">
                            <Button 
                                variant="outline" 
                                className="justify-start text-red-600 hover:text-red-700"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Konto löschen
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <BioModal 
                isOpen={isBioModalOpen}
                onClose={() => setIsBioModalOpen(false)}
                currentBio={currentBio}
            />

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </>
    )
} 