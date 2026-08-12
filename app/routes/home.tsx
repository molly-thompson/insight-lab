import type { Route } from "./+types/home";
import OutlinePill from "~/components/OutlinePill";
import AccentBtn from "~/components/AccentBtn";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "InsightLab" },
		{
			name: "description",
			content: "InsightLab: Behavioral Analysis Assessment",
		},
	];
}

export default function Home() {
    return (
        <section
            id="landing-page"
            className="mx-auto mt-3 w-full max-w-7xl px-4 py-12 text-balance"
            aria-labelledby="hero-text"
        >
            <div className="mx-auto flex w-[min(100%,55rem)] flex-col items-center justify-center text-center">

                <p className="tag mb-[clamp(0.6rem,1vw,0.75rem)] text-[clamp(0.8rem,1.2vw,1rem)] font-semibold">
                    behavioral analysis assessment
                </p>

                <h1
                    id="hero-text"
                    className="
                        mb-[clamp(0.75rem,1.5vw,1rem)]
                        font-display
                        text-[clamp(3rem,7vw,5.5rem)]
                        leading-[0.95]
                        tracking-[-0.05em]
                    "
                >
                    Decode what drives your people
                </h1>

                <p className="
                    mx-auto
                    mb-[clamp(0.75rem,1.5vw,1rem)]
                    max-w-[38rem]
                    text-[clamp(0.9rem,1.2vw,1rem)]
                    leading-[1.7]
                    text-primary-light/78
                ">
					Explore the behaviours, strengths, and decision-making patterns that shape how people work - and gain a clearer picture of what makes them tick.
				</p>

                <div
                    className="mb-[clamp(0.75rem,1.5vw,1rem)] flex flex-wrap justify-center gap-[clamp(0.5rem,1vw,0.75rem)]"
                    aria-label="Assessment details"
                >
                    <OutlinePill text="10 behavioural dimensions" />
                    <OutlinePill text="Structured analysis" />
                    <OutlinePill text="Individual insights" />
                </div>

                <AccentBtn text="Get Started" to="/assessments"/>

            </div>
        </section>
    );
}
