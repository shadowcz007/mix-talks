import { useState } from 'react';
import { TalksState } from '../types';

const initialState: TalksState = {
    avatar: localStorage.getItem('_avatar') || '',
    name: localStorage.getItem('_name') || '',
    dialogue: localStorage.getItem('_dialogue') || '',
    names: JSON.parse(localStorage.getItem('names') || '[]'),
    type: localStorage.getItem('_type') || 'left',
    result: '',
    drivingVideos: [],
    output: 'gif',
    isMirror: false,
    error: null,
    isCreateCharacterModalOpen: false,
    characterInput: '',
    characterDescription: '',
    characters: JSON.parse(localStorage.getItem('characters') || '[]'),
    isLoading: false,
    isConfigModalOpen: false,
    apiUrl: localStorage.getItem('_api_url') || '',
    apiKey: localStorage.getItem('_api_key') || '',
    model: localStorage.getItem('_model') || '',
    streamResponse: '',
    lastResponse: '',
    characterPrompt: '',
    isGeneratingDescription: false,
    chatHistory: [],
    maxContextSize: 20,
};

export const useTalksState = () => {
    const [state, setState] = useState<TalksState>(initialState);
    return { state, setState };
}; 