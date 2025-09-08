import { useState } from "react";

export function useTabNavigation<T extends string>(initialTab: T, validTabs: readonly T[]) {
    const [activeTab, setActiveTab] = useState<T>(initialTab);

    const handleTabChange = (tabId: string) => {
        if (validTabs.includes(tabId as T)) {
            setActiveTab(tabId as T);
        }
    };

    return {
        activeTab,
        setActiveTab,
        handleTabChange,
    };
}
