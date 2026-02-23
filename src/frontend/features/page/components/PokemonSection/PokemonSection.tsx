'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useRandomPokemon, POKEMON_QUERY_KEYS } from '@/frontend/features/pokemon/hooks'
import { PokemonCard } from '@/frontend/features/pokemon/components'
import { Button } from '@/frontend/components/ui'

export const PokemonSection = () => {
  const queryClient = useQueryClient()
  const { data: pokemon, isLoading, isError, error } = useRandomPokemon()
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Auto-refresh every 5 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: POKEMON_QUERY_KEYS.random() })
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, queryClient])

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: POKEMON_QUERY_KEYS.random() })
  }

  return (
    <div className="mt-20 w-full max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          🎮 Pokémon API Demo
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Fetching random Pokémon from PokeAPI with TanStack Query
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 p-12">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading Pokémon...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950">
            <div className="mb-2 text-4xl">😢</div>
            <p className="font-semibold text-red-900 dark:text-red-100">
              Failed to load Pokémon
            </p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error?.message || 'Unknown error'}
            </p>
            <Button onClick={handleManualRefresh} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Success State */}
        {pokemon && !isLoading && (
          <>
            <div className="w-full max-w-sm">
              <PokemonCard pokemon={pokemon} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleManualRefresh}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                disabled={autoRefresh}
              >
                🎲 Random
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'destructive' : 'default'}
                className={
                  autoRefresh
                    ? ''
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                }
              >
                {autoRefresh ? '⏸️ Stop Auto' : '▶️ Auto (5s)'}
              </Button>
              <Button
                onClick={() => window.open('https://pokeapi.co', '_blank')}
                variant="outline"
              >
                📚 API Docs
              </Button>
            </div>

            {/* Auto-refresh indicator */}
            {autoRefresh && (
              <div className="animate-pulse rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                ⚡ Auto-refreshing every 5 seconds...
              </div>
            )}

            {/* API Info */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-2 font-semibold text-slate-900 dark:text-white">
                API Endpoint:
              </div>
              <code className="text-purple-600 dark:text-purple-400">
                GET https://pokeapi.co/api/v2/pokemon/{'{'}id or name{'}'}
              </code>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Random Gen 1 Pokémon (IDs: 1-151)
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
