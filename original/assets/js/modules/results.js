import { processResultsData } from "./results-data.js";
import { ResultsRenderer } from "./results-renderer.js";
import { createResultsChart } from "./results-chart.js";

const DESKTOP_BREAKPOINT_QUERY = "(min-width: 992px)";

const resultsState = {
	chartHost: null,
	chartInstance: null,
	mediaQueryList: null,
	onViewportChange: null,
	onMobileChartShown: null,
	activeLayout: null,
};

function ensureChartHost() {
	if (resultsState.chartHost) return resultsState.chartHost;

	const host = document.createElement("div");
	host.id = "resultsChartHost";
	host.className = "results-chart";
	resultsState.chartHost = host;
	return host;
}

function detachLayoutListeners() {
	const { mediaQueryList, onViewportChange, activeLayout, onMobileChartShown } =
		resultsState;

	if (mediaQueryList && onViewportChange) {
		if (typeof mediaQueryList.removeEventListener === "function") {
			mediaQueryList.removeEventListener("change", onViewportChange);
		} else if (typeof mediaQueryList.removeListener === "function") {
			mediaQueryList.removeListener(onViewportChange);
		}
	}

	if (activeLayout?.mobileChartTabTrigger && onMobileChartShown) {
		activeLayout.mobileChartTabTrigger.removeEventListener(
			"shown.bs.tab",
			onMobileChartShown,
		);
	}

	resultsState.mediaQueryList = null;
	resultsState.onViewportChange = null;
	resultsState.onMobileChartShown = null;
}

function getActiveChartSlot(layout) {
	const useDesktop =
		resultsState.mediaQueryList?.matches === true ||
		window.matchMedia(DESKTOP_BREAKPOINT_QUERY).matches;
	return useDesktop ? layout.chartDesktopSlot : layout.chartMobileSlot;
}

function mountChartHost(layout) {
	const activeSlot = getActiveChartSlot(layout);
	const host = ensureChartHost();
	if (!activeSlot) return;
	if (host.parentElement !== activeSlot) {
		activeSlot.appendChild(host);
	}
}

function bindLayoutListeners(layout) {
	resultsState.activeLayout = layout;
	resultsState.mediaQueryList = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);

	resultsState.onViewportChange = () => {
		mountChartHost(layout);
		if (resultsState.chartInstance) {
			resultsState.chartInstance.resize();
		}
	};

	if (typeof resultsState.mediaQueryList.addEventListener === "function") {
		resultsState.mediaQueryList.addEventListener(
			"change",
			resultsState.onViewportChange,
		);
	} else if (typeof resultsState.mediaQueryList.addListener === "function") {
		resultsState.mediaQueryList.addListener(resultsState.onViewportChange);
	}

	resultsState.onMobileChartShown = () => {
		mountChartHost(layout);
		if (resultsState.chartInstance) {
			resultsState.chartInstance.resize();
		}
	};

	if (layout.mobileChartTabTrigger) {
		layout.mobileChartTabTrigger.addEventListener(
			"shown.bs.tab",
			resultsState.onMobileChartShown,
		);
	}
}

export function presentResults(resultsInput = {}) {
	const quizScreen = document.getElementById("quiz-screen");
	const quizProgressContainer = document.getElementById(
		"quiz-progress-container",
	);
	const resultsSection = document.getElementById("results");

	if (quizProgressContainer) quizProgressContainer.hidden = true;
	if (quizScreen) quizScreen.hidden = true;
	if (resultsSection) resultsSection.hidden = false;

	const resultsPayload = processResultsData(
		Array.isArray(resultsInput.questions) ? resultsInput.questions : [],
		Array.isArray(resultsInput.answers) ? resultsInput.answers : [],
	);

	const renderer = new ResultsRenderer(
		document.getElementById("resultsContainer"),
	);

	detachLayoutListeners();
	const layout = renderer.render(resultsPayload);

	if (layout.chartDesktopSlot || layout.chartMobileSlot) {
		const chartHost = ensureChartHost();
		mountChartHost(layout);

		if (!resultsState.chartInstance) {
			resultsState.chartInstance = createResultsChart(
				chartHost,
				resultsPayload.scores,
			);
		} else {
			resultsState.chartInstance.setHost(chartHost);
			resultsState.chartInstance.setScores(resultsPayload.scores);
		}

		bindLayoutListeners(layout);
		resultsState.chartInstance.resize();
	}

	if (layout.restartButton) {
		layout.restartButton.onclick = null;
		layout.restartButton.addEventListener(
			"click",
			() => document.dispatchEvent(new CustomEvent("quiz:restart")),
			{ once: true },
		);
	}

	return { container: layout.container, resultsPayload };
}
