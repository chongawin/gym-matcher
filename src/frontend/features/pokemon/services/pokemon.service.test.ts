import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pokemonService } from './pokemon.service'
import type { Pokemon, ContestType } from '../interfaces'

// Mock data
const mockPokemon: Pokemon = {
  id: 132,
  name: 'ditto',
  base_experience: 101,
  height: 3,
  weight: 40,
  abilities: [
    {
      ability: { name: 'limber', url: 'https://pokeapi.co/api/v2/ability/7/' },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: { name: 'imposter', url: 'https://pokeapi.co/api/v2/ability/150/' },
      is_hidden: true,
      slot: 3,
    },
  ],
  types: [
    {
      slot: 1,
      type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
    },
  ],
  stats: [
    {
      base_stat: 48,
      effort: 1,
      stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' },
    },
  ],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png',
    front_female: null,
    front_shiny_female: null,
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png',
    back_female: null,
    back_shiny_female: null,
  },
}

const mockContestType: ContestType = {
  id: 1,
  name: 'cool',
  berry_flavor: {
    name: 'spicy',
    url: 'https://pokeapi.co/api/v2/berry-flavor/1/',
  },
  names: [
    {
      name: 'Cool',
      color: 'Red',
      language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
    },
    {
      name: 'Coolness',
      color: 'Red',
      language: { name: 'es', url: 'https://pokeapi.co/api/v2/language/7/' },
    },
  ],
}

describe('pokemonService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getPokemon', () => {
    it('should fetch Pokemon by ID successfully', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemon),
        } as Response),
      )

      // Act
      const result = await pokemonService.getPokemon(132)

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/132')
      expect(result).toEqual(mockPokemon)
      expect(result.id).toBe(132)
      expect(result.name).toBe('ditto')
    })

    it('should fetch Pokemon by name successfully', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemon),
        } as Response),
      )

      // Act
      const result = await pokemonService.getPokemon('ditto')

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/ditto')
      expect(result).toEqual(mockPokemon)
    })

    it('should throw error when fetch fails', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found',
        } as Response),
      )

      // Act & Assert
      await expect(pokemonService.getPokemon(9999)).rejects.toThrow(
        'Failed to fetch Pokemon: Not Found',
      )
    })

    it('should handle network errors', async () => {
      // Arrange
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      // Act & Assert
      await expect(pokemonService.getPokemon(1)).rejects.toThrow('Network error')
    })
  })

  describe('getContestType', () => {
    it('should fetch Contest Type by ID successfully', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContestType),
        } as Response),
      )

      // Act
      const result = await pokemonService.getContestType(1)

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/contest-type/1')
      expect(result).toEqual(mockContestType)
      expect(result.name).toBe('cool')
    })

    it('should fetch Contest Type by name successfully', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContestType),
        } as Response),
      )

      // Act
      const result = await pokemonService.getContestType('cool')

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/contest-type/cool')
      expect(result.name).toBe('cool')
    })

    it('should throw error when Contest Type not found', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found',
        } as Response),
      )

      // Act & Assert
      await expect(pokemonService.getContestType(999)).rejects.toThrow(
        'Failed to fetch Contest Type: Not Found',
      )
    })
  })

  describe('getMultiplePokemon', () => {
    it('should fetch multiple Pokemon successfully', async () => {
      // Arrange
      const mockPikachu = { ...mockPokemon, id: 25, name: 'pikachu' }
      const mockCharizard = { ...mockPokemon, id: 6, name: 'charizard' }

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPikachu),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharizard),
        })

      // Act
      const result = await pokemonService.getMultiplePokemon([25, 6])

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('pikachu')
      expect(result[1].name).toBe('charizard')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle empty array', async () => {
      // Act
      const result = await pokemonService.getMultiplePokemon([])

      // Assert
      expect(result).toEqual([])
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should propagate errors when one Pokemon fetch fails', async () => {
      // Arrange
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPokemon),
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        })

      // Act & Assert
      await expect(pokemonService.getMultiplePokemon([132, 9999])).rejects.toThrow(
        'Failed to fetch Pokemon: Not Found',
      )
    })
  })

  describe('getRandomPokemon', () => {
    it('should fetch a random Pokemon from Gen 1 (ID 1-151)', async () => {
      // Arrange
      const mockRandomPokemon = { ...mockPokemon, id: 41, name: 'random' }
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRandomPokemon),
        } as Response),
      )

      // Mock Math.random to return a predictable value
      // Math.floor(0.27 * 151) + 1 = Math.floor(40.77) + 1 = 40 + 1 = 41
      vi.spyOn(Math, 'random').mockReturnValue(0.27)

      // Act
      const result = await pokemonService.getRandomPokemon()

      // Assert
      expect(result).toEqual(mockRandomPokemon)
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/41')
    })

    it('should generate IDs within valid range (1-151)', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemon),
        } as Response),
      )

      // Test multiple random calls
      const randomSpy = vi.spyOn(Math, 'random')

      // Test minimum (0 -> ID 1)
      randomSpy.mockReturnValueOnce(0)
      await pokemonService.getRandomPokemon()
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1')

      // Test maximum (0.999... -> ID 151)
      randomSpy.mockReturnValueOnce(0.999)
      await pokemonService.getRandomPokemon()
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/151')
    })
  })

  describe('getRandomContestType', () => {
    it('should fetch a random Contest Type (ID 1-5)', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContestType),
        } as Response),
      )

      vi.spyOn(Math, 'random').mockReturnValue(0.4) // Should give ID 3

      // Act
      const result = await pokemonService.getRandomContestType()

      // Assert
      expect(result).toEqual(mockContestType)
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/contest-type/3')
    })

    it('should generate IDs within valid range (1-5)', async () => {
      // Arrange
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockContestType),
        } as Response),
      )

      const randomSpy = vi.spyOn(Math, 'random')

      // Test minimum (0 -> ID 1)
      randomSpy.mockReturnValueOnce(0)
      await pokemonService.getRandomContestType()
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/contest-type/1')

      // Test maximum (0.999... -> ID 5)
      randomSpy.mockReturnValueOnce(0.999)
      await pokemonService.getRandomContestType()
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/contest-type/5')
    })
  })
})
