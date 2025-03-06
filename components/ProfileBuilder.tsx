'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { updateUserProfile } from '@/lib/user'
import { toast } from '@/hooks/use-toast'
import { Plus, Settings2, Mail } from 'lucide-react'
import { ProfileComponent, ProfileTheme } from '@/types/profile'
import { useRouter } from 'next/navigation'

// Debounce-Funktion
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

interface ProfileBuilderProps {
    profile: {
        name: string;
        email: string;
        image: string | null;
        bio?: string;
        githubUsername?: string;
        components?: ProfileComponent[];
        theme?: ProfileTheme;
        _id: string;
    }
}

interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export function ProfileBuilder({ profile }: ProfileBuilderProps) {
    const router = useRouter();
    const defaultTheme: ProfileTheme = {
        primaryColor: '#0066ff',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Inter',
        gridColumns: 48,
        gridGap: 8
    }

    const componentTypes = [
        { type: 'text', label: 'Text', icon: 'Type' },
        { type: 'image', label: 'Bild', icon: 'Image' },
        { type: 'heading', label: 'Überschrift', icon: 'Heading' },
        { type: 'button', label: 'Button', icon: 'Square' },
        { type: 'divider', label: 'Trennlinie', icon: 'Minus' },
        { type: 'spacer', label: 'Abstand', icon: 'ArrowUpDown' },
        { type: 'social', label: 'Social Media', icon: 'Share2' },
        { type: 'avatar', label: 'Profilbild', icon: 'User' },
        { type: 'contact', label: 'Kontakt', icon: 'Mail' }
    ]

    const [components, setComponents] = useState<ProfileComponent[]>(
        profile.components?.map(comp => {
            const settings = {
                ...comp.settings,
                x: typeof comp.settings.x === 'number' ? comp.settings.x : 0,
                y: typeof comp.settings.y === 'number' ? comp.settings.y : 0,
                w: typeof comp.settings.w === 'number' ? comp.settings.w : 6,
                h: typeof comp.settings.h === 'number' ? comp.settings.h : 2,
                size: comp.settings.size || 'medium',
                alignment: comp.settings.alignment || 'center',
                showBorder: comp.settings.showBorder || false,
                backgroundColor: comp.settings.backgroundColor || defaultTheme.backgroundColor,
                textColor: comp.settings.textColor || defaultTheme.textColor,
                content: comp.settings.content || '',
                imageUrl: comp.settings.imageUrl || '',
                link: comp.settings.link || '',
                fontSize: comp.settings.fontSize || '16px',
                fontWeight: comp.settings.fontWeight || 'normal',
                padding: comp.settings.padding || '1rem',
                borderRadius: comp.settings.borderRadius || '0.5rem',
                opacity: comp.settings.opacity || 1
            }
            return {
                ...comp,
                settings
            }
        }) || []
    )
    const [theme, setTheme] = useState<ProfileTheme>(profile.theme || defaultTheme)
    const [layout, setLayout] = useState<LayoutItem[]>(
        components.map(comp => ({
            i: comp.id,
            x: typeof comp.settings.x === 'number' ? comp.settings.x : 0,
            y: typeof comp.settings.y === 'number' ? comp.settings.y : 0,
            w: typeof comp.settings.w === 'number' ? comp.settings.w : 3,
            h: typeof comp.settings.h === 'number' ? comp.settings.h : 2
        }))
    )
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [containerWidth, setContainerWidth] = useState(1200)
    const containerRef = useRef<HTMLDivElement>(null)
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

    const debouncedThemeUpdate = useCallback(
        debounce((newTheme: ProfileTheme) => {
            setTheme(newTheme);
        }, 100),
        []
    );

    const handleThemeChange = useCallback((key: keyof ProfileTheme, value: string) => {
        const newTheme = { ...theme, [key]: value };
        debouncedThemeUpdate(newTheme);
    }, [theme, debouncedThemeUpdate]);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }
        
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    const addComponent = (type: ProfileComponent['type']) => {
        const newComponent: ProfileComponent = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            settings: {
                size: 'medium',
                alignment: 'center',
                showBorder: false,
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
                x: 0,
                y: layout.length > 0 
                    ? Math.max(...layout.map(item => item.y + item.h))
                    : 0,
                w: 1,
                h: 4,
                fontSize: '16px',
                fontWeight: 'normal',
                borderRadius: '0.5rem',
                opacity: 1
            }
        }
        setComponents(prevComponents => {
            const newComponents = [...prevComponents, newComponent]
            const newLayout = newComponents.map(comp => ({
                i: comp.id,
                x: comp.settings.x || 0,
                y: comp.settings.y || 0,
                w: comp.settings.w || 3,
                h: comp.settings.h || 2
            }))
            setLayout(newLayout)
            return newComponents
        })
    }

    const removeComponent = (id: string) => {
        setComponents(prevComponents => {
            const newComponents = prevComponents.filter(component => component.id !== id)
            setLayout(newComponents.map(comp => ({
                i: comp.id,
                x: comp.settings.x || 0,
                y: comp.settings.y || 0,
                w: comp.settings.w || 3,
                h: comp.settings.h || 2
            })))
            return newComponents
        })
        if (selectedComponent === id) {
            setSelectedComponent(null)
        }
    }

    const updateComponentSettings = (id: string, settings: Partial<ProfileComponent['settings']>) => {
        setComponents(prevComponents => {
            const newComponents = prevComponents.map(component => 
                component.id === id 
                    ? { ...component, settings: { ...component.settings, ...settings } }
                    : component
            )
            return newComponents
        })
    }

    const handleLayoutChange = (newLayout: LayoutItem[]) => {
        if (JSON.stringify(layout) === JSON.stringify(newLayout)) {
            return;
        }

        setLayout(newLayout);
        setComponents(prevComponents => {
            const updatedComponents = prevComponents.map(comp => {
                const layoutItem = newLayout.find(item => item.i === comp.id);
                if (!layoutItem) return comp;

                if (
                    comp.settings.x === layoutItem.x &&
                    comp.settings.y === layoutItem.y &&
                    comp.settings.w === layoutItem.w &&
                    comp.settings.h === layoutItem.h
                ) {
                    return comp;
                }

                return {
                    ...comp,
                    settings: {
                        ...comp.settings,
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h
                    }
                };
            });

            if (JSON.stringify(prevComponents) === JSON.stringify(updatedComponents)) {
                return prevComponents;
            }

            return updatedComponents;
        });
    };

    const handleSave = async () => {
        try {
            setIsLoading(true)
            const updatedComponents = components.map(comp => {
                const layoutItem = layout.find(item => item.i === comp.id)
                if (!layoutItem) return comp
                
                return {
                    ...comp,
                    settings: {
                        ...comp.settings,
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h
                    }
                }
            })
            
            const result = await updateUserProfile({
                components: updatedComponents,
                theme
            })
            
            if (result.success) {
                toast({
                    title: "Profil aktualisiert",
                    description: "Ihre Änderungen wurden gespeichert.",
                })
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            toast({
                title: "Fehler",
                description: error instanceof Error ? error.message : "Profil konnte nicht aktualisiert werden",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const renderComponent = (component: ProfileComponent) => {
        const style = {
            backgroundColor: component.settings.backgroundColor || theme.backgroundColor,
            color: component.settings.textColor || theme.textColor,
            border: component.settings.showBorder ? `2px solid ${theme.primaryColor}` : '1px dashed #ccc',
            borderRadius: component.settings.borderRadius || '0.5rem',
            padding: component.settings.padding || '1rem',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: component.settings.alignment || 'center',
            position: 'relative' as const,
            userSelect: 'none' as const,
            opacity: component.settings.opacity || 1,
            fontSize: component.settings.fontSize,
            fontWeight: component.settings.fontWeight,
            overflow: 'hidden'
        }

        const textStyle = {
            width: '100%',
            overflowWrap: 'break-word' as const,
            wordBreak: 'break-word' as const,
            whiteSpace: 'pre-wrap' as const,
            textAlign: component.settings.alignment as any || 'center'
        }

        const isSelected = selectedComponent === component.id

        const renderContent = () => {
            switch (component.type) {
                case 'text':
                    return <p style={textStyle}>{component.settings.content || 'Text eingeben...'}</p>
                case 'heading':
                    return <h2 style={{ ...textStyle, fontSize: '1.5em', fontWeight: 'bold' }}>{component.settings.content || 'Überschrift'}</h2>
                case 'image':
                    return component.settings.imageUrl ? (
                        <img 
                            src={component.settings.imageUrl} 
                            alt={component.settings.content || 'Bild'} 
                            style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                            Bild-URL hinzufügen
                        </div>
                    )
                case 'avatar':
                    return (
                        <div style={{
                            display: 'flex',
                            justifyContent: component.settings.alignment || 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                        }}>
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                Avatar
                            </div>
                        </div>
                    )
                case 'button':
                    return (
                        <button 
                            className="px-4 py-2 bg-primary text-white rounded"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            {component.settings.content || 'Button Text'}
                        </button>
                    )
                case 'divider':
                    return <hr className="w-full border-t border-gray-300" />
                case 'spacer':
                    return (
                        <div style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: component.settings.backgroundColor || 'transparent',
                            opacity: component.settings.opacity || 1,
                            borderRadius: component.settings.borderRadius || '0.5rem'
                        }} />
                    )
                case 'social':
                    return (
                        <div className="flex gap-4">
                            {component.settings.content && (
                                <a 
                                    href={component.settings.link || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:opacity-80"
                                >
                                    {component.settings.content}
                                </a>
                            )}
                        </div>
                    )
                case 'contact':
                    return (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{component.settings.content || 'Kontakt hinzufügen'}</span>
                        </div>
                    )
                default:
                    return <span className="capitalize">{component.type}</span>
            }
        }

        return (
            <div 
                style={style}
                className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
            >
                <div className="absolute top-1 right-1 flex gap-2 nodrag">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            removeComponent(component.id)
                        }}
                        className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                        style={{ 
                            width: '24px', 
                            height: '24px',
                            fontSize: '16px',
                            lineHeight: '1'
                        }}
                    >
                        ×
                    </button>
                    <Popover open={openPopoverId === component.id} onOpenChange={(open) => {
                        if (open) {
                            setOpenPopoverId(component.id)
                            setSelectedComponent(component.id)
                        } else {
                            setOpenPopoverId(null)
                        }
                    }}>
                        <PopoverTrigger asChild>
                            <button
                                className="p-1 rounded-full bg-gray-500 text-white hover:bg-gray-600 nodrag flex items-center justify-center"
                                style={{ 
                                    width: '24px', 
                                    height: '24px',
                                    fontSize: '16px',
                                    lineHeight: '1'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <Settings2 className="w-3 h-3" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent 
                            side="right" 
                            className="w-80 popover-content"
                            sideOffset={5}
                            onPointerDownOutside={(e) => {
                                if ((e.target as HTMLElement).closest('input[type="color"]')) {
                                    e.preventDefault();
                                }
                            }}
                            onFocusOutside={(e) => {
                                if ((e.target as HTMLElement).closest('input[type="color"]')) {
                                    e.preventDefault();
                                }
                            }}
                            onInteractOutside={(e) => {
                                if ((e.target as HTMLElement).closest('input[type="color"]')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <div className="nodrag" onClick={(e) => e.stopPropagation()}>
                                <ComponentSettings component={component} />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div 
                    className="w-full h-full flex items-center justify-center react-draggable-handle"
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelectedComponent(isSelected ? null : component.id)
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        )
    }

    const ComponentSettings = ({ component }: { component: ProfileComponent }) => {
        const [localSettings, setLocalSettings] = useState(component.settings)
        const isInitialMount = useRef(true)

        useEffect(() => {
            if (isInitialMount.current) {
                setLocalSettings(component.settings)
                isInitialMount.current = false
            }
        }, [component.settings])

        const handleBlur = (key: keyof ProfileComponent['settings'], value: any) => {
            updateComponentSettings(component.id, { [key]: value })
        }

        const handleChange = (key: keyof ProfileComponent['settings'], value: any) => {
            setLocalSettings(prev => ({ ...prev, [key]: value }))
        }

        const renderSpecificSettings = () => {
            switch (component.type) {
                case 'text':
                case 'heading':
                    return (
                        <>
                            <div className="space-y-2">
                                <Label>Text</Label>
                                <textarea
                                    value={localSettings.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    onBlur={(e) => handleBlur('content', e.target.value)}
                                    className="w-full rounded-md border p-2 min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Schriftgröße</Label>
                                <Input
                                    type="text"
                                    value={localSettings.fontSize}
                                    onChange={(e) => handleChange('fontSize', e.target.value)}
                                    onBlur={(e) => handleBlur('fontSize', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Schriftstärke</Label>
                                <select
                                    value={localSettings.fontWeight || 'normal'}
                                    onChange={(e) => {
                                        handleChange('fontWeight', e.target.value)
                                        handleBlur('fontWeight', e.target.value)
                                    }}
                                    className="w-full rounded-md border p-2"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Fett</option>
                                    <option value="light">Leicht</option>
                                </select>
                            </div>
                        </>
                    )
                case 'image':
                    return (
                        <>
                            <div className="space-y-2">
                                <Label>Bild-URL</Label>
                                <Input
                                    type="text"
                                    value={localSettings.imageUrl || ''}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                    onBlur={(e) => handleBlur('imageUrl', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Alt-Text</Label>
                                <Input
                                    type="text"
                                    value={localSettings.content || ''}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    onBlur={(e) => handleBlur('content', e.target.value)}
                                />
                            </div>
                        </>
                    )
                case 'button':
                    return (
                        <>
                            <div className="space-y-2">
                                <Label>Button-Text</Label>
                                <Input
                                    type="text"
                                    value={localSettings.content || ''}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    onBlur={(e) => handleBlur('content', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Link</Label>
                                <Input
                                    type="text"
                                    value={localSettings.link || ''}
                                    onChange={(e) => handleChange('link', e.target.value)}
                                    onBlur={(e) => handleBlur('link', e.target.value)}
                                />
                            </div>
                        </>
                    )
                case 'social':
                    return (
                        <>
                            <div className="space-y-2">
                                <Label>Social Media Text</Label>
                                <Input
                                    type="text"
                                    value={localSettings.content || ''}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    onBlur={(e) => handleBlur('content', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Link</Label>
                                <Input
                                    type="text"
                                    value={localSettings.link || ''}
                                    onChange={(e) => handleChange('link', e.target.value)}
                                    onBlur={(e) => handleBlur('link', e.target.value)}
                                />
                            </div>
                        </>
                    )
                case 'contact':
                    return (
                        <div className="space-y-2">
                            <Label>Kontaktinformation</Label>
                            <Input
                                type="text"
                                value={localSettings.content || ''}
                                onChange={(e) => handleChange('content', e.target.value)}
                                onBlur={(e) => handleBlur('content', e.target.value)}
                            />
                        </div>
                    )
                default:
                    return null
            }
        }

        return (
            <div className="p-4 space-y-4 min-w-[240px]" onClick={(e) => e.stopPropagation()}>
                {renderSpecificSettings()}
                
                <div className="space-y-2">
                    <Label>Ausrichtung</Label>
                    <select 
                        value={localSettings.alignment}
                        onChange={(e) => {
                            handleChange('alignment', e.target.value)
                            handleBlur('alignment', e.target.value)
                        }}
                        className="w-full rounded-md border p-2"
                    >
                        <option value="left">Links</option>
                        <option value="center">Zentriert</option>
                        <option value="right">Rechts</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Hintergrundfarbe</Label>
                    <Input 
                        type="color" 
                        value={localSettings.backgroundColor || theme.backgroundColor}
                        onChange={(e) => {
                            handleChange('backgroundColor', e.target.value)
                            handleBlur('backgroundColor', e.target.value)
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Textfarbe</Label>
                    <Input 
                        type="color" 
                        value={localSettings.textColor || theme.textColor}
                        onChange={(e) => {
                            handleChange('textColor', e.target.value)
                            handleBlur('textColor', e.target.value)
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Eckenradius</Label>
                    <Input 
                        type="text"
                        value={localSettings.borderRadius}
                        onChange={(e) => handleChange('borderRadius', e.target.value)}
                        onBlur={(e) => handleBlur('borderRadius', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Transparenz</Label>
                    <Input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={localSettings.opacity || 1}
                        onChange={(e) => {
                            handleChange('opacity', parseFloat(e.target.value))
                            handleBlur('opacity', parseFloat(e.target.value))
                        }}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={`showBorder-${component.id}`}
                        checked={localSettings.showBorder}
                        onChange={(e) => {
                            handleChange('showBorder', e.target.checked)
                            handleBlur('showBorder', e.target.checked)
                        }}
                    />
                    <Label htmlFor={`showBorder-${component.id}`}>Rahmen anzeigen</Label>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 flex">
            {/* Main Design Area */}
            <div className="flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={containerRef}>
                <div className="min-h-full w-full h-full">
                    <GridLayout
                        className="layout"
                        layout={layout}
                        cols={theme.gridColumns}
                        rowHeight={25}
                        width={containerWidth}
                        onLayoutChange={handleLayoutChange}
                        isDraggable={true}
                        isResizable={true}
                        compactType={null}
                        preventCollision={true}
                        margin={[theme.gridGap, theme.gridGap]}
                        containerPadding={[0, 0]}
                        draggableHandle=".react-draggable-handle"
                        resizeHandles={['se', 'e', 's']}
                        autoSize={true}
                        draggableCancel=".nodrag"
                        onResize={(layout, oldItem, newItem) => {
                            const maxWidth = theme.gridColumns;
                            if (newItem.w > maxWidth) {
                                newItem.w = maxWidth;
                            }
                            handleLayoutChange(layout);
                        }}
                    >
                        {components.map((component) => (
                            <div key={component.id} className="bg-white shadow-sm">
                                {renderComponent(component)}
                            </div>
                        ))}
                    </GridLayout>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-white border-l shadow-lg overflow-y-auto flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Komponenten</h3>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/profile`)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Zurück
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {componentTypes.map(({ type, label, icon }) => (
                            <Button
                                key={type}
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => addComponent(type as ProfileComponent['type'])}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>{label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-b flex-1">
                    <h3 className="font-semibold mb-4">Globales Design</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Primärfarbe</Label>
                            <Input 
                                type="color" 
                                value={theme.primaryColor}
                                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Seitenhintergrund</Label>
                            <Input 
                                type="color" 
                                value={theme.backgroundColor}
                                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Standard Textfarbe</Label>
                            <Input 
                                type="color" 
                                value={theme.textColor}
                                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full"
                    >
                        Änderungen speichern
                    </Button>
                </div>
            </div>
            <style>
                {`
                    .react-grid-item.react-grid-placeholder {
                        background: rgb(255, 0, 234) !important;
                    }

                    .react-grid-item.react-draggable-dragging > div {
                        animation: shake 1s infinite !important;
                    }
                `}
            </style>
        </div>
    )
} 