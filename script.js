
/* =========================================
   DevDiscover - Quiz + Public API
============================================ */

// QUIZ DATA
const questions = [
  {
    question: "Which HTML element is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: 1,
    explanation: "The <a> element creates hyperlinks using the href attribute."
  },
  {
    question: "Which CSS property changes the text color?",
    options: ["font-style", "background-color", "color", "text-align"],
    answer: 2,
    explanation: "The color property controls the foreground color of text."
  },
  {
    question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "static", "define"],
    answer: 1,
    explanation: "let declares a block-scoped variable whose value can be reassigned."
  },
  {
    question: "Which method selects an element by its ID?",
    options: [
      "document.querySelectorAll()",
      "document.getElementsByClassName()",
      "document.getElementById()",
      "document.createElement()"
    ],
    answer: 2,
    explanation: "document.getElementById() retrieves an element using its unique ID."
  },
  {
    question: "Which JavaScript method converts a JSON string into a JavaScript value?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.object()"
    ],
    answer: 1,
    explanation: "JSON.parse() converts valid JSON text into a JavaScript value."
  }
];

// QUIZ ELEMENTS
const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const quizFeedback = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("next-button");
const quizProgress = document.getElementById("quiz-progress");
const progressFill = document.getElementById("progress-fill");
const quizResult = document.getElementById("quiz-result");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

// API ELEMENTS
const articleStatus = document.getElementById("article-status");
const articleGrid = document.getElementById("article-grid");
const loadArticlesButton = document.getElementById("load-articles-button");

const ARTICLES_API = "https://dev.to/api/articles?per_page=6";

// QUIZ STATE
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

// FOOTER YEAR
const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// DISPLAY A QUESTION
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  hasAnswered = false;

  questionCounter.textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  scoreDisplay.textContent = `Score: ${score}`;
  questionText.textContent = currentQuestion.question;

  answerOptions.replaceChildren();

  quizFeedback.textContent = "";
  quizFeedback.className = "";

  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestionIndex === questions.length - 1
      ? "View Results"
      : "Next Question";

  quizProgress.setAttribute("aria-valuemax", questions.length);
  quizProgress.setAttribute("aria-valuenow", currentQuestionIndex);

  progressFill.style.width =
    `${(currentQuestionIndex / questions.length) * 100}%`;

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.textContent = option;

    button.addEventListener("click", () => selectAnswer(index));

    answerOptions.appendChild(button);
  });
}

// CHECK THE SELECTED ANSWER
function selectAnswer(selectedIndex) {
  if (hasAnswered) {
    return;
  }

  hasAnswered = true;

  const currentQuestion = questions[currentQuestionIndex];
  const answerButtons = answerOptions.querySelectorAll("button");
  const isCorrect = selectedIndex === currentQuestion.answer;

  if (isCorrect) {
    score++;

    quizFeedback.textContent =
      `Correct! ${currentQuestion.explanation}`;

    quizFeedback.className = "success";
  } else {
    quizFeedback.textContent =
      `Not quite. ${currentQuestion.explanation}`;

    quizFeedback.className = "error";
  }

  answerButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === currentQuestion.answer) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  scoreDisplay.textContent = `Score: ${score}`;

  quizProgress.setAttribute(
    "aria-valuenow",
    currentQuestionIndex + 1
  );

  progressFill.style.width =
    `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  nextButton.disabled = false;
}

// NEXT QUESTION
function nextQuestion() {
  if (!hasAnswered) {
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
  }
}

// FINAL RESULTS
function showResults() {
  questionCounter.textContent = "Quiz completed!";
  scoreDisplay.textContent = `Score: ${score}`;

  questionText.hidden = true;
  answerOptions.hidden = true;
  quizFeedback.hidden = true;
  nextButton.hidden = true;

  quizProgress.setAttribute("aria-valuenow", questions.length);
  progressFill.style.width = "100%";

  finalScore.textContent =
    `You scored ${score} out of ${questions.length}. ` +
    getResultMessage();

  quizResult.hidden = false;
}

function getResultMessage() {
  if (score === questions.length) {
    return "Perfect score! Excellent work!";
  }

  if (score >= 3) {
    return "Good job! Keep strengthening your skills.";
  }

  return "Keep practising. Every question is a learning opportunity!";
}

// RESTART QUIZ
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  questionText.hidden = false;
  answerOptions.hidden = false;
  quizFeedback.hidden = false;
  nextButton.hidden = false;
  quizResult.hidden = true;

  displayQuestion();
}

// =========================================
// PUBLIC API: FETCH DEVELOPER ARTICLES
// =========================================

async function loadArticles() {
  if (!articleStatus || !articleGrid || !loadArticlesButton) {
    console.error("Article section elements are missing from index.html.");
    return;
  }

  // Show loading state
  loadArticlesButton.disabled = true;
  articleStatus.textContent = "Loading developer articles...";
  articleGrid.replaceChildren();

  try {
    const response = await fetch(ARTICLES_API);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const articles = await response.json();

    if (!Array.isArray(articles) || articles.length === 0) {
      articleStatus.textContent = "No articles were found. Please try again.";
      return;
    }

    const fragment = document.createDocumentFragment();
    let displayedCount = 0;

    articles.forEach((article) => {
      // Ignore records without a usable title or URL.
      if (
        typeof article.title !== "string" ||
        typeof article.url !== "string"
      ) {
        return;
      }

      // Accept only HTTPS article links.
      let articleURL;

      try {
        articleURL = new URL(article.url);
      } catch {
        return;
      }

      if (articleURL.protocol !== "https:") {
        return;
      }

      const card = document.createElement("article");
      card.className = "article-card";

      const tags = document.createElement("p");
      tags.className = "article-tags";

      const tagNames = Array.isArray(article.tag_list)
        ? article.tag_list.slice(0, 3)
        : [];

      tags.textContent = tagNames.length
        ? tagNames.map((tag) => `#${tag}`).join(" ")
        : "Developer article";

      const title = document.createElement("h3");
      title.textContent = article.title;

      const description = document.createElement("p");
      description.textContent =
        article.description || "Read this article to explore more.";

      const author = document.createElement("p");
      author.textContent = article.user?.name
        ? `By ${article.user.name}`
        : "By DEV Community author";

      const link = document.createElement("a");
      link.href = articleURL.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Read article ↗";
      link.setAttribute("aria-label", `Read article: ${article.title}`);

      card.append(tags, title, description, author, link);
      fragment.appendChild(card);

      displayedCount++;
    });

    if (displayedCount === 0) {
      articleStatus.textContent =
        "No usable articles were returned. Please try again.";
      return;
    }

    articleGrid.appendChild(fragment);

    articleStatus.textContent =
      `Showing ${displayedCount} developer articles from DEV Community.`;
  } catch (error) {
    console.error("Unable to load developer articles:", error);

    articleStatus.textContent =
      "Unable to load articles right now. Check your internet connection and try again.";
  } finally {
    loadArticlesButton.disabled = false;
  }
}

// EVENT LISTENERS
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);
loadArticlesButton.addEventListener("click", loadArticles);

// START THE QUIZ
displayQuestion();
