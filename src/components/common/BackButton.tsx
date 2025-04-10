import { Link } from "react-router-dom";
import ArrowIcon from "../../assets/icons/ArrowIcon";

export default function BackButton({ to, label }: { to: string; label: string }) {
    return (
        <Link className="mb-4 inline-flex items-center py-2 text-sky-500" to={to}>
            <ArrowIcon color="#0ea5e9" size="32px" />
            {label}
        </Link>
    );
}
