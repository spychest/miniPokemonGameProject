export default class LocalStorageService
{
    constructor() {}

    getPokemonInLocalStorage() {
        return JSON.parse(localStorage.getItem('pokemons'));
    }

    addPokemonInLocalStorage(pokemon) {
        let pokemonsInLocalStorage = this.getPokemonInLocalStorage();

        if (!pokemonsInLocalStorage) {
            pokemonsInLocalStorage = [];
        }

        pokemonsInLocalStorage.push(pokemon);
        localStorage.setItem('pokemons', JSON.stringify(pokemonsInLocalStorage));
    }

    alreadyHasThisPokemon(pokemon) {
        let returnValue;
        let pokemonInLocalStorage = this.getPokemonInLocalStorage();

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

    increaseErrorCounter() {
        let currentErrorCount = this.getErrorCount();
        localStorage.setItem('errorCounter', JSON.stringify(currentErrorCount + 1));
    }

    getErrorCount() {
        return JSON.parse(localStorage.getItem('errorCounter'));
    }

    getStreak() {
        return JSON.parse(localStorage.getItem('bestStreak'));
    }

    updateStreak(currentStreak) {
        localStorage.setItem('bestStreak', JSON.stringify(currentStreak));
    }

    getSettings() {
        return JSON.parse(localStorage.getItem('settings'));
    }

    saveSettings(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    getUserScore() {
        return JSON.parse(localStorage.getItem('userScore'));
    }

    saveUserScore(score) {
        localStorage.setItem('userScore', JSON.stringify(score));
    }
}