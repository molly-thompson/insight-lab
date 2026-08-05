// UI related JS

// Start button







// quiz


function startQuiz() {
  const main = document.getElementById('quiz-content');

  main.innerHTML = `
    <section class="quiz-card">
      <h2>Question 1</h2>
      <p>Choose an answer, how would you respond?</p>
      <button>Option A</button>
      <button>Option B</button>
    </section>
  `;
}document.addEventListener('DOMContentLoaded', renderIntro);