export default class DomService
{
    constructor() {}

    generateEmptyCardInDom(containerDiv, numberOfPokemons) {
    for (let i = 0; i < numberOfPokemons; i++) {
        let cardToAddToDom = document.createElement('div');
        cardToAddToDom.classList.add('flipping-card');
        cardToAddToDom.setAttribute('pokedex-id', i+1);

        let card = document.createElement('div');
        card.classList.add('card');

        let cardBackFace = document.createElement('div');
        cardBackFace.classList.add('pokemon-back');

        let cardFrontFace = document.createElement('div');
        cardFrontFace.classList.add('pokemon-card');

        card.append(cardBackFace, cardFrontFace);

        cardToAddToDom.append(card);

        containerDiv.append(cardToAddToDom);
    }
    return containerDiv;
    }

    getClassForType(type) {
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

    flipCard(target) {
        target.classList.add('show');
    }

    fillCard(pokemon) {
        // get id
        const cardToComplete = document.querySelector(`[pokedex-id="${pokemon.pokedexNumber}"]`);
        const cardFace = cardToComplete.querySelector('.pokemon-card')
        cardFace.classList.add(this.getClassForType(pokemon.types[0].name));
        cardFace.style.border = "10px solid hsl(52, 100%, 65%)"

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

        // Gestion des types
        let cardTypeDiv = document.createElement('div');
        cardTypeDiv.classList.add('w1', 'flex', 'space-evenly');
        
        let cardTypes = document.createElement('div');
        cardTypes.classList.add('types')

        cardTypeDiv.append(cardTypes);

        let cardDescription = document.createElement('p');
        cardDescription.innerText = pokemon.description;
        cardDescription.classList.add('description', this.getClassForType(pokemon.types[0].name));

        cardFace.append(headerCard, cardImg, cardTypeDiv, cardDescription);


        // let cardImage = cardToComplete.querySelector('img');
        let cardImageBG = cardFace.querySelector('#pkm-img');

        // cardImage.setAttribute('src', pokemon.imageUrl);
        // cardImage.setAttribute('alt', pokemon.name);

        for(let i = 0; i < pokemon.types.length; i++) {
            let typeSpan = document.createElement('span');
            typeSpan.classList.add('pill')
            typeSpan.innerText = pokemon.types[i].name;
            typeSpan.classList.add(this.getClassForType(pokemon.types[i].name));

            cardTypes.append(typeSpan);
        }

        const scrollOptions = { behavior: 'smooth', block: 'center' };
        cardToComplete.scrollIntoView(scrollOptions);
        setTimeout(this.flipCard, 500, cardToComplete)
    }
}