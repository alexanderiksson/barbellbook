/**
 * This component will show a spinning loader centered vertically and horizontally on the screen.
 */

export default function Loader() {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center"
            role="status"
            aria-label="Loading"
        >
            <div className="w-10 h-10 border-4 border-t-primary-bright border-neutral-500 rounded-full animate-spin"></div>
        </div>
    );
}
