export interface ProfileComponent {
    id: string;
    type: 'text' | 'image' | 'heading' | 'button' | 'divider' | 'spacer' | 'social' | 'avatar' | 'contact';
    settings: {
        size: 'small' | 'medium' | 'large';
        alignment: 'left' | 'center' | 'right';
        showBorder: boolean;
        backgroundColor?: string;
        textColor?: string;
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        gridColumn?: string;
        gridRow?: string;
        content?: string;
        imageUrl?: string;
        link?: string;
        fontSize?: string;
        fontWeight?: string;
        padding?: string;
        borderRadius?: string;
        opacity?: number;
    };
}

export interface ProfileTheme {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    gridColumns: number;
    gridGap: number;
}

export interface Profile {
    _id: string;
    name: string;
    email: string;
    image: string | null;
    bio?: string;
    githubUsername?: string;
    components: ProfileComponent[];
    theme: ProfileTheme;
} 