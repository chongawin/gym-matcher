'use client'

import Image from 'next/image'

import type { Pokemon } from '../interfaces'

interface PokemonCardProps {
  pokemon: Pokemon
}

const TYPE_COLORS: Record<string, string> = {
  normal: 'from-gray-400 to-gray-500',
  fire: 'from-red-500 to-orange-500',
  water: 'from-blue-500 to-cyan-500',
  electric: 'from-yellow-400 to-yellow-500',
  grass: 'from-green-500 to-emerald-500',
  ice: 'from-cyan-300 to-blue-400',
  fighting: 'from-red-700 to-orange-700',
  poison: 'from-purple-500 to-purple-700',
  ground: 'from-yellow-600 to-yellow-800',
  flying: 'from-indigo-400 to-blue-400',
  psychic: 'from-pink-500 to-purple-500',
  bug: 'from-lime-500 to-green-600',
  rock: 'from-yellow-700 to-stone-700',
  ghost: 'from-purple-700 to-indigo-800',
  dragon: 'from-indigo-600 to-purple-600',
  dark: 'from-gray-700 to-gray-900',
  steel: 'from-gray-400 to-slate-500',
  fairy: 'from-pink-400 to-pink-500',
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const gradient = TYPE_COLORS[primaryType] || 'from-gray-400 to-gray-500'

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>

      <div className="relative p-6">
        {/* Pokemon Image */}
        <div className="mb-4 flex justify-center">
          <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg`}>
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={128}
              height={128}
              className="pixelated"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
            />
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="text-center">
          <div className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          <h3 className="mb-3 text-2xl font-bold capitalize text-slate-900 dark:text-white">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="mb-4 flex justify-center gap-2">
            {pokemon.types.map((type) => {
              const typeGradient = TYPE_COLORS[type.type.name] || 'from-gray-400 to-gray-500'
              return (
                <span
                  key={type.slot}
                  className={`rounded-full bg-gradient-to-r ${typeGradient} px-3 py-1 text-xs font-semibold text-white shadow-md`}
                >
                  {type.type.name}
                </span>
              )
            })}
          </div>

          {/* Stats */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Height:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {pokemon.height / 10}m
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Weight:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {pokemon.weight / 10}kg
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Base EXP:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {pokemon.base_experience}
              </span>
            </div>
          </div>

          {/* Abilities */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              ABILITIES
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.slot}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {ability.ability.name.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
