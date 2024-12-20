import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mantine/core';
import { TalksProps, TalksState, DrivingVideo } from './types';
import { createAvatarGif, getDrivingVideos } from './api/talkApi';
import { createBaseHtml } from './utils/htmlGenerators';
import TalksForm from './TalksForm';
import TalksPreview from './TalksPreview';

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
        characters: [],
        isLoading: false,
        isConfigModalOpen: false,
        apiUrl: localStorage.getItem('_api_url') || '',
        apiKey: localStorage.getItem('_api_key') || '',
        model: localStorage.getItem('_model') || '',
        streamResponse: '',
        lastResponse: ''
    });

    useEffect(() => {
        getDrivingVideos().then(response => {
            if (response.data && Array.isArray(response.data)) {
                setState(prev => ({
                    ...prev,
                    drivingVideos: response.data as DrivingVideo[]
                }));
            }
        }).catch(error => {
            setState(prev => ({
                ...prev,
                error: '获取驱动视频失败'
            }));
        });
    }, []);

    const handleUpdateAvatar = (imgurl: string) => {
        setState(prev => ({
            ...prev,
            avatar: imgurl
        }));
        localStorage.setItem('_avatar', imgurl);
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
            
            // 这里添加创建角色的API调用
            // const response = await createCharacterApi({
            //     name: this.state.characterInput,
            //     description: this.state.characterDescription
            // });

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