import { questions as questionPool } from "./quiz.js";

let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

export function initializeQuiz(maxQuestions = 30) {
  const pool = Array.isArray(questionPool) ? questionPool.slice() : [];
  if (pool.length > maxQuestions) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    activeQuestions = pool.slice(0, maxQuestions);
  } else {
    activeQuestions = pool;
  }
  currentQuestionIndex = 0;
  userAnswers = [];
}

export function getCurrentQuestion() {
  return activeQuestions[currentQuestionIndex] || null;
}

export function getQuestionCount() {
  return activeQuestions.length;
}

export function getCurrentIndex() {
  return currentQuestionIndex;
}

export function answerCurrentQuestion(ansId) {
 
  userAnswers[currentQuestionIndex] = ansId;
  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex += 1;
    return { next: true };
  }
  return { done: true };
}

function findOptionForAnswer(question, ansId) {

  return question.options.find(
    (opt) =>
      (opt.ansId && opt.ansId === ansId) ||
      (opt.ansID && opt.ansID === ansId),
  );
}

export function getPersonalityType(optionObj) {
  if (!optionObj) return "Unknown";
  if (optionObj.type) return optionObj.type;
  const traits = optionObj.vals;
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

function computeOverall(scores) {
  let max = -Infinity;
  const winners = [];
  for (const trait in scores) {
    if (scores[trait] > max) max = scores[trait];
  }
  for (const trait in scores) {
    if (scores[trait] === max) winners.push(trait);
  }
  let overall = winners.length === 1 ? winners[0] : "Balanced";
  if (overall === "Unknown" && Object.keys(scores).length > 1)
    overall = "Balanced";
  return { overall, winners };
}

export function getResults() {
  const scores = {};
  const summary = [];

  for (let i = 0; i < activeQuestions.length; i++) {
    const question = activeQuestions[i];
    const selectedAnsId = userAnswers[i];
    const optionObj = findOptionForAnswer(question, selectedAnsId);
    const choice = optionObj ? optionObj.text || optionObj.answer : "(no answer)";
    const traits = optionObj && optionObj.vals;

    if (traits && typeof traits === "object") {
      for (const trait in traits) {
        const v = Number(traits[trait] || 0);
        scores[trait] = (scores[trait] || 0) + v;
      }
    } else {
      const typeLabel = optionObj && optionObj.type ? optionObj.type : "Unknown";
      scores[typeLabel] = (scores[typeLabel] || 0) + 1;
    }

    summary.push({
      questionNumber: i + 1,
      choice,
      displayLabel: getPersonalityType(optionObj),
    });
  }

  return {
    ...computeOverall(scores),
    scores,
    summary,
  };
}

