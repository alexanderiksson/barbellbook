export default function SafeArea() {
    return (
        <div
            className="fixed w-full top-0 border-b border-[var(--border)]/20 bg-[var(--secondary)]/50 backdrop-blur-xl z-30"
            style={{
                height: "var(--safe-top)",
            }}
        ></div>
    );
}
