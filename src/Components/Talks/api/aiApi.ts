interface ChatMessage {
    role: string;
    content: string;
}

interface StreamCallbacks {
    onStart?: () => void;
    onToken?: (token: string) => void;
    onFinish?: () => void;
    onError?: (error: Error) => void;
}

export class AiApi {
    private apiUrl: string;
    private apiKey: string;
    private model: string;

    constructor(apiUrl: string, apiKey: string, model: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.model = model;
    }

    async streamChat(messages: ChatMessage[], callbacks: StreamCallbacks) {
        try {
            callbacks.onStart?.();

            const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('无法获取响应流');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk
                    .split('\n')
                    .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');

                for (const line of lines) {
                    try {
                        const jsonStr = line.replace(/^data: /, '').trim();
                        if (!jsonStr) continue;

                        const json = JSON.parse(jsonStr);
                        const content = json.choices[0]?.delta?.content || '';
                        
                        if (content) {
                            callbacks.onToken?.(content);
                        }
                    } catch (e) {
                        console.error('解析流数据失败:', e);
                    }
                }
            }

            callbacks.onFinish?.();
        } catch (error) {
            const err = error instanceof Error ? error : new Error('未知错误');
            callbacks.onError?.(err);
            throw err;
        }
    }

    // 生成角色描述的专用方法
    async generateCharacterDescription(prompt: string, callbacks: StreamCallbacks) {
        const messages = [
            {
                role: "system",
                content: "你是一个角色设定助手,可以根据用户的要求创建详细的角色描述。只输出角色描述，不要输出任何其他内容。如果用户的指令不清晰，请让用户补充具体细节，给出明确的提示"
            },
            {
                role: "user",
                content: prompt
            }
        ];

        return this.streamChat(messages, callbacks);
    }
} 