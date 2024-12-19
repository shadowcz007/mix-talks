declare global {
    interface Window {
        talkColors?: string[];
    }
}

export interface TalksProps {
    talkColors: string[];
}

export interface DrivingVideo {
    element: 'video' | 'img';
    base64: string;
    selected?: boolean;
    emotion?: string;
}

export interface ApiResponse {
    data: {
        type: 'gif' | 'mp4';
        base64: string;
        [key: string]: any;
    } | DrivingVideo[];
}

export interface TalksState {
    avatar: string;
    name: string;
    dialogue: string;
    names: Array<{
        value: string;
        label: string;
    }>;
    type: string;
    result: string;
    drivingVideos: DrivingVideo[];
    output: 'gif' | 'mp4';
    isMirror: boolean;
    error: string | null;
    isCreateCharacterModalOpen: boolean;
    characterInput: string;
    characterDescription: string;
    characters: Array<{
        name: string;
        description: string;
        avatar?: string;
    }>;
    isLoading: boolean;
    isConfigModalOpen: boolean;
    apiUrl: string;
    apiKey: string;
    model: string;
    streamResponse: string;
    lastResponse: string;
} 