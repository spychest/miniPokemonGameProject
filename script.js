import ApiService from "./js/services/ApiService.js";
import DomService from "./js/services/DomService.js";
import LocalStorageService from "./js/services/LocalStorageService.js";
// https://codepen.io/simeydotme/pen/abYWJdX comprendre comment ça fonctionne, ne fut-ce que pour les effects sur la carte

const pokemonForm = document.querySelector('[data-pokemon-form]');
const pokemonInput = document.querySelector('[data-pokemon-input]');
const resetButton = document.querySelector('[data-reset]');
const pokemonCounterSpan = document.querySelector('[data-current-pokemon]');
const totalPokemonSpan = document.querySelector('[data-total-pokemon]');
const errorCounterSpan = document.querySelector('[data-error-counter]');
const streakCounterSpan = document.querySelector('[data-streak-counter]');
const containerDiv = document.querySelector('[data-container]');
const loaderDiv = document.querySelector('[data-loader]');
const mainDiv = document.querySelector('[data-main]');
const baseApiUrl = 'https://pokemon-api.spychest.fr/api/pokemon';

let generation = 1;

let currentStreak = 0;

let apiService = new ApiService(baseApiUrl);
let domService = new DomService();
let localStorageService = new LocalStorageService();

window.addEventListener('resize', (event) => {
    correctDisplay();
})

window.addEventListener('load', async (event) => {
    let allPokemons = await apiService.getPokemonsByGaneration(generation);
    allPokemons = allPokemons.pokemon;
    totalPokemonSpan.innerText = allPokemons.length;

    generateEmptyCardInDom(allPokemons.length);

    let pokemons = localStorageService.getPokemonInLocalStorage();
    if (pokemons) {
        pokemons.forEach(pokemon => {
            console.log(pokemon);
            domService.fillCard(pokemon);
        })
    }
    pokemonCounterSpan.innerText = pokemons ? pokemons.length : 0;
    updateErrorCounter();
    updateStreakCounter();
    loaderDiv.classList.add('hidden');
    mainDiv.classList.remove('hidden');
    correctDisplay();
})

resetButton.addEventListener('click', (event) => {
    localStorage.clear();
    location.reload();
})

pokemonForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(pokemonForm);
    const pokemonName = formData.get('pokemonName');
    let pokemon = await apiService.getPokemonByName(pokemonName);
    if (!pokemon) {
        changeMessageBox('error', `Ce pokemon n'existe pas !`)
        localStorageService.increaseErrorCounter();
        updateErrorCounter();
        currentStreak = 0;
    } else {
        pokemon = pokemon.pokemon;
        let isAlreadyInLocalStorage = localStorageService.alreadyHasThisPokemon(pokemon);
        console.log(isAlreadyInLocalStorage);
        if (true === localStorageService.alreadyHasThisPokemon(pokemon)) {
            changeMessageBox('error', 'Vous avez déjà ce pokemon !')
            localStorageService.increaseErrorCounter();
            updateErrorCounter();
            currentStreak = 0;
        } else {
            changeMessageBox('success', 'Vous avez trouvé ' + pokemon.name);
            domService.fillCard(pokemon);
            localStorageService.addPokemonInLocalStorage(pokemon);
            updatePokemonCounter();
            currentStreak++;
            updateStreakCounter();
        }
    }
    resetInput();
    correctDisplay();
})

const correctDisplay = () => {
    let topDiv = document.querySelector('[data-top]');
    let height = topDiv.offsetHeight;
}

const generateEmptyCardInDom = (numberOfPokemons) => {
    return domService.generateEmptyCardInDom(containerDiv, numberOfPokemons);
}

const updatePokemonCounter = () => {
    let pokemons = localStorageService.getPokemonInLocalStorage();
    pokemonCounterSpan.innerText = pokemons ? pokemons.length : 0;
}

const updateErrorCounter = () => {
    let errorCount = localStorageService.getErrorCount();
    errorCounterSpan.innerText = errorCount ? errorCount : 0;
}

const updateStreakCounter = () => {
    let bestStreak = localStorageService.getStreak();
    if (currentStreak > bestStreak) {
        localStorageService.updateStreak(currentStreak);
        streakCounterSpan.innerText = currentStreak;
    } else {
        streakCounterSpan.innerText = bestStreak ? bestStreak : 0;
    }
}

const changeMessageBox = (type, message) => {
    let messageDiv = document.querySelector('[data-message-box]')
    messageDiv.classList.forEach((element) => {
        messageDiv.classList.remove(element);
    })
    messageDiv.classList.add(`${type}-message`);
    messageDiv.innerText = message;
}

const resetInput = () => {
    pokemonInput.value = '';
    pokemonInput.focus();
}