import React, { useEffect } from 'react';
import { Paper, Stack, Avatar, Checkbox, MultiSelect, Textarea, Select, Radio, Group, Button, Modal, TextInput } from '@mantine/core';
import { MdOutlineArrowDownward } from "react-icons/md";
import { TalksState } from './types';
import { TALK_TYPES } from './constants';

interface TalksFormProps {
    state: TalksState;
    onUpdateAvatar: (imgurl: string) => void;
    onUpdateName: (name: string) => void;
    onUpdateDialogue: (dialogue: string) => void;
    onUpdateType: (type: string) => void;
    onToggleMirror: () => void;
    onCreateAvatar: () => Promise<void>;
    onUpdateOutput: (output: 'gif' | 'mp4') => void;
    onCreateCharacter?: () => void;
    onUpdateApiConfig?: (apiUrl: string, apiKey: string, model: string) => void;
    onToggleConfigModal?: () => void;
}

const TalksForm: React.FC<TalksFormProps> = ({ 
    state, 
    onUpdateAvatar,
    onUpdateName,
    onUpdateDialogue,
    onUpdateType,
    onToggleMirror,
    onCreateAvatar,
    onUpdateOutput,
    onCreateCharacter,
    onUpdateApiConfig,
    onToggleConfigModal
}) => {
    useEffect(() => {
        // 从 localStorage 加载缓存的头像
        const cachedAvatar = localStorage.getItem('avatar');
        if (cachedAvatar) {
            onUpdateAvatar(cachedAvatar);
        }
    }, [onUpdateAvatar]);

    return (
        <Paper shadow="sm" p="md" radius="md">
            <Stack spacing="md">
                <Avatar 
                    size="xl" 
                    src={state.avatar}
                    onClick={async () => {
                        try {
                            const clipboardItems = await navigator.clipboard.read();
                            for (const clipboardItem of clipboardItems) {
                                const imageBlob = clipboardItem.types.includes('image/png') ? await clipboardItem.getType('image/png') : null;
                                if (imageBlob) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const base64data = reader.result as string;
                                        onUpdateAvatar(base64data); // 更新头像
                                        localStorage.setItem('avatar', base64data); // 缓存头像
                                    };
                                    reader.readAsDataURL(imageBlob);
                                }
                            }
                        } catch (error) {
                            console.error('无法从剪切板获取图片:', error);
                        }
                    }}
                />
                
                <Select
                    label="对话类型"
                    value={state.type}
                    onChange={onUpdateType}
                    data={TALK_TYPES}
                />
                
                <Textarea
                    label="对话内容"
                    value={state.dialogue}
                    onChange={(e) => onUpdateDialogue(e.currentTarget.value)}
                    minRows={4}
                />
                
                <Checkbox
                    label="镜像"
                    checked={state.isMirror}
                    onChange={onToggleMirror}
                />
                
                <Button 
                    variant="outline" 
                    color="gray"
                    onClick={onToggleConfigModal}
                >
                    API配置
                </Button>
                
                <Button 
                    variant="outline" 
                    color="blue"
                    onClick={() => state.isCreateCharacterModalOpen = true}
                >
                    创建新角色
                </Button>
                
                <Button 
                    onClick={onCreateAvatar}
                    loading={state.isLoading}
                >
                    生成
                </Button>
            </Stack>

            <Modal
                opened={state.isCreateCharacterModalOpen}
                onClose={() => state.isCreateCharacterModalOpen = false}
                title="创建新角色"
            >
                <Stack>
                    <TextInput
                        label="角色名称"
                        value={state.characterInput}
                        onChange={(e) => state.characterInput = e.currentTarget.value}
                    />
                    <Textarea
                        label="角色描述"
                        value={state.characterDescription}
                        onChange={(e) => state.characterDescription = e.currentTarget.value}
                        minRows={3}
                    />
                    <Button
                        onClick={onCreateCharacter}
                        loading={state.isLoading}
                    >
                        确认创建
                    </Button>
                </Stack>
            </Modal>

            <Modal
                opened={state.isConfigModalOpen}
                onClose={() => onToggleConfigModal?.()}
                title="API配置"
            >
                <Stack>
                    <TextInput
                        label="API URL"
                        value={state.apiUrl}
                        onChange={(e) => state.apiUrl = e.currentTarget.value}
                        placeholder="请输入API URL"
                    />
                    <TextInput
                        label="API Key"
                        value={state.apiKey}
                        onChange={(e) => state.apiKey = e.currentTarget.value}
                        placeholder="请输入API Key"
                        type="password"
                    />
                    <TextInput
                        label="模型"
                        value={state.model}
                        onChange={(e) => state.model = e.currentTarget.value}
                        placeholder="请输入模型名称"
                    />
                    <Button
                        onClick={() => {
                            onUpdateApiConfig?.(state.apiUrl, state.apiKey, state.model);
                            onToggleConfigModal?.();
                        }}
                    >
                        保存配置
                    </Button>
                </Stack>
            </Modal>
        </Paper>
    );
};

export default TalksForm; 