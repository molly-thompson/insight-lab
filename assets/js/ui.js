import { questions as questionPool } from "./modules/quiz.js";

// small helper to get DOM elements
function $id(id) {
  return document.getElementById(id);
}

const welcomeScreen = $id("welcome-screen");
const quizScreen = $id("quiz-screen");
const startAssessmentButton = $id("start-assessment-button");
const quizHeading = $id("quiz-heading");

let currentQuestionIndex = 0;
let userAnswers = []; // stores ansId per question index
let activeQuestions = [];

// Show the quiz and start it
function startAssessment() {
  if (!welcomeScreen || !quizScreen) return;
  welcomeScreen.hidden = true;
  quizScreen.hidden = false;
  if (quizHeading) quizHeading.focus();
  startQuiz();
}

if (startAssessmentButton) {
  startAssessmentButton.addEventListener("click", startAssessment);
}

// Choose a personality label for display: use option.type if present,
// otherwise return the trait key with the highest value (if any).
function getPersonalityType(optionObj) {
  if (!optionObj) return "Unknown";
  if (optionObj.type) return optionObj.type;
  const traits = optionObj.vals || optionObj.traits;
  if (traits && typeof traits === "object") {
    let top = null;
    let topVal = -Infinity;
    for (const trait in traits) {
      const v = Number(traits[trait] || 0);
      if (v > topVal) {
        topVal = v;
        top = trait;
      }
    }
    return top || "Unknown";
  }
  return "Unknown";
}

function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];

  // copy pool and shuffle if larger than 30
  const pool = Array.isArray(questionPool) ? questionPool.slice() : [];
  if (pool.length > 30) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    activeQuestions = pool.slice(0, 30);
  } else {
    activeQuestions = pool;
  }

  renderQuestion(currentQuestionIndex);
}

function renderQuestion(index) {
  const question = activeQuestions[index];
  const main = $id("quiz-content");
  if (!main || !question) return;

  // build option buttons
  let optionsHtml = "";
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    const ansId = option.ansId || option.ansID || `${question.id}_${i}`;
    const text = option.text || option.answer || String(option);
    optionsHtml += `<button class="quiz-option btn btn-outline-primary w-100 text-start" data-ansid="${ansId}" data-index="${i}">${text}</button>`;
  }

  main.innerHTML = `
    <section class="quiz-card">
      <h2>Question ${index + 1}</h2>
      <p>${question.text}</p>
      <div class="quiz-options d-grid gap-4">${optionsHtml}</div>
    </section>
  `;

  // attach handlers
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
  userAnswers[currentQuestionIndex] = ansId;
  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

function showResults() {
  const main = $id("quiz-content");
  if (!main) return;

  const scores = {};
  let summary = "";

  for (let i = 0; i < activeQuestions.length; i++) {
    const question = activeQuestions[i];
    const selectedAnsId = userAnswers[i];

    // find option object
    let optionObj = null;
    for (let optIndex = 0; optIndex < question.options.length; optIndex++) {
      const candidate = question.options[optIndex];
      if ((candidate.ansId && candidate.ansId === selectedAnsId) || (candidate.ansID && candidate.ansID === selectedAnsId)) {
        optionObj = candidate;
        break;
      }
    }

    const choice = optionObj ? (optionObj.text || optionObj.answer) : "(no answer)";

    // aggregate traits
    const traits = optionObj && (optionObj.vals || optionObj.traits);
    if (traits && typeof traits === "object") {
      for (const trait in traits) {
        const v = Number(traits[trait] || 0);
        scores[trait] = (scores[trait] || 0) + v;
      }
    } else {
      const typeLabel = optionObj && optionObj.type ? optionObj.type : "Unknown";
      scores[typeLabel] = (scores[typeLabel] || 0) + 1;
    }

    const displayLabel = getPersonalityType(optionObj);
    summary += `<li>Question ${i + 1}: ${choice} <strong>(${displayLabel})</strong></li>`;
  }

  const results = getResults(scores);

  // render results
  let scoresHtml = "";
  for (const trait in results.scores) {
    scoresHtml += `<li>${trait}: ${results.scores[trait]}</li>`;
  }

  main.innerHTML = `
    <section class="quiz-card">
      <h2>Results</h2>
      <p><strong>Overall:</strong> ${results.overall}</p>
      <div>
        <h3>Scores</h3>
        <ul>${scoresHtml}</ul>
      </div>
      <div>
        <h3>Answers</h3>
        <ul>${summary}</ul>
      </div>
      <button id="restart-quiz" class="btn btn-primary mt-3">Restart</button>
    </section>
  `;

  const restart = $id("restart-quiz");
  if (restart) restart.addEventListener("click", startQuiz);
}

function getResults(scores) {
  let max = -Infinity;
  const winners = [];
  for (const trait in scores) {
    if (scores[trait] > max) max = scores[trait];
  }
  for (const trait in scores) {
    if (scores[trait] === max) winners.push(trait);
  }

  let overall = winners.length === 1 ? winners[0] : "Balanced";
  if (overall === "Unknown" && Object.keys(scores).length > 1) overall = "Balanced";
  return { overall, winners, scores };
}

// end quiz code
