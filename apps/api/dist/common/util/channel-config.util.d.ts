export declare function encryptChannelConfig(config: object, encryptionKey: string): string;
export declare function decryptChannelConfig<T = Record<string, any>>(encrypted: string, encryptionKey: string): T;
