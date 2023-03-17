// TP: #1 - faire une fonction qui prend en paramètre un tableau d'objets décrivant les pokemons. #2 - dans cette fonction faire une boucle qui va créer N [div.pokemon-card] . #3 - la fonction doit retourner HTMLCollection[div.pokemon-card]. #bonus - greffer des événement de de click sur les boutons présent dans [div.pokemmon-card], et au click logger l'action. #notions - scope, boucle, fonction, dom #contrainte - la fonction ne peux rien ajouter dans le dom (event, html) d'elle même.

// Terminer mise en forme générale de la carte
// -> Chercher les couleurs de tous les types de pokemon (lié au 1st type)
// Styliser le site en général
//  -> importer la police pokemon
// choisir les couleurs ()
// Le TP de de vosu cfr above
// https://codepen.io/simeydotme/pen/abYWJdX comprendre comment ça fonctionne, ne fut-ce que pour les effects sur la carte

// form / header
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
const baseApiUrl = 'https://pokemon-api.spychest.fr/api/pokemon/getPokemonByName/'
const baseApiUrlToGetAllPokemons = 'https://pokemon-api.spychest.fr/api/pokemon/getAll'
let currentStreak = 0;

window.addEventListener('resize', (event) => {
    correctDisplay();
})

window.addEventListener('load', async (event) => {
    let allPokemons = await getAllPokemon();
    totalPokemonSpan.innerText = allPokemons.length;
    generateEmptyCardInDom(allPokemons.length);

    let pokemons = getPokemonInLocalStorage();
    if (pokemons) {
        pokemons.forEach(pokemon => {
            fillCard(pokemon);
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
    let pokemon = await getPokemonByName(pokemonName);
    if (!pokemon) {
        changeMessageBox('error', `Ce pokemon n'existe pas !`)
        increaseErrorCounter();
        updateErrorCounter();
        currentStreak = 0;
    } else {
        console.log(alreadyHasThisPokemon(pokemon));
        if (true === alreadyHasThisPokemon(pokemon)) {
            changeMessageBox('error', 'Vous avez déjà ce pokemon !')
            increaseErrorCounter();
            updateErrorCounter();
            currentStreak = 0;

        } else {
            changeMessageBox('success', 'Vous avez trouvé ' + pokemon.name);
            fillCard(pokemon)
            addPokemonInLocalStorage(pokemon);
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
    for (let i = 1; i < numberOfPokemons; i++) {
        let cardToAddToDom = document.createElement('div');
        cardToAddToDom.classList.add('pokemon-card', 'pokemon-back');
        cardToAddToDom.setAttribute('pokedex-id', i);
        containerDiv.append(cardToAddToDom);
    }
}

const updatePokemonCounter = () => {
    let pokemons = getPokemonInLocalStorage();
    pokemonCounterSpan.innerText = pokemons ? pokemons.length : 0;
}

const updateErrorCounter = () => {
    let errorCount = getErrorCount()
    errorCounterSpan.innerText = errorCount ? errorCount : 0;
}

const updateStreakCounter = () => {
    let bestStreak = getStreak();
    if (currentStreak > bestStreak) {
        updateStreak(currentStreak);
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

const getPokemonByName = async (pokemonName) => {
    const url = baseApiUrl + pokemonName;
    let pokemon = await fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
    return pokemon;
}

const getAllPokemon = async () => {
    let pokemons = await fetch(baseApiUrlToGetAllPokemons).then((response) => {
        if (!response.ok) {
            throw new Error(response.error)
        }
        return response.json();
    })
    return pokemons;
}

const fillCard = (pokemon) => {
    // get id
    const cardToComplete = document.querySelector(`[pokedex-id="${pokemon.pokedexNumber}"]`);

    cardToComplete.classList.add(getClassForType(pokemon.firstType))
    cardToComplete.classList.remove('pokemon-back')
    cardToComplete.style.border = "10px solid hsl(52, 100%, 65%)"

    let headerCard = document.createElement('div');
    headerCard.classList.add('header-card')
    let cardTitle = document.createElement('h2');
    cardTitle.classList.add('text-center')
    cardTitle.innerText = pokemon.name;
    let pokemonNumber = document.createElement('p');
    pokemonNumber.innerText = pokemon.pokedexNumber;

    headerCard.append(cardTitle, pokemonNumber);

    let cardImg = document.createElement('div');
    cardImg.classList.add('img-card');
    cardImg.style.backgroundImage = `url('${pokemon.imageUrl}')`

    let cardTypeDiv = document.createElement('div');
    cardTypeDiv.classList.add('w1', 'flex', 'space-evenly');
    let cardTypes = document.createElement('div');
    cardTypes.classList.add('types')

    cardTypeDiv.append(cardTypes);

    let cardDescription = document.createElement('p');
    cardDescription.innerText = pokemon.description;
    cardDescription.classList.add('description', getClassForType(pokemon.firstType))
    // cardDescription.classList.add(getClassForType(pokemon.firstType))

    cardToComplete.append(headerCard, cardImg, cardTypeDiv, cardDescription);


    // let cardImage = cardToComplete.querySelector('img');
    let cardImageBG = cardToComplete.querySelector('#pkm-img');
    console.log(cardImageBG)
    console.log(pokemon.imageUrl)

    // cardImage.setAttribute('src', pokemon.imageUrl);
    // cardImage.setAttribute('alt', pokemon.name);


    let firstTypeSpan = document.createElement('span');
    firstTypeSpan.classList.add('pill')
    firstTypeSpan.innerText = pokemon.firstType;
    firstTypeSpan.classList.add(getClassForType(pokemon.firstType));

    cardTypes.append(firstTypeSpan);

    if (pokemon.secondType) {
        let secondTypeSpan = document.createElement('span');
        secondTypeSpan.classList.add('pill')
        secondTypeSpan.innerText = pokemon.secondType;
        secondTypeSpan.classList.add(getClassForType(pokemon.secondType));

        cardTypes.append(secondTypeSpan);
    }
}

const getClassForType = (type) => {
    switch (type) {
        case 'Plante':
            return 'plant';
        case 'Poison':
            return 'poison';
        case 'Feu':
            return 'fire';
        case 'Eau':
            return 'water';
        case 'Insecte':
            return 'bug';
        case 'Normal':
            return 'normal';
        case 'Electrique':
            return 'electric'
        case 'Sol':
            return 'sol';
        case 'Combat':
            return 'fight'
        case 'Psy':
            return 'psy';
        case 'Roche':
            return 'stone';
        case 'Spectre':
            return 'ghost';
        case 'Glace':
            return 'ice';
        case 'Dragon':
            return 'dragon';
        case 'Fée':
            return 'fairy';
        case 'Ténèbres':
            return 'dark';
        case 'Acier':
            return 'steel';
        case 'Vol':
            return 'fly';
        default:
            return null;
    }
}

const increaseErrorCounter = () => {
    let currentErrorCount = getErrorCount();
    localStorage.setItem('errorCounter', JSON.stringify(currentErrorCount + 1));
}

const getErrorCount = () => {
    return JSON.parse(localStorage.getItem('errorCounter'));
}

const getStreak = () => {
    return JSON.parse(localStorage.getItem('bestStreak'));
}

const updateStreak = (currentStreak) => {
    localStorage.setItem('bestStreak', JSON.stringify(currentStreak));
}

const addPokemonInLocalStorage = (pokemon) => {
    let pokemonsInLocalStorage = getPokemonInLocalStorage();

    if (!pokemonsInLocalStorage) {
        pokemonsInLocalStorage = [];
    }

    pokemonsInLocalStorage.push(pokemon);
    localStorage.setItem('pokemons', JSON.stringify(pokemonsInLocalStorage));
}

const getPokemonInLocalStorage = () => {
    return JSON.parse(localStorage.getItem('pokemons'));
}

const alreadyHasThisPokemon = (pokemon) => {
    let returnValue;
    let pokemonInLocalStorage = getPokemonInLocalStorage();

    if (!pokemonInLocalStorage) {
        return false;
    }

    returnValue = false;

    pokemonInLocalStorage.forEach(element => {
        if (element.id === pokemon.id) {
            returnValue = true;
        }
    })

    return returnValue;
}