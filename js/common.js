// get questionsAndAnswers
let questionsAndAnswers;
let questionsAndAnswersData = [];

fetch("https://coffee-doubleb.github.io/quiz/questions-and-answers-data.json")

.then(response => {
	return response.json();
})

.then(data => {
	questionsAndAnswersData = data;
})

.catch(error => {
	console.log(error);
});


// message
const message = document.querySelector(".message");
const messageContent = document.querySelector(".message__content");
const messageClose = document.querySelector(".message__close");

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
	}, 1000);
}

messageClose.addEventListener("click", () => {
	messageHide();
});

// form
const formName = document.querySelector(".form__name");
const formPhone = document.querySelector(".form__phone");
const formCheckbox = document.querySelector(".form__checkbox");

let phoneMask = IMask(formPhone, {
	mask: "(000) 000-00-00",
	lazy: false
});

formPhone.addEventListener("change", function(){
	if(isNaN(formPhone)){
		formPhone.style.color = "#000000";
	}
});

// quizStart
let quizBtnStart = document.querySelector(".quiz__btn--start");

quizBtnStart.addEventListener("click", () =>{
	quizStart();
});

const quizStart = () => {
	if (formName.value == ""){
		messageContent.innerText = "Впишите имя";
		messageShow();
	} else if(formPhone.value == ""){
		messageContent.innerText = "Напишите номер телефона";
		messageShow();
	} else if (!formCheckbox.checked == true){
		messageContent.innerText = "Согласитесь с условиями";
		messageShow();
	} else {	
		quiz();
	}
}

// quiz
const quiz = () => {
	document.querySelector(".card__preview").style.display = "none";
	document.querySelector(".card__content").style.display = "block";
	document.querySelector(".quiz__btn--start").style.display = "none";

	questionsAndAnswers = [...questionsAndAnswersData];

	createQuestion();
}

// quizBtns
const quizBtnPrev = document.querySelector(".quiz__btn--prev");
const quizBtnNext = document.querySelector(".quiz__btn--next");

quizBtnPrev.addEventListener("click", () => {
	numberQuestion--;
	createQuestion();
	chooseAnswer();
	changeProgress();
});

quizBtnNext.addEventListener("click", () => {
	chooseAnswer();

	if (isNaN(selectAnswer[numberQuestion])) {
		messageContent.innerText = "Пожалуйста, выберите вариант ответа";
		message.classList.toggle("message--show");
	} else {
		numberQuestion++;
		createQuestion();
		changeProgress();
	}
});

// progress
const progress = document.getElementById("progress");

const changeProgress = () => {
	progress.style.width = `${(numberQuestion / 5) * 100}%`;
}

const quizContent = document.querySelector(".quiz__content");
let numberQuestion = 0;
let selectAnswer = [];

// chooseAnswer
const chooseAnswer = () => {
	let answerChecked= document.querySelector("input[name='answer']:checked");
	selectAnswer[numberQuestion] = ++answerChecked.value; 
}

// createQuestion
const createQuestion = () => {
	quizContent.classList.add("quiz__content--fade-out");

	setTimeout(() => {
		quizContent.classList.remove("quiz__content--fade-out");
	}, 500);

	if(selectAnswer.length !== 0){
		document.querySelector(".quiz__item").remove();
	}

	if (numberQuestion < questionsAndAnswers.length){
		quizContent.append(createQuizItem(numberQuestion));

		if (!(isNaN(selectAnswer[numberQuestion]))){
			document.querySelector(`input[value="${selectAnswer[numberQuestion]}"]`).checked = "true";
		}

		if (numberQuestion === 1){
			quizBtnPrev.style.display = "inline-block";
		} else if (numberQuestion === 0){
			quizBtnPrev.style.display = "none";
			quizBtnNext.style.display = "inline-block";
		}

	} else {
		quizContent.classList.add("quiz__content--fade-out");

		setTimeout(() => {
			quizContent.classList.remove("quiz__content--fade-out");
		}, 500);

		quizBtnPrev.style.display = "none";
		quizBtnNext.style.display = "none";

		quizContent.append(displayResult());
	}
}

// createQuizItem
createQuizItem = (index) => {
	let quizItem = document.createElement("div");
	let quizList = document.createElement("ul");
	quizItem.className = "quiz__item";
	quizList.className = "quiz__list";

	quizContent.append(quizItem);

	quizItem.insertAdjacentElement("beforeend", quizList);

	for (let i = 0; i < questionsAndAnswers[index].answers.length; i++){
		let quizListItem = "<li class='quiz__option'><input class='quiz__input' type='radio' name='answer' value=" + i + " id=" + i + "><label class='quiz__label' for=" + i + "><span class='quiz__radio'></span><span class='answer__text'>" + questionsAndAnswers[index].answers[i] + "</span></li>";

		quizList.insertAdjacentHTML("afterbegin", `${quizListItem}`);
	}

	quizItem.insertAdjacentHTML("afterbegin", `<h1 class="quiz__title">Вопрос № ${(index + 1)}</h1><p class="quiz__question">${questionsAndAnswers[index].question}</p>`);

	return quizItem;
}

// showCoffeeMachine
const showCoffeeMachine = () => {
	document.querySelector(".coffee-machine__left").classList.add("coffee-machine__left--active");
	document.querySelector(".coffee-machine__right").classList.add("coffee-machine__right--active");
}

// displayResult
function displayResult() {
	let correctAnswers = 0;

	for (let i = 0; i < selectAnswer.length; i++){
		if (selectAnswer[i] === questionsAndAnswers[i].answerTrue) {
			correctAnswers++;
		}
	}

	let total = document.createElement("div");
	let valueFormName = document.querySelector(".form__name").value;

	total.className = "total";
	quizContent.append(total);

	const coupons = [
	{
		coupon: "DB64699",
		sale: "5% скидка"
	},
	{
		coupon: "DB52021",
		sale: "10% скидка"
	},
	{
		coupon: "DB81850",
		sale: "15% скидка"
	}
	];

	const displayCoupon = () => {
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

		total.insertAdjacentHTML("afterbegin", "<span class='total__score'>Вы набрали "+correctAnswers+" из "+questionsAndAnswers.length+"</span><span class='total__title'>"+valueFormName+", Ваш купон:</span><div class='total__coupon coupon'><span class='coupon__sale'>"+sale+"</span><b class='coupon__code'>"+coupon+"</b><svg height='12px'><defs><pattern id='coupon__dots' width='22' height='22' patternUnits='userSpaceOnUse'><circle cy='13' cx='9' r='7' fill='#FFFFFF' /></pattern></defs><rect width='100%' height='22px' fill='url(#coupon__dots)' /></svg></div>");
	}

	showCoffeeMachine();
	displayCoupon();

	return total;
}
