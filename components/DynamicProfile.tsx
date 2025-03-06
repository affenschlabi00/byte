'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileComponent } from "@/types/profile"

interface DynamicProfileProps {
    profile: {
        _id: string;
        name: string;
        email: string;
        image: string | null;
        bio?: string;
        githubUsername?: string;
        components: ProfileComponent[];
        theme: {
            primaryColor: string;
            backgroundColor: string;
            textColor: string;
            fontFamily: string;
            gridColumns: number;
            gridGap: number;
        };
    }
}

function ProfileComponentRenderer({ component, profile }: { 
    component: ProfileComponent; 
    profile: DynamicProfileProps['profile'];
}) {
    const style = {
        textAlign: component.settings.alignment,
        backgroundColor: component.settings.backgroundColor || profile.theme.backgroundColor,
        color: component.settings.textColor || profile.theme.textColor,
        padding: '0',
        borderRadius: component.settings.borderRadius || '0.5rem',
        border: component.settings.showBorder ? `2px solid ${profile.theme.primaryColor}` : 'none',
        gridColumn: component.settings.x !== undefined && component.settings.w !== undefined 
            ? `${component.settings.x + 1} / span ${component.settings.w}` 
            : 'auto',
        gridRow: component.settings.y !== undefined && component.settings.h !== undefined 
            ? `${component.settings.y + 1} / span ${component.settings.h}` 
            : 'auto',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: component.settings.alignment,
        fontSize: component.settings.fontSize,
        fontWeight: component.settings.fontWeight,
        opacity: component.settings.opacity,
        overflow: 'hidden'
    } as const

    const textStyle = {
        width: '100%',
        overflowWrap: 'break-word' as const,
        wordBreak: 'break-word' as const,
        whiteSpace: 'pre-wrap' as const,
        textAlign: component.settings.alignment || 'center'
    }

    switch (component.type) {
        case 'avatar':
            const initials = profile.name
                ?.split(" ")
                .map((name: string) => name[0])
                .join("")
                .toUpperCase() || "??"
            return (
                <div style={{
                    ...style,
                    display: 'flex',
                    justifyContent: component.settings.alignment === 'left' ? 'flex-start' :
                                  component.settings.alignment === 'right' ? 'flex-end' : 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '0',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: component.settings.alignment === 'left' ? 'flex-start' :
                                      component.settings.alignment === 'right' ? 'flex-end' : 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.image || ""} alt={profile.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            )
        
        case 'text':
            return (
                <div style={style}>
                    <p style={{ 
                        ...textStyle,
                        fontSize: component.settings.fontSize,
                        fontWeight: component.settings.fontWeight
                    }}>
                        {component.settings.content || "Text eingeben..."}
                    </p>
                </div>
            )
        
        case 'heading':
            return (
                <div style={style}>
                    <h1 style={{ 
                        ...textStyle,
                        fontSize: component.settings.fontSize || '2em',
                        fontWeight: component.settings.fontWeight || 'bold'
                    }}>
                        {component.settings.content || profile.bio}
                    </h1>
                </div>
            )
        
        case 'image':
            return (
                <div style={style}>
                    {component.settings.imageUrl ? (
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
                    ) : null}
                </div>
            )
        
        case 'divider':
            return (
                <div style={style}>
                    <hr className="w-full border-t border-gray-300" style={{ 
                        borderColor: component.settings.textColor || profile.theme.textColor,
                        opacity: component.settings.opacity
                    }} />
                </div>
            )
        
        case 'spacer':
            return (
                <div style={{
                    ...style,
                    backgroundColor: component.settings.backgroundColor || profile.theme.backgroundColor,
                    padding: 0
                }}>
                    <div style={{ height: '100%', width: '100%' }} />
                </div>
            )
        
        case 'social':
            return (
                <div style={style}>
                    <a 
                        href={component.settings.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                            color: profile.theme.primaryColor,
                            fontSize: component.settings.fontSize,
                            fontWeight: component.settings.fontWeight
                        }}
                        className="hover:underline"
                    >
                        {component.settings.content || `@${profile.githubUsername}`}
                    </a>
                </div>
            )
        
        case 'button':
            return (
                <div style={style}>
                    <a 
                        href={component.settings.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            backgroundColor: profile.theme.primaryColor,
                            color: '#ffffff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: component.settings.fontSize,
                            fontWeight: component.settings.fontWeight,
                            textAlign: 'center'
                        }}
                        className="hover:opacity-90"
                    >
                        {component.settings.content || 'Button Text'}
                    </a>
                </div>
            )
        
        default:
            return null
    }
}

export function DynamicProfile({ profile }: DynamicProfileProps) {
    return (
        <div 
            className="min-h-screen w-full overflow-x-hidden"
            style={{
                backgroundColor: profile.theme.backgroundColor,
                color: profile.theme.textColor,
                fontFamily: profile.theme.fontFamily
            }}
        >
            <div 
                className="w-full h-full"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${profile.theme.gridColumns}, minmax(0, 1fr))`,
                    gridAutoRows: '25px',
                    gap: `${profile.theme.gridGap}px`,
                    padding: 0,
                }}
            >
                {profile.components.map((component) => (
                    <ProfileComponentRenderer
                        key={component.id}
                        component={component}
                        profile={profile}
                    />
                ))}
            </div>
        </div>
    )
} 