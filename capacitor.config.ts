import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.barbellbook.app",
    appName: "BarbellBook",
    webDir: "dist",
    plugins: {
        StatusBar: {
            overlaysWebView: true, // This enables safe area insets
        },
    },
};

export default config;
