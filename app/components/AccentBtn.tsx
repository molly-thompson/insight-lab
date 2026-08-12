import { Link } from "react-router";

type AccentBtnProps = React.ComponentProps<"button"> & {
    text: string;
    to: string;
};

export default function AccentBtn({ text, to }: AccentBtnProps) {
    return (
        <Link
            to={to}
            className="
                mt-[clamp(0.75rem,1.5vw,1rem)]
                cursor-pointer
                rounded-full
                border border-primary
                bg-linear-to-br from-secondary to-primary
                px-[clamp(1.25rem,2vw,1.75rem)]
                py-[clamp(0.5rem,0.8vw,0.75rem)]
                font-display
                text-[clamp(1rem,1.5vw,1.25rem)]
                font-bold
                text-primary-content
                transition-[transform,box-shadow]
                duration-180
                ease-in-out
                hover:-translate-y-0.5
                hover:shadow-[0_0.75rem_2rem_rgba(56,189,248,0.25)]
                focus-visible:outline-3
                focus-visible:outline-base-content
                focus-visible:outline-offset-4
                active:scale-[0.98]"
        >
            {text}
        </Link>
    );
}
