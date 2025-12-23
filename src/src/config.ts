export interface AppConfig {
    apiBaseUrl: string;
    wsBaseUrl: string;
}

let config: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig | null> {
    if (config) return config;

    const response = await fetch("/config.json", {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Failed to load config.json");
    }

    config = await response.json();

    return config;
}

export function getConfig(): AppConfig {
    if (!config) {
        throw new Error("Config not loaded yet");
    }
    return config;
}