import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mantine/core';
import { TalksProps, TalksState, DrivingVideo, Character } from './types';
import { createAvatarGif, getDrivingVideos } from './api/talkApi';
import { createBaseHtml } from './utils/htmlGenerators';
import TalksForm from './TalksForm';
import TalksPreview from './TalksPreview';
import { AiApi } from './api/aiApi';

const Talks: React.FC<TalksProps> = () => {
    const [state, setState] = useState<TalksState>({
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
    });

    useEffect(() => {
        const fetchDrivingVideos = async () => {
            try {
                const response = await getDrivingVideos();
                if (response.data && Array.isArray(response.data)) {
                    setState(prev => ({
                        ...prev,
                        drivingVideos: response.data as DrivingVideo[]
                    }));
                }
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: '获取驱动视频失败'
                }));
            }
        };

        fetchDrivingVideos();
    }, []);

    const handleUpdateAvatar = (imgurl: string) => {
        if (imgurl !== state.avatar) {
            setState(prev => ({
                ...prev,
                avatar: imgurl
            }));
            localStorage.setItem('_avatar', imgurl);
        }
    };

    const handleUpdateName = (name: string) => {
        setState(prev => ({
            ...prev,
            name
        }));
        localStorage.setItem('_name', name);
    };

    const handleUpdateDialogue = (dialogue: string) => {
        setState(prev => ({
            ...prev,
            dialogue
        }));
        localStorage.setItem('_dialogue', dialogue);
    };

    const handleUpdateType = (type: string) => {
        setState(prev => ({
            ...prev,
            type
        }));
        localStorage.setItem('_type', type);
    };

    const handleToggleMirror = () => {
        setState(prev => ({
            ...prev,
            isMirror: !prev.isMirror
        }));
    };

    const handleCreateAvatar = async () => {
        try {
            setState(prev => ({
                ...prev,
                isLoading: true
            }));

            if (state.avatar) {
                const html = await createBaseHtml(
                    state.avatar,
                    state.type,
                    state.name,
                    state.dialogue
                );
                setState(prev => ({
                    ...prev,
                    avatar: state.avatar,
                    result: html,
                    isLoading: false
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: '创建头像失败',
                isLoading: false
            }));
        }
    };

    const handleCreateCharacter = async () => {
        try {
            setState(prev => ({
                ...prev,
                isLoading: true
            })); 
            // 更新角色列表
            setState(prev => ({
                ...prev,
                characters: [...prev.characters, {
                    name: prev.characterInput,
                    description: prev.characterDescription
                }],
                characterInput: '',
                characterDescription: '',
                isCreateCharacterModalOpen: false,
                isLoading: false
            }));

        } catch (error) {
            setState(prev => ({
                ...prev,
                error: '创建角色失败',
                isLoading: false
            }));
        }
    };

    const handleToggleConfigModal = () => {
        setState(prev => ({
            ...prev,
            isConfigModalOpen: !prev.isConfigModalOpen
        }));
    };

    const handleUpdateApiConfig = (apiUrl: string, apiKey: string, model: string) => {
        setState(prev => ({ 
            ...prev,
            apiUrl,
            apiKey,
            model,
            isConfigModalOpen: false 
        }));
        
        // 保存到localStorage
        localStorage.setItem('_api_url', apiUrl);
        localStorage.setItem('_api_key', apiKey);
        localStorage.setItem('_model', model);
    };

    const handleUpdateCharacterInput = (input: string) => {
        setState(prev => ({
            ...prev,
            characterInput: input
        }));
    };

    const handleToggleCharacterModal = () => {
        setState(prev => ({
            ...prev,
            isCreateCharacterModalOpen: !prev.isCreateCharacterModalOpen
        }));
    };

    const handleEditCharacter = (character: Character) => {
        setState(prev => {
            const updatedCharacters = prev.characters.map((c:any) => 
                c.id === character.id ? character : c
            );
            // 保存到 localStorage
            localStorage.setItem('characters', JSON.stringify(updatedCharacters));
            return {
                ...prev,
                characters: updatedCharacters
            };
        });
    };

    const handleDeleteCharacter = (id: string) => {
        setState(prev => ({
            ...prev,
            characters: prev.characters.filter((c:any) => c.id !== id)
        }));
        
        // 同步更新到 localStorage
        const updatedCharacters = state.characters.filter((c:any) => c.id !== id);
        localStorage.setItem('characters', JSON.stringify(updatedCharacters));
    };

    const handleUpdateCharacterPrompt = (prompt: string) => {
        setState(prev => ({
            ...prev,
            characterPrompt: prompt
        }));
    };

    const handleGenerateCharacterDescription = async (prompt: string) => {
        try {
            setState(prev => ({
                ...prev,
                isGeneratingDescription: true,
                characterDescription: ''
            }));

            const aiApi = new AiApi(state.apiUrl, state.apiKey, state.model);
            
            // 添加新的用户消息到历史记录
            const newMessage = { role: 'user', content: prompt };
            const updatedHistory = [...state.chatHistory, newMessage].slice(-state.maxContextSize);
            
            setState(prev => ({
                ...prev,
                chatHistory: updatedHistory
            }));

            await aiApi.generateCharacterDescription(prompt, {
                onToken: (content) => {
                    setState(prev => ({
                        ...prev,
                        characterDescription: prev.characterDescription + content
                    }));
                },
                onError: (error) => {
                    console.error('生成角色描述失败:', error);
                    setState(prev => ({
                        ...prev,
                        error: '生成角色描述失败',
                        isGeneratingDescription: false
                    }));
                },
                onFinish: () => {
                    // 将AI响应添加到历史记录
                    setState(prev => {
                        const assistantMessage = { role: 'assistant', content: prev.characterDescription };
                        const newHistory = [...prev.chatHistory, assistantMessage].slice(-prev.maxContextSize);
                        return {
                            ...prev,
                            isGeneratingDescription: false,
                            chatHistory: newHistory
                        };
                    });
                }
            });

        } catch (error) {
            console.error('生成角色描述失败:', error);
            setState(prev => ({
                ...prev,
                error: '生成角色描述失败',
                isGeneratingDescription: false
            }));
        }
    };

    return (
        <Container size="xl" py="xl">
            <Grid>
                <Grid.Col span={6}>
                    <TalksForm
                        state={state}
                        onUpdateAvatar={handleUpdateAvatar}
                        onUpdateName={handleUpdateName}
                        onUpdateDialogue={handleUpdateDialogue}
                        onUpdateType={handleUpdateType}
                        onToggleMirror={handleToggleMirror}
                        onCreateAvatar={handleCreateAvatar}
                        onUpdateOutput={(output) => setState(prev => ({ ...prev, output }))}
                        onCreateCharacter={handleCreateCharacter}
                        onToggleConfigModal={handleToggleConfigModal}
                        onUpdateApiConfig={handleUpdateApiConfig}
                        onToggleCharacterModal={handleToggleCharacterModal}
                        onUpdateCharacterInput={handleUpdateCharacterInput}
                        onEditCharacter={handleEditCharacter}
                        onDeleteCharacter={handleDeleteCharacter}
                        onUpdateCharacterPrompt={handleUpdateCharacterPrompt}
                        onGenerateCharacterDescription={handleGenerateCharacterDescription}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <TalksPreview result={state.result} />
                </Grid.Col>
            </Grid>
        </Container>
    );
}

export default Talks; 