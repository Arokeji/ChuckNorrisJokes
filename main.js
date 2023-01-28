window.onload = () => {
    initDOM();
    //localStorage.clear();
}

let categoriesSelected = [];
let buttonState = []; //A local storage
let allCategories = [];
let urlCategories = "https://api.chucknorris.io/jokes/categories";
let urlJokeRandom = "https://api.chucknorris.io/jokes/random";
let urlJokeComposition;

const initDOM = () => {
    let resetButton = document.querySelector('.jokes__reset');
    let newJokeButton = document.querySelector('.jokes__submit');

    submitNewJoke ();
    
    resetButton.addEventListener('click', function () {
        resetCategories();
    })
    
    newJokeButton.addEventListener('click', function () {
        submitNewJoke();
    })
    
    fetch(urlCategories)
        .then(answer => answer.json())
        .then(answer => {
            allCategories = answer;
            for(let category in answer){
                if(localStorage.getItem(answer[category]) == 1) {
                    buttonState[category] = 1;
                    localStorage.setItem(answer[category], 1);
                    selectCategory(answer[category]);
                } else {
                    buttonState[category] = 0;
                    localStorage.setItem(answer[category], 0);
                }
            };
            renderButtons(allCategories);
        })
        .catch(error => console.log(error));

}

function renderButtons(categories) {
    
    //'<button class="jokes__button">' + categories[category] + '</button>';
    //let buttonCreated  = document.getElementsByClassName('jokes__button');
    let buttonsContainer = document.querySelector(".jokes__categories");
    buttonsContainer.innerHTML = '';

    for(let category in categories){
        let createButton = document.createElement('button');
        if (buttonState[category] === 1) {
            createButton.setAttribute('class', 'jokes__button-pressed');
        } else if(buttonState[category] === 0){
            createButton.setAttribute('class', 'jokes__button');
        }

        createButton.innerText = categories[category];
        createButton.addEventListener('click', function() {
            if(buttonState[category] == 0){
                buttonState[category] = 1;
                localStorage.setItem(categories[category], 1);
            } else if (buttonState[category] == 1) {
                buttonState[category] = 0;
                localStorage.setItem(categories[category], 0);
            }
            selectCategory(categories[category]);
        });

        buttonsContainer.appendChild(createButton); 
        //buttonsContainer.innerHTML += createButton;
    }
}

function selectCategory(category) {
    categoriesSelected.push(category);
    renderButtons(allCategories);
}

function resetCategories () {
    localStorage.clear();
    categoriesSelected = [];
    for(let category in allCategories){
        buttonState[category] = 0;
    };
    urlJokeComposition = urlJokeRandom;
    renderButtons(allCategories);
}

function submitNewJoke () {

    urlJokeComposition = urlJokeRandom;
    let jokeResult = document.querySelector('.jokes__result');

    if(categoriesSelected.length > 0) {
        urlJokeComposition += "?category=";
        urlJokeComposition += categoriesSelected.join(',');
    }

    fetch(urlJokeComposition)
        .then(answer => answer.json())
        .then(answer => {
            jokeResult.innerText = `"${answer.value}"`;
        })
        .catch(error => console.log(error));
}