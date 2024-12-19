import { ApiResponse, DrivingVideo } from '../types';

export const createAvatarGif = async (base64: string, config: any): Promise<ApiResponse> => {
    try {
        const apiUrl = localStorage.getItem('_api_url');
        if (!apiUrl) {
            throw new Error('API URL not configured');
        }

        const url = `${apiUrl}/create_avatar`;
        const apiKey = localStorage.getItem('_api_key');

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                ...config,
                base64: base64.split(';base64,')[1],
                isBase64: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to create avatar:', error);
        throw error;
    }
};

export const getDrivingVideos = async (): Promise<{ data: DrivingVideo[] }> => {
    try {
        const apiUrl = localStorage.getItem('_api_url');
        if (!apiUrl) {
            throw new Error('API URL not configured');
        }

        const url = `${apiUrl}/driving_video`;
        const apiKey = localStorage.getItem('_api_key');

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data: data.data as DrivingVideo[] };
    } catch (error) {
        console.error('Failed to get driving videos:', error);
        throw error;
    }
};

// ... 其他API相关函数 ... 