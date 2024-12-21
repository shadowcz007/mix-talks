export const StorageKeys = {
    AVATAR: '_avatar',
    NAME: '_name',
    DIALOGUE: '_dialogue',
    TYPE: '_type',
    API_URL: '_api_url',
    API_KEY: '_api_key',
    MODEL: '_model',
    CHARACTERS: 'characters',
    OUTPUT: 'output',
} as const;

export const StorageUtil = {
    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    },

    getItem(key: string) {
        return localStorage.getItem(key);
    },

    setObject(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getObject<T>(key: string, defaultValue: T): T {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    }
}; 