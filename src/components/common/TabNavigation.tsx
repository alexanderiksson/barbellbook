import { NavLink } from "react-router-dom";

interface TabItem {
    to: string;
    label: string;
    end?: boolean;
}

interface TabNavigationProps {
    tabs: TabItem[];
}

export default function TabNavigation({ tabs }: TabNavigationProps) {
    return (
        <div className="flex border-b border-border/20 mb-6">
            {tabs.map((tab, index) => (
                <NavLink
                    key={index}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                        `px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                            isActive
                                ? "text-primary-bright border-primary-bright"
                                : "text-text-grey border-transparent hover:text-text hover:border-border"
                        }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </div>
    );
}
