export default class ApiService 
{
    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
    }
    
    async getPokemonsByGaneration(generation){
        let pokemons = await fetch(`${this.baseUrl}/generation/${generation}`).then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        return pokemons;
    }

    async getPokemonByName(name){
        let pokemon = await fetch(`${this.baseUrl}/${name}`).then((response) => {        
            if (!response.ok) {
                if(response.status === 404) {
                    return null;
                }
                throw new Error(response.error)
            }
            return response.json();
        })
    return pokemon;
    }
}