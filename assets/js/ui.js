// UI related JS

// Start button

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const startAssessmentButton = document.getElementById(
  "start-assessment-button",
);
const quizHeading = document.getElementById("quiz-heading");

function startAssessment() {
  if (!welcomeScreen || !quizScreen) {
    console.error("Welcome screen or quiz screen could not be found.");
    return;
  }

  welcomeScreen.hidden = true;
  quizScreen.hidden = false;

  if (quizHeading) {
    quizHeading.focus();
  }
}

if (startAssessmentButton) {
  startAssessmentButton.addEventListener("click", startAssessment);
}
