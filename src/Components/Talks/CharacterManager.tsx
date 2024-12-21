import React from 'react';
import { Stack, Avatar, Group, TextInput, Textarea, Button, Text } from '@mantine/core';
import { MdEdit, MdDelete } from "react-icons/md";
import { Character, TalksState } from './types';

interface CharacterManagerProps {
    state: TalksState;
    onUpdateAvatar: (imgurl: string) => void;
    onUpdateCharacterInput?: (input: string) => void;
    onUpdateCharacterDescription?: (desc: string) => void;
    onUpdateCharacterPrompt?: (prompt: string) => void;
    onGenerateCharacterDescription?: (prompt: string) => Promise<void>;
    onEditCharacter?: (character: Character) => void;
    onDeleteCharacter?: (id: string) => void;
    onClose: () => void;
    onCreateCharacter?: () => void;
}

const CharacterManager: React.FC<CharacterManagerProps> = ({
    state,
    onUpdateAvatar,
    onUpdateCharacterInput,
    onUpdateCharacterDescription,
    onUpdateCharacterPrompt,
    onGenerateCharacterDescription,
    onEditCharacter,
    onDeleteCharacter,
    onClose,
    onCreateCharacter
}) => {
  

    const handlePasteAvatar = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                const imageBlob = clipboardItem.types.includes('image/png') ? 
                    await clipboardItem.getType('image/png') : null;
                if (imageBlob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        onUpdateAvatar(base64data);
                    };
                    reader.readAsDataURL(imageBlob);
                }
            }
        } catch (error) {
            console.error('无法从剪切板获取图片:', error);
        }
    };

    return (
        <Stack>
            <Group position="center">
                <Avatar 
                    size="xl" 
                    src={state.newCharacterAvatar}
                    onClick={handlePasteAvatar}
                />
            </Group>

            {state.characters.map((char: Character) => (
                <Group key={char.id} position="apart">
                    <Text>{char.name}</Text>
                    <Group spacing="xs">
                        <MdEdit 
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                onUpdateCharacterInput?.(char.name);
                                onUpdateCharacterDescription?.(char.description);
                                onUpdateAvatar(char.avatar || '');
                                onEditCharacter?.(char);
                            }}
                        />
                        <MdDelete 
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                onDeleteCharacter?.(char.id);
                            }}
                        />
                    </Group>
                </Group>
            ))}

            <TextInput
                label="角色名称"
                value={state.characterInput}
                onChange={(e) => onUpdateCharacterInput?.(e.currentTarget.value)}
            />
            <Textarea
                label="角色描述指令"
                placeholder="请输入角色描述指令，例如：'创建一个活泼开朗的女高中生角色'"
                value={state.characterPrompt || ''}
                onChange={(e) => onUpdateCharacterPrompt?.(e.currentTarget.value)}
                minRows={2}
            />
            <Button
                variant="outline"
                onClick={() => {
                    if (!state.characterPrompt) {
                        alert('请先输入角色描述指令');
                        return;
                    }
                    onGenerateCharacterDescription?.(state.characterPrompt);
                }}
                loading={state.isGeneratingDescription}
                disabled={!state.characterPrompt}
            >
                生成角色描述
            </Button>
            <Textarea
                label="角色描述"
                value={state.characterDescription}
                onChange={(e) => onUpdateCharacterDescription?.(e.currentTarget.value)}
                placeholder="AI生成的角色描述将显示在这里，您也可以直接编辑"
                minRows={3}
                autosize
                maxRows={10}
            />
            <Button
                onClick={onCreateCharacter}
                loading={state.isLoading}
            >
                确认创建
            </Button>
        </Stack>
    );
};

export default CharacterManager; 