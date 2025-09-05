interface TabItem {
    id: string;
    label: string;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex border-b border-border/20 mb-6">
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
                        activeTab === tab.id
                            ? "text-primary-bright border-primary-bright"
                            : "text-text-grey border-transparent hover:text-text hover:border-border"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
