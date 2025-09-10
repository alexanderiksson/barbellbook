export default function SafeArea() {
    return (
        <div
            className="hidden standalone:block fixed w-full top-0 border-b border-border/20 bg-secondary/50 backdrop-blur-xl z-30"
            style={{
                height: "env(safe-area-inset-top)",
            }}
        ></div>
    );
}
