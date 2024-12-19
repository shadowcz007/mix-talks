import React from 'react';
import { Container, Grid } from '@mantine/core';
import { TalksProps, TalksState, DrivingVideo } from './types';
import { createAvatarGif, getDrivingVideos } from './api/talkApi';
import { createBaseHtml } from './utils/htmlGenerators';
import TalksForm from './TalksForm';
import TalksPreview from './TalksPreview';

class Talks extends React.Component<TalksProps, TalksState> {
    constructor(props: TalksProps) {
        super(props);
        this.state = {
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
        };

        // 绑定方法
        this.updateAvatar = this.updateAvatar.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateDialogue = this.updateDialogue.bind(this);
        this.updateType = this.updateType.bind(this);
        this.toggleMirror = this.toggleMirror.bind(this);
        this.createAvatar = this.createAvatar.bind(this);
    }

    updateAvatar = (imgurl: string) => {
        this.setState({ avatar: imgurl });
        localStorage.setItem('_avatar', imgurl);
    };

    updateName = (name: string) => {
        this.setState({ name });
        localStorage.setItem('_name', name);
    };

    updateDialogue = (dialogue: string) => {
        this.setState({ dialogue });
        localStorage.setItem('_dialogue', dialogue);
    };

    updateType = (type: string) => {
        this.setState({ type });
        localStorage.setItem('_type', type);
    };

    toggleMirror = () => {
        this.setState(prevState => ({
            isMirror: !prevState.isMirror
        }));
    };

    createAvatar = async () => {
        try {
            this.setState({ isLoading: true });


            if (this.state.avatar) {
                const html = await createBaseHtml(
                    this.state.avatar,
                    this.state.type,
                    this.state.name,
                    this.state.dialogue
                );
                this.setState({
                    avatar: this.state.avatar,
                    result: html,
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({
                error: '创建头像失败',
                isLoading: false
            });
        }
    };

    createCharacter = async () => {
        try {
            this.setState({ isLoading: true });
            
            // 这里添加创建角色的API调用
            // const response = await createCharacterApi({
            //     name: this.state.characterInput,
            //     description: this.state.characterDescription
            // });

            // 更新角色列表
            this.setState(prevState => ({
                characters: [...prevState.characters, {
                    name: this.state.characterInput,
                    description: this.state.characterDescription
                }],
                characterInput: '',
                characterDescription: '',
                isCreateCharacterModalOpen: false,
                isLoading: false
            }));

        } catch (error) {
            this.setState({
                error: '创建角色失败',
                isLoading: false
            });
        }
    };

    componentDidMount() {
        getDrivingVideos().then(response => {
            if (response.data && Array.isArray(response.data)) {
                this.setState({
                    drivingVideos: response.data as DrivingVideo[]
                });
            }
        }).catch(error => {
            this.setState({ error: '获取驱动视频失败' });
        });
    }

    toggleConfigModal = () => {
        this.setState(prevState => ({
            isConfigModalOpen: !prevState.isConfigModalOpen
        }));
    };

    updateApiConfig = (apiUrl: string, apiKey: string, model: string) => {
        this.setState({ 
            apiUrl,
            apiKey,
            model,
            isConfigModalOpen: false 
        });
        
        // 保存到localStorage
        localStorage.setItem('_api_url', apiUrl);
        localStorage.setItem('_api_key', apiKey);
        localStorage.setItem('_model', model);
    };

    render() {
        return (
            <Container size="xl" py="xl">
                <Grid>
                    <Grid.Col span={6}>
                        <TalksForm
                            state={this.state}
                            onUpdateAvatar={this.updateAvatar}
                            onUpdateName={this.updateName}
                            onUpdateDialogue={this.updateDialogue}
                            onUpdateType={this.updateType}
                            onToggleMirror={this.toggleMirror}
                            onCreateAvatar={this.createAvatar}
                            onUpdateOutput={(output) => this.setState({ output })}
                            onCreateCharacter={this.createCharacter}
                            onToggleConfigModal={this.toggleConfigModal}
                            onUpdateApiConfig={this.updateApiConfig}
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TalksPreview result={this.state.result} />
                    </Grid.Col>
                </Grid>
            </Container>
        );
    }
}

export default Talks; 