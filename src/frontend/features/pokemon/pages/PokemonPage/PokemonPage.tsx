'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useRandomPokemon, usePokemon, POKEMON_QUERY_KEYS } from '@/frontend/features/pokemon/hooks'
import { PokemonCard } from '@/frontend/features/pokemon/components'
import { BaseSearchInput, Button } from '@/frontend/components'

const PokemonPage = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  
  // Use search query if available, otherwise use random Pokemon
  const { data: searchedPokemon, isLoading: isSearching, isError: isSearchError, error: searchError } = usePokemon(
    searchQuery || 'ditto',
    { enabled: !!searchQuery }
  )
  const { data: randomPokemon, isLoading: isLoadingRandom, isError: isRandomError, error: randomError } = useRandomPokemon()
  
  // Use searched Pokemon if search query exists, otherwise show random
  const pokemon = searchQuery ? searchedPokemon : randomPokemon
  const isLoading = searchQuery ? isSearching : isLoadingRandom
  const isError = searchQuery ? isSearchError : isRandomError
  const error = searchQuery ? searchError : randomError

  // Auto-refresh every 5 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: POKEMON_QUERY_KEYS.random() })
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, queryClient])

  const handleManualRefresh = () => {
    setSearchQuery(null) // Clear search when clicking random
    queryClient.invalidateQueries({ queryKey: POKEMON_QUERY_KEYS.random() })
  }
  
  const handleSearch = (query: string) => {
    setAutoRefresh(false) // Stop auto-refresh when searching
    setSearchQuery(query)
  }
  
  const handleClearSearch = () => {
    setSearchQuery(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div className="container mx-auto px-4 py-32">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
            </span>
            Live from PokeAPI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pokémon
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">API Explorer</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover random Pokémon from Generation 1 with real-time data fetching using TanStack Query
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Search Pokémon
              </h2>
            </div>
            <BaseSearchInput
              placeholder="Enter Pokémon name or ID (e.g., pikachu, 25)"
              onSearch={handleSearch}
              isLoading={isSearching}
            />
            {searchQuery && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Searching for: <strong className="text-purple-600 dark:text-purple-400">{searchQuery}</strong>
                </span>
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 p-12">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-lg text-slate-600 dark:text-slate-400">Catching Pokémon...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
              <div className="mb-4 text-6xl">😢</div>
              <h3 className="mb-2 text-xl font-bold text-red-900 dark:text-red-100">
                Failed to load Pokémon
              </h3>
              <p className="mb-6 text-sm text-red-700 dark:text-red-300">
                {error?.message || 'Unknown error occurred'}
              </p>
              <Button onClick={handleManualRefresh} variant="outline" size="lg">
                <span className="mr-2">🔄</span>
                Try Again
              </Button>
            </div>
          )}

          {/* Success State */}
          {pokemon && !isLoading && (
            <>
              {/* Pokemon Card */}
              <div className="w-full max-w-md">
                <PokemonCard pokemon={pokemon} />
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {searchQuery && (
                  <Button
                    onClick={handleClearSearch}
                    size="lg"
                    variant="outline"
                    className="border-2"
                  >
                    <span className="mr-2 text-xl">✖️</span>
                    Clear Search
                  </Button>
                )}
                <Button
                  onClick={handleManualRefresh}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                  disabled={autoRefresh}
                >
                  <span className="mr-2 text-xl">🎲</span>
                  Random Pokémon
                </Button>
                
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="lg"
                  variant={autoRefresh ? 'destructive' : 'default'}
                  className={
                    autoRefresh
                      ? 'shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }
                >
                  <span className="mr-2 text-xl">{autoRefresh ? '⏸️' : '▶️'}</span>
                  {autoRefresh ? 'Stop Auto' : 'Auto (5s)'}
                </Button>
                
                <Button
                  onClick={() => window.open('https://pokeapi.co/docs/v2', '_blank')}
                  variant="outline"
                  size="lg"
                  className="border-2"
                >
                  <span className="mr-2 text-xl">📚</span>
                  API Docs
                </Button>
              </div>

              {/* Auto-refresh Indicator */}
              {autoRefresh && (
                <div className="animate-pulse rounded-xl border-2 border-green-200 bg-green-50 px-6 py-3 text-center font-medium text-green-700 shadow-md dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                  <span className="mr-2 text-xl">⚡</span>
                  Auto-refreshing every 5 seconds...
                </div>
              )}

              {/* API Information Card */}
              <div className="mt-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    📡 API Information
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Endpoint:
                    </div>
                    <code className="block rounded-lg bg-slate-100 px-4 py-3 text-sm text-purple-600 dark:bg-slate-800 dark:text-purple-400">
                      GET https://pokeapi.co/api/v2/pokemon/{'{'}id or name{'}'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Current Pokémon:
                    </div>
                    <code className="block rounded-lg bg-slate-100 px-4 py-3 text-sm text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                      GET https://pokeapi.co/api/v2/pokemon/{pokemon.id}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-3 dark:bg-purple-950">
                    <span className="text-2xl">🎯</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Random Generation 1 Pokémon (IDs: 1-1025)
                    </span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 text-4xl">⚡</div>
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-white">Fast Caching</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    TanStack Query caches data for 5-10 minutes
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 text-4xl">🔄</div>
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-white">Auto Refresh</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Enable auto-refresh to discover Pokémon continuously
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 text-4xl">🎨</div>
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-white">Type Colors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Each Pokémon type has unique gradient colors
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PokemonPage
