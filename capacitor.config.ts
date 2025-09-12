import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.barbellbook.app",
    appName: "BarbellBook",
    webDir: "dist",
    plugins: {
        StatusBar: {
            style: "dark",
        },
    },
};

export default config;
