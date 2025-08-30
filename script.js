const questions = [
  { q: "What is the capital of France?", options: ["Paris", "Rome", "Berlin", "Madrid"], answer: 0 },
  { q: "Which language runs in a web browser?", options: ["Python", "C", "JavaScript", "Java"], answer: 2 },
  { q: "What does CSS stand for?", options: ["Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style System"], answer: 1 },
  { q: "Who developed C language?", options: ["Dennis Ritchie", "James Gosling", "Guido van Rossum", "Bjarne Stroustrup"], answer: 0 }
];

let currentQ = 0, score = 0, correct = 0, wrong = 0, timer, timeLeft = 30;

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const backBtn = document.getElementById("backBtn");

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressBar = document.getElementById("progress-bar");
const timerEl = document.getElementById("time");

function startQuiz() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) { alert("Please enter your name"); return; }
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  leaderboardScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentQ = 0; score = 0; correct = 0; wrong = 0; timeLeft = 30;
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  resetState();
  let q = questions[currentQ];
  questionEl.textContent = q.q;
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optionsEl.appendChild(btn);
  });
  updateProgress();
}

function resetState() {
  nextBtn.classList.add("hidden");
  optionsEl.innerHTML = "";
}

function selectAnswer(i) {
  let q = questions[currentQ];
  const allBtns = optionsEl.querySelectorAll("button");
  allBtns.forEach(btn => btn.disabled = true);
  if (i === q.answer) {
    allBtns[i].classList.add("correct");
    score++; correct++;
  } else {
    allBtns[i].classList.add("wrong");
    allBtns[q.answer].classList.add("correct");
    wrong++;
  }
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQ++;
  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function updateProgress() {
  let progress = ((currentQ) / questions.length) * 100;
  progressBar.style.width = progress + "%";
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timerEl.textContent = timeLeft;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  document.getElementById("final-score").textContent =
    `Your Score: ${score} / ${questions.length}`;
  document.getElementById("answer-breakdown").textContent =
    `✅ Correct: ${correct} | ❌ Wrong: ${wrong}`;

  saveToLeaderboard();
}

function saveToLeaderboard() {
  const name = document.getElementById("playerName").value.trim();
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  resultScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score}`;
    list.appendChild(li);
  });
}

startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
restartBtn.onclick = startQuiz;
leaderboardBtn.onclick = showLeaderboard;
backBtn.onclick = () => {
  leaderboardScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};
