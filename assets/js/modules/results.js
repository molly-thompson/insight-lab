import { processResultsData, getTopScores } from "./results-data.js";
import { ResultsRenderer } from "./results-renderer.js";
import { createResultsChart } from "./results-chart.js";

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
  const layout = renderer.render(resultsPayload);

  if (layout.chartHost) {
    createResultsChart(layout.chartHost, resultsPayload.scores);
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
