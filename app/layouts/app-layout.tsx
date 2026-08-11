// nav, offcanvas, about & methodology modals, footer

import { NavLink, Outlet } from "react-router";

export default function AppLayout() {
	return (
		<div className="drawer drawer-end">
			<input id="app-drawer" type="checkbox" className="drawer-toggle" />

			<div className="drawer-content relative min-h-screen flex flex-col">
				{/* BACKGROUND */}
				<div
					aria-hidden="true"
					className="pointer-events-none fixed inset-0 z-[-1000]"
				>
					<div className="absolute inset-0 grid-overlay" />
					<div className="absolute inset-0 noise" />
				</div>

				<header>
					{/* NAVBAR */}
					<nav className="navbar ps-[1rem] pe-[1rem]">
						<div className="navbar-start text-left font-display">
							<NavLink to="/" className="text-xl">
								InsightLab
							</NavLink>
						</div>
						<div className="navbar-end text-base-content">
							<label
								htmlFor="app-drawer"
								aria-label="Open menu"
									className="btn btn-square btn-ghost"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="inline-block h-5 w-5 stroke-current"
										aria-hidden="true"
									>
										{" "}
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										></path>{" "}
									</svg>
							</label>
						</div>
					</nav>
				</header>
				{/* PAGE CONTENT */}
				<main className="flex-1">
					<Outlet />
				</main>
                {/* FOOTER */}
				<footer className="footer footer-horizontal footer-center text-base-content-muted p-1 text-xs">
					&copy; InsightLab 2026.
				</footer>
			</div>
            {/* OFFCANVAS */}
			<div className="drawer-side">
				<label
					htmlFor="app-drawer"
					aria-label="Close menu"
					className="drawer-overlay"
				/>
				<ul className="menu bg-base-200 min-h-full w-80 p-4">
					<li>
						<NavLink to="#">About</NavLink>
					</li>
					<li>
						<NavLink to="#">Methodology</NavLink>
					</li>
				</ul>
			</div>
		</div>
	);
}
