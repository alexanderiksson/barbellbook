import { Link } from "react-router-dom";

interface MenuItem {
    type: "link" | "function";
    label: string;
    icon: React.ElementType;
    onClick?: () => void;
    to?: string;
    danger?: boolean;
}

interface MenuProps {
    isOpen: boolean;
    closeMenu: () => void;
    menuItems: MenuItem[];
    danger?: boolean;
}

interface ItemProps {
    onClick: () => void;
    label: string;
    Icon: React.ElementType;
    danger: boolean;
}

interface LinkItemProps {
    to: string;
    label: string;
    Icon: React.ElementType;
}

const Item = ({ onClick, label, Icon, danger }: ItemProps) => {
    return (
        <li
            className="flex justify-between items-center gap-1.5 p-4 cursor-pointer"
            onClick={onClick}
        >
            <span className={danger ? "text-red-500" : ""}>{label}</span>{" "}
            <Icon size={24} color={danger ? "#dc2626" : ""} />
        </li>
    );
};

const LinkItem = ({ to, label, Icon }: LinkItemProps) => {
    return (
        <li className="text-center">
            <Link to={to} className="flex justify-between items-center gap-1.5 p-4">
                <span>{label}</span> <Icon size={24} />
            </Link>
        </li>
    );
};

export default function Menu({ isOpen, closeMenu, menuItems }: MenuProps) {
    return (
        <div
            className={`${
                isOpen ? "block" : "hidden"
            } absolute bg-zinc-800/75 backdrop-blur-lg rounded-2xl w-52 right-0 top-12 shadow-xl overflow-hidden z-20`}
            role="menu"
            aria-hidden={!isOpen}
        >
            <ul className="divide-y divide-neutral-700">
                {menuItems.map((item, index) => {
                    return item.type === "link" ? (
                        <LinkItem
                            key={index}
                            to={item.to || "#"}
                            label={item.label}
                            Icon={item.icon}
                        />
                    ) : (
                        <Item
                            key={index}
                            onClick={() => {
                                item.onClick?.();
                                closeMenu();
                            }}
                            label={item.label}
                            Icon={item.icon}
                            danger={item.danger ?? false}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
