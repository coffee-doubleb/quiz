// get questionsAndAnswers
let questionsAndAnswers;
let questionsAndAnswersData = [];

fetch("https://doubleb-coffee.github.io/quiz/questions-and-answers.json")

.then(response => {
	return response.json();
})

.then(data => {
	questionsAndAnswersData = data;
})

.catch(error => {
	console.log(error);
});

// get coupons
let coupons;
let couponsData = [];

fetch("https://doubleb-coffee.github.io/quiz/coupons.json")

.then(response => {
	return response.json();
})

.then(data => {
	couponsData = data;
})

.catch(error => {
	console.log(error);
});

// message
const message = document.querySelector(".message");
const messageContent = document.querySelector(".message__content");
const messageClose = document.querySelector(".message--close");

const messageShow = () => {
	message.classList.add("message--show");

	setTimeout(() => {
		message.classList.remove("message--show");
	}, 4000);
}

const messageHide = () => {
	message.classList.add("message--hide");

	setTimeout(() => {
		message.classList.remove("message--show");
		message.classList.remove("message--hide");
	}, 500);
}

messageClose.addEventListener("click", () => {
	messageHide();
});

// form
const formName = document.querySelector(".form__name");
const formEmail = document.querySelector(".form__email");
const formPhone = document.querySelector(".form__phone");
const formCheckbox = document.querySelector(".form__checkbox");

let phoneMask = IMask(formPhone, {
	mask: "(000) 000-00-00",
	lazy: false
});

// quizStart
let quizBtnStart = document.querySelector(".quiz__btn--start");

quizBtnStart.addEventListener("click", () =>{
	quizStart();
});

// else if (localStorage.quiz == "passed"){
// 	messageContent.innerText = "Вы уже получили свой купон";
// }

const quizStart = () => {
	if (formName.value == ""){
		messageContent.innerText = "Впишите имя";
		messageShow();
	} else if (formEmail.value == ""){
		messageContent.innerText = "Введите E-mail";
		messageShow();
	} else if (phoneMask._unmaskedValue == ""){
		messageContent.innerText = "Впишите номер телефона";
		messageShow();
	} else if (formCheckbox.checked == false){
		messageContent.innerText = "Согласитесь с конфиденциальностью и правилами";
		messageShow();
	} else {	
		quiz();
	}
}

// quiz
const quizContent = document.querySelector(".quiz__content");
let numberQuestion = 0;

const quiz = () => {
	document.querySelector(".card__preview").style.display = "none";
	document.querySelector(".card__content").style.display = "block";
	document.querySelector(".quiz__btn--start").style.display = "none";

	questionsAndAnswers = [...questionsAndAnswersData];

	createItem();
}

// quizBtns
const quizBtnPrev = document.querySelector(".quiz__btn--prev");
const quizBtnNext = document.querySelector(".quiz__btn--next");

quizBtnPrev.addEventListener("click", () => {
	numberQuestion--;
	createItem();
	chooseAnswer();
	changeProgress();
});

quizBtnNext.addEventListener("click", () => {
	chooseAnswer();

	if (selectAnswer[numberQuestion] == undefined) {
		messageContent.innerText = "Пожалуйста, выберите вариант ответа";
		messageShow();
	} else {
		numberQuestion++;

		if (numberQuestion > 0){
			createItem();
		}

		changeProgress();
	}
});

// progress
const progress = document.getElementById("progress");

const changeProgress = () => {
	progress.style.width = `${(numberQuestion / 5) * 100}%`;
}

// chooseAnswer
let selectAnswer = [];

const chooseAnswer = () => {
	let answerChecked = document.querySelector("input[name='answer']:checked");

	if(answerChecked !== null){
		selectAnswer[numberQuestion] = +answerChecked.value; 
	}
}

// createItem

const quizItem = document.querySelector(".quiz__item");
const quizList = document.querySelector(".quiz__list");

