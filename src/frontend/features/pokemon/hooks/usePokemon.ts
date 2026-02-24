import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { Pokemon, ContestType } from '../interfaces'
import { pokemonService } from '../services'

export const POKEMON_QUERY_KEYS = {
  all: ['pokemon'] as const,
  pokemon: (nameOrId: string | number) => [...POKEMON_QUERY_KEYS.all, nameOrId] as const,
  random: () => [...POKEMON_QUERY_KEYS.all, 'random'] as const,
  contestType: (nameOrId: string | number) =>
    [...POKEMON_QUERY_KEYS.all, 'contest-type', nameOrId] as const,
  randomContestType: () => [...POKEMON_QUERY_KEYS.all, 'contest-type', 'random'] as const,
}

/**
 * Hook to fetch a Pokemon by name or ID
 * @param nameOrId - Pokemon name (e.g., "ditto") or ID (e.g., 132)
 * @param options - Additional query options
 */
export const usePokemon = (
  nameOrId: string | number,
  options?: { enabled?: boolean }
): UseQueryResult<Pokemon, Error> => {
  return useQuery({
    queryKey: POKEMON_QUERY_KEYS.pokemon(nameOrId),
    queryFn: () => pokemonService.getPokemon(nameOrId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    ...options,
  })
}

/**
 * Hook to fetch a random Pokemon
 */
export const useRandomPokemon = (): UseQueryResult<Pokemon, Error> => {
  return useQuery({
    queryKey: POKEMON_QUERY_KEYS.random(),
    queryFn: () => pokemonService.getRandomPokemon(),
    staleTime: 0, // Always fetch fresh for random
    gcTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a Contest Type by name or ID
 * @param nameOrId - Contest type name (e.g., "cool") or ID (e.g., 1)
 */
export const useContestType = (nameOrId: string | number): UseQueryResult<ContestType, Error> => {
  return useQuery({
    queryKey: POKEMON_QUERY_KEYS.contestType(nameOrId),
    queryFn: () => pokemonService.getContestType(nameOrId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook to fetch a random Contest Type
 */
export const useRandomContestType = (): UseQueryResult<ContestType, Error> => {
  return useQuery({
    queryKey: POKEMON_QUERY_KEYS.randomContestType(),
    queryFn: () => pokemonService.getRandomContestType(),
    staleTime: 0, // Always fetch fresh for random
    gcTime: 1000 * 60 * 5, // 5 minutes
  })
}
