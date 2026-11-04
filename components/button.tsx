type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "light_bg" | "secondary";
};

export function Button({
    children,
    variant = "default",
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "inline-flex cursor-pointer min-h-12 items-center gap-8 px-5 text-sm transition-all duration-200";

    const variants = {
        default:
            "!bg-ink !text-bone hover:!bg-signal hover:!text-ink",

        light_bg:
            "!bg-bone !text-ink hover:!bg-signal hover:!text-ink",

        secondary:
            "border border-border !bg-surface !text-ink shadow-[var(--shadow-paper)] hover:!bg-white hover:!text-ink hover:border-ink hover:-translate-y-0.5 active:translate-y-0 active:shadow-none aria-pressed:!bg-ink aria-pressed:!text-bone aria-pressed:!border-ink aria-pressed:shadow-none aria-pressed:hover:!bg-signal aria-pressed:hover:!text-ink",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}