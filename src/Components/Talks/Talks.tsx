import React, { useEffect } from 'react';
import { Container, Grid } from '@mantine/core';
import { Character, ChatMessage } from './types';
import TalksForm from './TalksForm';
import TalksPreview from './TalksPreview';
import { useTalksState } from './hooks/useTalksState';
import { TalksService } from './services/talksService';
import { StorageUtil, StorageKeys } from './utils/storage';

interface TalksProps {
    talkColors: string[];
}

const Talks: React.FC<TalksProps> = ({ talkColors }) => {
    const { state, setState } = useTalksState();

    useEffect(() => {
        const fetchDrivingVideos = async () => {
            try {
                const videos = await TalksService.fetchDrivingVideos();
                setState(prev => ({ ...prev, drivingVideos: videos }));
            } catch (error) {
                setState(prev => ({ ...prev, error: '获取驱动视频失败' }));
            }
        };

        fetchDrivingVideos();
    }, []);

    useEffect(() => {
        // 从本地存储加载已保存的角色
        const savedCharacters = StorageUtil.getObject<Character[]>(StorageKeys.CHARACTERS, []);
        setState(prev => ({
            ...prev,
            characters: savedCharacters
        }));
    }, []);

    // 事件处理函数
    const handleUpdateAvatar = (imgurl: string) => {
        if (imgurl !== state.avatar) {
            setState(prev => ({ ...prev, avatar: imgurl }));
            StorageUtil.setItem(StorageKeys.AVATAR, imgurl);
        }
    };

    const handleCreateAvatar = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            if (state.avatar) {
                const html = await TalksService.createAvatar(
                    state.avatar,
                    state.type,
                    state.name,
                    state.dialogue
                );
                setState(prev => ({
                    ...prev,
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

    const handleGenerateCharacterDescription = async (prompt: string) => {
        try {
            setState(prev => ({
                ...prev,
                isGeneratingDescription: true,
                characterDescription: ''
            }));

            await TalksService.generateCharacterDescription(
                prompt,
                state.apiUrl,
                state.apiKey,
                state.model,
                {
                    onToken: (content) => {
                        setState(prev => ({
                            ...prev,
                            characterDescription: prev.characterDescription + content
                        }));
                    },
                    onError: (error) => {
                        setState(prev => ({
                            ...prev,
                            error: '生成角色描述失败',
                            isGeneratingDescription: false
                        }));
                    },
                    onFinish: () => {
                        setState(prev => {
                            const assistantMessage: ChatMessage = { role: "assistant", content: prev.characterDescription };
                            const userMessage: ChatMessage = { role: "user", content: prompt };
                            const newHistory = [...prev.chatHistory, userMessage, assistantMessage]
                                .slice(-prev.maxContextSize);
                            return {
                                ...prev,
                                isGeneratingDescription: false,
                                chatHistory: newHistory,
                                characterDescription: prev.characterDescription
                            };
                        });
                    }
                },
                state.chatHistory
            );
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: '生成角色描述失败',
                isGeneratingDescription: false
            }));
        }
    };

    const handleUpdateName = (name: string) => {
        setState(prev => ({ ...prev, name }));
        StorageUtil.setItem(StorageKeys.NAME, name);
    };

    const handleUpdateDialogue = (dialogue: string) => {
        setState(prev => ({ ...prev, dialogue }));
        StorageUtil.setItem(StorageKeys.DIALOGUE, dialogue);
    };

    const handleUpdateType = (type: string) => {
        setState(prev => ({ ...prev, type }));
        StorageUtil.setItem(StorageKeys.TYPE, type);
    };

    const handleToggleMirror = () => {
        setState(prev => ({ ...prev, isMirror: !prev.isMirror }));
    };

    const handleCreateCharacter = async () => {
        try {
            // 检查必要的输入
            if (!state.characterInput.trim()) {
                setState(prev => ({
                    ...prev,
                    error: '请输入角色名称'
                }));
                return;
            }

            if (!state.characterDescription.trim()) {
                setState(prev => ({
                    ...prev,
                    error: '请先生成角色描述'
                }));
                return;
            }

            setState(prev => ({ ...prev, isLoading: true }));
            
            setState(prev => {
                const newCharacter: Character = {
                    id: crypto.randomUUID(),
                    name: prev.characterInput.trim(),
                    description: prev.characterDescription.trim()
                };

                console.log('Creating new character:', newCharacter);

                const newCharacters = [...prev.characters, newCharacter];
                
                // 保存到本地存储
                StorageUtil.setObject(StorageKeys.CHARACTERS, newCharacters);
                
                return {
                    ...prev,
                    characters: newCharacters,
                    characterInput: '',
                    characterDescription: '',
                    isCreateCharacterModalOpen: false,
                    isLoading: false,
                    error: null
                };
            });
        } catch (error) {
            console.error('Error creating character:', error);
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
        StorageUtil.setItem(StorageKeys.API_URL, apiUrl);
        StorageUtil.setItem(StorageKeys.API_KEY, apiKey);
        StorageUtil.setItem(StorageKeys.MODEL, model);
    };

    const handleUpdateCharacterInput = (input: string) => {
        setState(prev => ({ ...prev, characterInput: input }));
    };

    const handleToggleCharacterModal = () => {
        setState(prev => ({
            ...prev,
            isCreateCharacterModalOpen: !prev.isCreateCharacterModalOpen
        }));
    };

    const handleEditCharacter = (character: Character) => {
        setState(prev => {
            const updatedCharacters = prev.characters.map((c: any) =>
                c.id === character.id ? character : c
            );
            StorageUtil.setObject(StorageKeys.CHARACTERS, updatedCharacters);
            return {
                ...prev,
                characters: updatedCharacters
            };
        });
    };

    const handleDeleteCharacter = (id: string) => {
        setState(prev => {
            const updatedCharacters = prev.characters.filter((character: any) => character.id !== id);
            StorageUtil.setObject(StorageKeys.CHARACTERS, updatedCharacters);
            return {
                ...prev,
                characters: updatedCharacters
            };
        });
    };

    const handleUpdateCharacterPrompt = (prompt: string) => {
        setState(prev => ({ ...prev, characterPrompt: prompt }));
    };

    const handleUpdateOutput = (output: "gif" | "mp4") => {
        setState(prev => ({ ...prev, output }));
        StorageUtil.setItem(StorageKeys.OUTPUT, output);
    };

    const handleSelectCharacter = (character: Character) => {
        setState(prev => ({
            ...prev,
            characterInput: character.name,
            characterDescription: character.description,
            isCreateCharacterModalOpen: false
        }));
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
                        onUpdateOutput={handleUpdateOutput}
                        onCreateCharacter={handleCreateCharacter}
                        onToggleConfigModal={handleToggleConfigModal}
                        onUpdateApiConfig={handleUpdateApiConfig}
                        onToggleCharacterModal={handleToggleCharacterModal}
                        onUpdateCharacterInput={handleUpdateCharacterInput}
                        onEditCharacter={handleEditCharacter}
                        onDeleteCharacter={handleDeleteCharacter}
                        onUpdateCharacterPrompt={handleUpdateCharacterPrompt}
                        onGenerateCharacterDescription={handleGenerateCharacterDescription}
                        onSelectCharacter={handleSelectCharacter}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TalksPreview result={state.result} />
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default Talks; 