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

function renderChartMeta() {
	return `
    <div class="results-chart-meta">
      <span class="results-chart-meta__label">Radar view</span>
      <span class="results-chart-meta__hint">Higher values indicate stronger alignment</span>
    </div>
  `;
}

function renderChartPanel(slotId) {
	return `
    <div class="results-panel results-panel--chart">
      ${renderChartMeta()}
      <div id="${slotId}" class="results-chart-slot"></div>
    </div>
  `;
}

function renderTopTraitsPanel(scores, stacked = false) {
	return `
    <div class="results-panel results-panel--traits">
      <p class="results-eyebrow mb-2">Top traits</p>
      <div class="trait-strip${stacked ? " trait-strip--stacked" : ""}">${renderTopTraits(scores)}</div>
    </div>
  `;
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

		if (Object.keys(scores).length === 0) {
			this.container.innerHTML = renderEmptyState();
			return {
				container: this.container,
				chartDesktopSlot: null,
				chartMobileSlot: null,
				mobileChartTabTrigger: null,
				restartButton: document.getElementById("restart-quiz"),
			};
		}

		const markup = `
      <section class="quiz-card results-card">
        ${renderHeader(resultsPayload)}
        <div class="results-layout-desktop d-none d-lg-block">
          <div class="row g-3 mt-2">
            <div class="col-12 col-lg-7">
              ${renderChartPanel("resultsChartSlotDesktop")}
            </div>
            <div class="col-12 col-lg-5">
              ${renderTopTraitsPanel(scores, true)}
            </div>
          </div>
        </div>

        <div class="results-layout-mobile d-lg-none mt-3">
          <ul class="nav nav-tabs results-tabs" id="resultsTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="results-chart-tab" data-bs-toggle="tab" data-bs-target="#results-chart-pane" type="button" role="tab" aria-controls="results-chart-pane" aria-selected="true">Radar view</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="results-traits-tab" data-bs-toggle="tab" data-bs-target="#results-traits-pane" type="button" role="tab" aria-controls="results-traits-pane" aria-selected="false">Top traits</button>
            </li>
          </ul>

          <div class="tab-content results-tabs-content" id="resultsTabsContent">
            <div class="tab-pane fade show active" id="results-chart-pane" role="tabpanel" aria-labelledby="results-chart-tab" tabindex="0">
              ${renderChartPanel("resultsChartSlotMobile")}
            </div>
            <div class="tab-pane fade" id="results-traits-pane" role="tabpanel" aria-labelledby="results-traits-tab" tabindex="0">
              ${renderTopTraitsPanel(scores)}
            </div>
          </div>
        </div>

        <button id="restart-quiz" class="btn btn-primary mt-3">Restart</button>
      </section>
    `;

		this.container.innerHTML = markup;

		return {
			container: this.container,
			chartDesktopSlot: document.getElementById("resultsChartSlotDesktop"),
			chartMobileSlot: document.getElementById("resultsChartSlotMobile"),
			mobileChartTabTrigger: document.getElementById("results-chart-tab"),
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
