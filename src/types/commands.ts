export type Command = {
    command: string;
    handler: () => Promise<void>;
};