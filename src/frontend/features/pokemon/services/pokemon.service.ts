import type { Pokemon, ContestType } from '../interfaces'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

export const pokemonService = {
  /**
   * Get Pokemon by name or ID
   * @param nameOrId - Pokemon name (e.g., "ditto") or ID (e.g., 132)
   */
  getPokemon: async (nameOrId: string | number): Promise<Pokemon> => {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.statusText}`)
    }

    return response.json()
  },

  /**
   * Get Contest Type by name or ID
   * @param nameOrId - Contest type name (e.g., "cool") or ID (e.g., 1)
   */
  getContestType: async (nameOrId: string | number): Promise<ContestType> => {
    const response = await fetch(`${POKEAPI_BASE_URL}/contest-type/${nameOrId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch Contest Type: ${response.statusText}`)
    }

    return response.json()
  },

  /**
   * Get multiple Pokemon by names or IDs
   */
  getMultiplePokemon: async (namesOrIds: (string | number)[]): Promise<Pokemon[]> => {
    const promises = namesOrIds.map((nameOrId) => pokemonService.getPokemon(nameOrId))
    return Promise.all(promises)
  },

  /**
   * Get random Pokemon
   * Note: PokeAPI has over 1000+ Pokemon, we'll use 1-151 (Gen 1) for simplicity
   */
  getRandomPokemon: async (): Promise<Pokemon> => {
    const randomId = Math.floor(Math.random() * 151) + 1
    return pokemonService.getPokemon(randomId)
  },

  /**
   * Get random Contest Type
   * Note: There are 5 contest types (1-5): cool, beauty, cute, smart, tough
   */
  getRandomContestType: async (): Promise<ContestType> => {
    const randomId = Math.floor(Math.random() * 5) + 1
    return pokemonService.getContestType(randomId)
  },
}
