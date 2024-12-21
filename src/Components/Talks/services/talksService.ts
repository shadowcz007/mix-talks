import { getDrivingVideos, createAvatarGif } from '../api/talkApi';
import { createBaseHtml } from '../utils/htmlGenerators';
import { AiApi } from '../api/aiApi';
import { DrivingVideo, ChatMessage } from '../types';

export class TalksService {
    static async fetchDrivingVideos(): Promise<DrivingVideo[]> {
        const response = await getDrivingVideos();
        if (response.data && Array.isArray(response.data)) {
            return response.data as DrivingVideo[];
        }
        throw new Error('获取驱动视频失败');
    }

    static async createAvatar(avatar: string, type: string, name: string, dialogue: string): Promise<string> {
        return await createBaseHtml(avatar, type, name, dialogue);
    }

    static async generateCharacterDescription(
        prompt: string,
        apiUrl: string,
        apiKey: string,
        model: string,
        callbacks: {
            onToken: (content: string) => void;
            onError: (error: any) => void;
            onFinish: () => void;
        },
        chatHistory: ChatMessage[] = []
    ) {
        const aiApi = new AiApi(apiUrl, apiKey, model);
        await aiApi.generateCharacterDescription(prompt, chatHistory, callbacks);
    }
} 