import { escapeHtml, formatTraitLabel } from "./utils/string-utils.js";

function renderScoreList(scores) {
  return Object.entries(scores)
    .map(
      ([trait, score]) => `<li>${escapeHtml(trait)}: ${escapeHtml(score)}</li>`,
    )
    .join("");
}

function renderAnswerSummary(answers) {
  return answers
    .map(
      (answer, index) =>
        `<li>Question ${index + 1}: ${escapeHtml(answer.choice)} <strong>(${escapeHtml(answer.label)})</strong></li>`,
    )
    .join("");
}

import { getTraitAccent, rgbaString } from "./utils/color-utils.js";

function renderTopTraits(scores, limit = 3) {
  return Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, limit)
    .map(([trait, score], index) => {
      const accent = getTraitAccent(trait, index);
      const border = rgbaString(
        accent,
        index === 0 ? 0.42 : index === 1 ? 0.32 : 0.24,
      );
      const base = rgbaString(
        accent,
        index === 0 ? 0.18 : index === 1 ? 0.14 : 0.1,
      );
      const toneClass =
        index === 0
          ? "trait-chip--primary"
          : index === 1
            ? "trait-chip--secondary"
            : "trait-chip--tertiary";
      return `
        <article class="trait-chip ${toneClass}" style="--trait-accent: #${accent.toString(16).padStart(6, "0")}; border-color: ${border}; background: linear-gradient(180deg, ${base}, rgba(15, 23, 42, 0.84)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 0 1px ${rgbaString(accent, 0.08)};">
          <span class="trait-chip__rank">0${index + 1}</span>
          <div class="trait-chip__body">
            <span class="trait-chip__label">${escapeHtml(formatTraitLabel(trait))}</span>
            <strong class="trait-chip__value">${escapeHtml(score)}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

export class ResultsRenderer {
  constructor(containerElement) {
    this.container =
      containerElement || document.getElementById("resultsContainer");
    if (!this.container) throw new Error("Missing results container element");
  }

  render(resultsPayload) {
    const scores =
      resultsPayload && resultsPayload.scores ? resultsPayload.scores : {};
    const answers = Array.isArray(resultsPayload.answers)
      ? resultsPayload.answers
      : [];

    if (Object.keys(scores).length === 0) {
      this.container.innerHTML = renderEmptyState();
      return {
        container: this.container,
        chartHost: null,
        restartButton: document.getElementById("restart-quiz"),
      };
    }

    const markup = `
      <section class="quiz-card results-card">
        ${renderHeader(resultsPayload)}
        ${renderTraitStrip(scores)}
        ${renderChartSection()}

        <button id="restart-quiz" class="btn btn-primary mt-3">Restart</button>
      </section>
    `;

    this.container.innerHTML = markup;

    return {
      container: this.container,
      chartHost: document.getElementById("resultsChart"),
      restartButton: document.getElementById("restart-quiz"),
    };
  }
}

function renderHeader(resultsPayload) {
  const overall = escapeHtml(resultsPayload.overall || "Balanced");
  return `
    <div class="results-header">
      <div>
        <p class="results-eyebrow">Results overview</p>
        <h2>${overall}</h2>
        <p class="results-subtitle">A concise view of your strongest behavioural signals, ranked from most pronounced to least.</p>
      </div>
      <div class="results-badge">
        <span class="results-badge__label">Dominant pattern</span>
        <strong class="results-badge__value">${overall}</strong>
      </div>
    </div>
  `;
}

function renderTraitStrip(scores) {
  return `<div class="trait-strip">${renderTopTraits(scores)}</div>`;
}

function renderChartSection() {
  return `
    <div class="results-chart-wrap">
      <div class="results-chart-meta">
        <span class="results-chart-meta__label">Radar view</span>
        <span class="results-chart-meta__hint">Higher values indicate stronger alignment</span>
      </div>
      <div id="resultsChart" class="results-chart"></div>
    </div>
  `;
}

function renderScoresSection(scores) {
  return `
    <div class="results-section results-section--scores">
      <h3>Trait scores</h3>
      <ul>${renderScoreList(scores)}</ul>
    </div>
  `;
}

function renderAnswersSection(answers) {
  return `
    <div class="results-section results-section--answers">
      <h3>Answer summary</h3>
      <ul>${renderAnswerSummary(answers)}</ul>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <section class="quiz-card results-card">
      <div class="results-header">
        <div>
          <p class="results-eyebrow">Results overview</p>
          <h2>Balanced</h2>
          <p class="results-subtitle">No quiz results are available to render.</p>
        </div>
      </div>
      <button id="restart-quiz" class="btn btn-primary mt-3">Restart</button>
    </section>
  `;
}
