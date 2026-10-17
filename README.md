
# DevDiscover

**Learn. Test. Discover.**

DevDiscover is a responsive web application built as part of Task 3 of the ApexPlanet Software Pvt. Ltd. Web Development Internship.

It combines an interactive web development quiz with dynamically fetched articles from the DEV Community.

## Features

### Interactive Quiz
- Five multiple-choice questions about HTML, CSS, and JavaScript.
- Instant feedback after selecting an answer.
- Score tracking and a progress indicator.
- Final score and encouraging feedback.
- Restart functionality to try the quiz again.

### Developer Articles
- Fetches public article data from the DEV Community API.
- Displays article titles, descriptions, author names, and tags when available.
- Provides links to read the original articles.
- Includes loading messages and error handling.
- Allows users to retry loading articles.

### Responsive Design
- Desktop, tablet, and mobile layouts.
- CSS media queries for different screen sizes.
- Responsive quiz options and article cards.
- Visible keyboard focus indicators and accessible status messages.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- DEV Community public API

## Project Structure

```text
apexplanet-task-3-devdiscover/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

For a more consistent local development experience, use the VS Code Live Server extension.

An internet connection is required to fetch developer articles from the public API.

## API Used

DevDiscover retrieves articles from the DEV Community API:

`https://dev.to/api/articles?per_page=6`

Article content is provided by the external service and may change over time. API availability depends on the service and your network connection.

## Learning Outcomes

This project provided practice with:

- Responsive layouts and CSS media queries.
- JavaScript functions, arrays, events, and DOM manipulation.
- Conditional logic and quiz state management.
- Asynchronous JavaScript using `async/await` and `fetch()`.
- Handling API responses, loading states, and errors.
- Accessible and responsive user interface design.

## Internship Task

**Task 3: Advanced Styling and JavaScript**

The project demonstrates the required responsive design, interactive quiz, and public API data integration.

---

Built by Akhil as part of the ApexPlanet Web Development Internship.
