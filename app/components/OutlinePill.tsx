type OutlinePillProps = React.ComponentProps<"button"> & {
    text: string;
};

export default function OutlinePill({ text, ...props }: OutlinePillProps) {
	return <span 
    {...props} 
    className="
    rounded-full
    border border-secondary/25
    bg-secondary/6
    px-[clamp(1rem,1.5vw,1.4rem)]
    py-[clamp(0.45rem,0.7vw,0.6rem)]
    font-display
    text-[clamp(0.8rem,1vw,1rem)]
    text-base-content"
    >
        { text }
    </span>;
}