const createItem = (index) => {
	// quiz__content--fade-in
	quizContent.classList.add("quiz__content--fade-in");

	setTimeout(() => {
		quizContent.classList.remove("quiz__content--fade-in");
	}, 500);

	// remove title and question
	const quizTitle = document.querySelector(".quiz__title");
	const quizQuestion = document.querySelector(".quiz__question");

	if (quizTitle !== null && quizQuestion !== null){
		quizTitle.remove();
		quizQuestion.remove();
	}

	// remove answers
	let childQuizList = quizList.lastElementChild; 

	while (childQuizList) { 
		quizList.removeChild(childQuizList); 
		childQuizList = quizList.lastElementChild; 
	} 

	if(questionsAndAnswers[numberQuestion] !== undefined){
		// add title and question
		quizItem.insertAdjacentHTML("afterbegin", `<h2 class="quiz__title">Вопрос № ${(numberQuestion + 1)}</h2><p class="quiz__question">${questionsAndAnswers[numberQuestion].question}</p>`);

		// add answers
		for (let i = 0; i < questionsAndAnswers[numberQuestion].answers.length; i++){
			let quizListItem = "<li class='quiz__option'><input class='quiz__input' type='radio' name='answer' value=" + i + " id=" + i + "><label class='quiz__label' for=" + i + "><span class='quiz__radio'></span><span>" + questionsAndAnswers[numberQuestion].answers[i] + "</span></label></li>";

			quizList.insertAdjacentHTML("beforeend", `${quizListItem}`);
		}
	}
	
	// choice of answer in the prev question
	if (!(isNaN(selectAnswer[numberQuestion]))){
		document.querySelector(`input[value="${selectAnswer[numberQuestion]}"]`).checked = "true";
	}

	if (numberQuestion === 0){
		quizBtnPrev.style.display = "none";
		quizBtnNext.style.display = "inline-block";
	} else if (numberQuestion > 0 && numberQuestion !== 5){
		quizBtnPrev.style.display = "inline-block";
	} else if (numberQuestion == 5){
		quizContent.classList.add("quiz__content--fade-in");

		setTimeout(() => {
			quizContent.classList.remove("quiz__content--fade-in");
		}, 500);

		displayResult();

		quizBtnPrev.style.display = "none";
		quizBtnNext.style.display = "none";
	}
}

// displayResult
const displayResult = () => {
	// show social
	document.querySelector(".social").classList.remove("social--hide");

	// count true answer
	let correctAnswers = 0;

	for (let i = 0; i < selectAnswer.length; i++){
		if (selectAnswer[i] === questionsAndAnswers[i].answerTrue) {
			correctAnswers++;
		}
	}

	// selection coupon
	coupons = [...couponsData];

	if (correctAnswers == 2){
		coupon = coupons[0].coupon;
		sale = coupons[0].sale;
	} else if (correctAnswers == 3){
		coupon = coupons[1].coupon;
		sale = coupons[1].sale;
	} else if (correctAnswers == 4 || correctAnswers == 5){
		coupon = coupons[2].coupon;
		sale = coupons[2].sale;
	} else {
		coupon = "Пусто";
		sale = "Нет скидки, т.к. вы не набрали минимальное (3) количество правильных ответов";
	}

	// add result
	let valueFormName = document.querySelector(".form__name").value;

	quizContent.insertAdjacentHTML("afterbegin", "<div class='total'><span class='total__score'>Вы набрали " + correctAnswers + " из 5</span><span class='total__title'>" + valueFormName + ", Ваш купон:</span><div class='total__coupon coupon'><span class='coupon__sale'>" + sale + "</span><b class='coupon__code'>" + coupon + "</b><svg class='coupon__pattern' width='100%' height='12'><defs><pattern id='coupon__dots' width='22' height='22' patternUnits='userSpaceOnUse'><circle cy='13' cx='9' r='7' fill='#FFFFFF' /></pattern></defs><rect width='100%' height='22px' fill='url(#coupon__dots)'/></svg></div></div>");

	// show icon
	document.querySelector(".icon__cup").classList.add("icon__cup--left");
	document.querySelector(".icon__coffee-machine").classList.add("icon__coffee-machine--right");

	localStorage.setItem("quiz", "passed");
}