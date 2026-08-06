

//quiz logic

import {
  initializeQuiz,
  resetQuiz,
  getCurrentQuestion,
  getQuestionCount,
  getCurrentIndex,
  answerCurrentQuestion,
  getResults,
} from "./modules/quiz-logic.js";

// small helper to get DOM elements
function $id(id) {
  return document.getElementById(id);
}

const welcomeScreen = $id("welcome-screen");
const quizScreen = $id("quiz-screen");
const startAssessmentButton = $id("start-assessment-button");
const quizHeading = $id("quiz-heading");
const questionCounter = $id("question-counter");
const progressBar = $id("progress-bar");
const quizProgressContainer = $id("quiz-progress-container");
const homeLogo = $id("home-logo");

// Show the quiz and start it
function startAssessment() {
  if (!welcomeScreen || !quizScreen) return;
  welcomeScreen.hidden = true;
  quizScreen.hidden = false;
  if (quizHeading) quizHeading.focus();
  startQuiz();
}
if (homeLogo) {
  homeLogo.addEventListener("click", function (event) {
    event.preventDefault();

    resetQuiz();

    welcomeScreen.hidden = false;
    quizScreen.hidden = true;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (startAssessmentButton) {
  startAssessmentButton.addEventListener("click", startAssessment);
}

function updateProgress(index) {
  const totalQuestions = getQuestionCount();
  if (!questionCounter || !progressBar || totalQuestions === 0) {
    return;
  }

  const currentQuestionNumber = index + 1;
  const progressPercentage = ((currentQuestionNumber-1) / totalQuestions) * 100;

  questionCounter.textContent = `Question ${currentQuestionNumber} of ${totalQuestions}`;
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.textContent = `${Math.round(progressPercentage)}%`;
  progressBar.setAttribute(
    "aria-valuenow",
    String(Math.round(progressPercentage)),
  );
}
//capitalising the results labels
function capitalizeLabel(value) {
  if (typeof value !== "string" || value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function startQuiz() {
  if (quizProgressContainer) {
    quizProgressContainer.hidden = false;
  }

  initializeQuiz();
  renderQuestion();
}

function renderQuestion() {
  const question = getCurrentQuestion();
  const main = $id("quiz-content");
  if (!main || !question) return;

  const currentIndex = getCurrentIndex();
  updateProgress(currentIndex);

  let optionsHtml = "";
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    const ansId = option.ansId || option.ansID || `${question.id}_${i}`;
    const text = option.text || option.answer || String(option);
    optionsHtml += `<button class="quiz-option btn btn-outline-primary w-100 text-start" data-ansid="${ansId}" data-index="${i}">${text}</button>`;
  }

  main.innerHTML = `
    <section class="quiz-card">
      <h2>Question ${currentIndex + 1}</h2>
      <p>${question.text}</p>
      <div class="quiz-options d-grid gap-4">${optionsHtml}</div>
    </section>
  `;

  const buttons = main.querySelectorAll(".quiz-option");
  for (const btn of buttons) {
    btn.addEventListener("click", function () {
      const ansId = this.dataset.ansid;
      handleAnswer(ansId);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  }

  const first = main.querySelector(".quiz-option");
  if (first) first.focus();
}

function handleAnswer(ansId) {
  const result = answerCurrentQuestion(ansId);
  if (result.next) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  if (quizProgressContainer) {
    quizProgressContainer.hidden = true;
  }
  const main = $id("quiz-content");
  if (!main) return;

  const results = getResults();

  let scoresHtml = "";
  for (const trait in results.scores) {
    scoresHtml += `<li>${capitalizeLabel(trait)}: ${results.scores[trait]}</li>`;
  }

  let summaryHtml = "";
  for (const item of results.summary) {
    summaryHtml += `<li>Question ${item.questionNumber}: ${item.choice} <strong>(${capitalizeLabel(item.displayLabel)})</strong></li>`;
  }

  const overallLabel =
    results.overall === "Balanced"
      ? results.overall
      : capitalizeLabel(results.overall);

  main.innerHTML = `
    <section class="quiz-card">
      <h2>Results</h2>
      <p><strong>Overall:</strong> ${overallLabel}</p>
      <div>
        <h3>Scores</h3>
        <ul>${scoresHtml}</ul>
      </div>
      <div>
        <h3>Answers</h3>
        <ul>${summaryHtml}</ul>
      </div>
      <button id="restart-quiz" class="btn btn-primary mt-3">Restart</button>
    </section>
  `;

  const restart = $id("restart-quiz");
  if (restart) restart.addEventListener("click", startQuiz);
}
