document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('questionForm');
    const questionList = document.getElementById('questionList');
    const responseSection = document.getElementById('responseSection');
    const selectedQuestionTitle = document.getElementById('selectedQuestionTitle');
    const selectedQuestion = document.getElementById('selectedQuestion');
    const responseForm = document.getElementById('responseForm');
    const responseList = document.getElementById('responseList');
    const resolveButton = document.getElementById('resolveButton');

    // Load questions from localStorage when the page loads
    let questions = loadQuestionsFromLocalStorage();
    let currentQuestionIndex = null; // To track the current question being viewed

    questions.forEach((questionObj, index) => addQuestionToList(questionObj, index));

    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const question = document.getElementById('question').value;

        const questionObj = { title, question, responses: [] };
        questions.push(questionObj);
        addQuestionToList(questionObj, questions.length - 1);
        saveQuestionsToLocalStorage(questions); // Save to localStorage
        questionForm.reset();
    });

    function addQuestionToList(questionObj, index) {
        const li = document.createElement('li');
        li.textContent = questionObj.title;
        li.addEventListener('click', () => {
            showQuestionDetail(index);
        });
        questionList.appendChild(li);
    }

    function showQuestionDetail(index) {
        currentQuestionIndex = index; // Track the current question
        const questionObj = questions[index];
        selectedQuestionTitle.textContent = questionObj.title;
        selectedQuestion.textContent = questionObj.question;
        responseSection.style.display = 'block';
        responseList.innerHTML = ''; // Clear previous responses
        questionObj.responses.forEach(res => {
            const li = document.createElement('li');
            li.textContent = `${res.name}: ${res.comment}`;
            responseList.appendChild(li);
        });
        resolveButton.style.display = 'block';
    }

    responseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const comment = document.getElementById('comment').value;

        const responseObj = { name, comment };
        questions[currentQuestionIndex].responses.push(responseObj);
        addResponseToList(responseObj);
        saveQuestionsToLocalStorage(questions); // Save to localStorage
        responseForm.reset();
    });

    function addResponseToList(responseObj) {
        const li = document.createElement('li');
        li.textContent = `${responseObj.name}: ${responseObj.comment}`;
        responseList.appendChild(li);
    }

    resolveButton.addEventListener('click', () => {
        if (currentQuestionIndex !== null) {
            // Remove the question and responses from the list
            questions.splice(currentQuestionIndex, 1);
            saveQuestionsToLocalStorage(questions); // Save the updated list
            reloadQuestionList();
            responseSection.style.display = 'none'; // Hide the details section
            currentQuestionIndex = null; // Reset current question index
        }
    });

    function reloadQuestionList() {
        questionList.innerHTML = ''; // Clear the list
        questions.forEach((questionObj, index) => addQuestionToList(questionObj, index)); // Re-add the remaining questions
    }

    function saveQuestionsToLocalStorage(questions) {
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    function loadQuestionsFromLocalStorage() {
        const storedQuestions = localStorage.getItem('questions');
        return storedQuestions ? JSON.parse(storedQuestions) : [];
    }
});
