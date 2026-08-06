export function getPersonalityType(optionObj) {
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

function getMainTrait(scores) {
  let max = -Infinity;
  const winners = [];
  for (const trait in scores) {
    if (scores[trait] > max) max = scores[trait];
  }
  for (const trait in scores) {
    if (scores[trait] === max) winners.push(trait);
  }

  let overall = winners.length === 1 ? winners[0] : "Balanced";
  if (overall === "Unknown" && Object.keys(scores).length > 1) {
    overall = "Balanced";
  }
  return { overall, winners, scores };
}


export function processResultsData(questions, selectedAnswers) {
  const scores = {};
  const answers = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const selectedAnsId = selectedAnswers[i];

    let optionObj = null;
    for (let optIndex = 0; optIndex < question.options.length; optIndex++) {
      const candidate = question.options[optIndex];
      if (
        (candidate.ansId && candidate.ansId === selectedAnsId) ||
        (candidate.ansID && candidate.ansID === selectedAnsId)
      ) {
        optionObj = candidate;
        break;
      }
    }

    const choice = optionObj
      ? optionObj.text || optionObj.answer
      : "(no answer)";

    const traits = optionObj && (optionObj.vals || optionObj.traits);
    if (traits && typeof traits === "object") {
      for (const trait in traits) {
        const v = Number(traits[trait] || 0);
        scores[trait] = (scores[trait] || 0) + v;
      }
    } else {
      const typeLabel =
        optionObj && optionObj.type ? optionObj.type : "Unknown";
      scores[typeLabel] = (scores[typeLabel] || 0) + 1;
    }

    answers.push({
      question: question.text,
      choice,
      label: getPersonalityType(optionObj),
    });
  }

  const results = getMainTrait(scores);

  return {
    overall: results.overall,
    winners: results.winners,
    scores: results.scores,
    answers,
  };
}

export function getTopScores(scores, limit = 5) {
  return Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, limit)
    .map(([trait, score]) => ({
      category: trait,
      value: score,
    }));
}
