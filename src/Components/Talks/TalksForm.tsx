import React, { useEffect } from 'react';
import { Paper, Stack, Avatar, Checkbox, MultiSelect, Textarea, Select, Radio, Group, Button, Modal, TextInput, Text } from '@mantine/core';
import { MdOutlineArrowDownward, MdInfo, MdEdit, MdDelete } from "react-icons/md";
import { TalksState } from './types';
import { TALK_TYPES } from './constants';
import CharacterManager from './CharacterManager';

interface Character {
    id: string;
    name: string;
    description: string;
    avatar?: string;
}

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
    onToggleConfigModal: () => void;
    onToggleCharacterModal: () => void;
    onUpdateCharacterInput?: (input: string) => void;
    onUpdateCharacterDescription?: (desc: string) => void;
    onUpdateApiUrl?: (url: string) => void;
    onUpdateApiKey?: (key: string) => void;
    onUpdateModel?: (model: string) => void;
    onGenerateCharacterDescription?: (prompt: string) => Promise<void>;
    onUpdateCharacterPrompt?: (prompt: string) => void;
    onSelectCharacter?: (character: Character) => void;
    onDeleteCharacter?: (id: string) => void;
    onEditCharacter?: (character: Character) => void;
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
    onToggleConfigModal,
    onToggleCharacterModal,
    onUpdateCharacterInput,
    onUpdateCharacterDescription,
    onUpdateApiUrl,
    onUpdateApiKey,
    onUpdateModel,
    onGenerateCharacterDescription,
    onUpdateCharacterPrompt,
    onSelectCharacter,
    onDeleteCharacter,
    onEditCharacter
}) => {
    const [characters, setCharacters] = React.useState<Character[]>([]);
    const [showDescription, setShowDescription] = React.useState(false);

    useEffect(() => {
        // 从 localStorage 加载缓存的头像
        const cachedAvatar = localStorage.getItem('avatar');
        if (cachedAvatar) {
            onUpdateAvatar(cachedAvatar);
        }
    }, [onUpdateAvatar]);

    useEffect(() => {
        // 加载角色列表
        const savedCharacters = JSON.parse(localStorage.getItem('characters') || '[]');
        setCharacters(savedCharacters);
    }, []);

    const handleCharacterSelect = (characterId: string) => {
        const character = characters.find(c => c.id === characterId);
        if (character) {
            onSelectCharacter?.(character);
            onUpdateAvatar(character.avatar || '');
            onUpdateName(character.name);
        }
    };

    return (
        <Paper shadow="sm" p="md" radius="md">
            <Stack spacing="md">
                <Group position="left">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onToggleConfigModal}
                    >
                        API配置
                    </Button>
                </Group>

                <Group position="left" align="flex-end">
                    <Select
                        style={{ width: 200 }}
                        label="选择角色"
                        data={characters.map(char => ({
                            value: char.id,
                            label: char.name
                        }))}
                        onChange={handleCharacterSelect}
                    />

                    <Button
                        variant="outline"
                        color="blue"
                        onClick={onToggleCharacterModal}
                    >
                        创建新角色
                    </Button>
                </Group>
                <Group position="left" spacing="xs">
                    <Avatar
                        size="xl"
                        src={state.avatar}

                    />

                    <Checkbox
                        label="镜像"
                        checked={state.isMirror}
                        onChange={onToggleMirror}
                    />


                    {state.characterDescription && (
                        <MdInfo
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowDescription(!showDescription)}
                        />
                    )}
                </Group>

                <Modal
                    opened={showDescription}
                    onClose={() => setShowDescription(false)}
                    title={`${state.characterInput}的描述`}
                >
                    <Text>{state.characterDescription}</Text>
                </Modal>

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



                <Group position="left">
                    <Button
                        onClick={onCreateAvatar}
                        loading={state.isLoading}
                    >
                        生成
                    </Button>
                </Group>
            </Stack>

            <Modal
                opened={state.isCreateCharacterModalOpen}
                onClose={onToggleCharacterModal}
                title="角色管理"
            >
                <CharacterManager
                    state={state}
                    onUpdateAvatar={onUpdateAvatar}
                    onUpdateCharacterInput={onUpdateCharacterInput}
                    onUpdateCharacterDescription={onUpdateCharacterDescription}
                    onUpdateCharacterPrompt={onUpdateCharacterPrompt}
                    onGenerateCharacterDescription={onGenerateCharacterDescription}
                    onEditCharacter={onEditCharacter}
                    onDeleteCharacter={onDeleteCharacter}
                    onClose={onToggleCharacterModal}
                />
            </Modal>

            <Modal
                opened={state.isConfigModalOpen}
                onClose={onToggleConfigModal}
                title="API配置"
            >
                <Stack>
                    <TextInput
                        label="API URL"
                        value={state.apiUrl}
                        onChange={(e) => onUpdateApiUrl?.(e.currentTarget.value)}
                        placeholder="请输入API URL"
                    />
                    <TextInput
                        label="API Key"
                        value={state.apiKey}
                        onChange={(e) => onUpdateApiKey?.(e.currentTarget.value)}
                        placeholder="请输入API Key"
                        type="password"
                    />
                    <TextInput
                        label="模型"
                        value={state.model}
                        onChange={(e) => onUpdateModel?.(e.currentTarget.value)}
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