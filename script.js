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
const currentStreakCounterSpan = document.querySelector('[data-current-streak-counter]');
const containerDiv = document.querySelector('[data-container]');
const loaderDiv = document.querySelector('[data-loader]');
const mainDiv = document.querySelector('[data-main]');
const baseApiUrl = 'https://pokemon-api.spychest.fr/api/pokemon';
const settingsForm = document.querySelector('[data-form-settings]');
const settingsValidateButton = document.querySelector('[data-settings-submit]');


let currentStreak = 0;

let apiService = new ApiService(baseApiUrl);
let domService = new DomService();
let localStorageService = new LocalStorageService();

const userSettings = localStorageService.getSettings();
let generations = userSettings.generations;



window.addEventListener('resize', (event) => {
    correctDisplay();
})

window.addEventListener('load', async (event) => {
    let generationsCheckboxes = settingsForm.querySelectorAll('[data-checkbox-group] input[type="checkbox"]');
    generationsCheckboxes.forEach(checkbox => {
        if (generations.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    let allPokemons = await apiService.getPokemonsForGenerations(generations);
    totalPokemonSpan.innerText = allPokemons.length;

    generateEmptyCardInDom(allPokemons.length);

    let pokemons = localStorageService.getPokemonInLocalStorage();
    if (pokemons) {
        pokemons.forEach(pokemon => {
            if(!generations.includes(pokemon.generation.toString())) {
                return;
            }
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
        updateStreakCounter();
        return;
    } 
    
    pokemon = pokemon.pokemon;
    let isAlreadyInLocalStorage = localStorageService.alreadyHasThisPokemon(pokemon);

    if(!generations.includes(pokemon.generation.toString())) {
        changeMessageBox('error', `Ce pokemon n'est pas dans les générations sélectionnées !`)
        localStorageService.increaseErrorCounter();
        updateErrorCounter();
        currentStreak = 0;
        updateStreakCounter();
        return;
    }

    if (true === localStorageService.alreadyHasThisPokemon(pokemon)) {
        changeMessageBox('error', 'Vous avez déjà ce pokemon !')
        localStorageService.increaseErrorCounter();
        updateErrorCounter();
        currentStreak = 0;
        updateStreakCounter();
        return;
    } 
    
    changeMessageBox('success', 'Vous avez trouvé ' + pokemon.name);
    domService.fillCard(pokemon);
    localStorageService.addPokemonInLocalStorage(pokemon);
    updatePokemonCounter();
    currentStreak++;
    updateStreakCounter();    
    
    resetInput();
    correctDisplay();
})

settingsValidateButton.addEventListener('click', async (event) => {
        let generations = Array.from(settingsForm.querySelectorAll('[data-checkbox-group] input[type="checkbox"]:checked'));
        if(generations.length === 0) {
            changeMessageBox('error', 'Veuillez sélectionner au moins une génération !');
            return;
        }
        let generationsValue = generations.map(generation => generation.value);
        console.log(generationsValue); // Array avec les générations selectionnées
        let pokemons = await apiService.getPokemonsForGenerations(generationsValue);
        console.log(pokemons); // Array avec les pokemons des générations sélectionnées

        localStorageService.saveSettings({generations: generationsValue});
        location.reload();
    }
)

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
    currentStreakCounterSpan.innerText = currentStreak;
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