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
    characters: Character[];
    isLoading: boolean;
    isConfigModalOpen: boolean;
    apiUrl: string;
    apiKey: string;
    model: string;
    streamResponse: string;
    lastResponse: string;
    characterPrompt: string;
    isGeneratingDescription: boolean;
    newCharacterAvatar?: string;
    selectedCharacter?: Character;
    chatHistory: ChatMessage[];
    maxContextSize: number;
    currentCharacter: Character;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    avatar?: string;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
} 