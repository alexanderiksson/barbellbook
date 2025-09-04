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
    spacingTop?: boolean;
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
            <span className={danger ? "text-danger-bright" : ""}>{label}</span>{" "}
            <Icon
                size={24}
                color={
                    danger
                        ? getComputedStyle(document.documentElement).getPropertyValue(
                              "--color-danger"
                          )
                        : ""
                }
            />
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

export default function Menu({ isOpen, closeMenu, menuItems, spacingTop }: MenuProps) {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-10 bg-black/70" onClick={() => closeMenu()}></div>
            )}

            <div
                className={`${
                    isOpen ? "block" : "hidden"
                } absolute bg-secondary backdrop-blur-lg rounded-2xl w-52 right-0 shadow-xl overflow-hidden z-20`}
                role="menu"
                aria-hidden={!isOpen}
                style={{ top: spacingTop ? "3rem" : "1.5rem" }}
            >
                <ul className="divide-y divide-border">
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
        </>
    );
}
