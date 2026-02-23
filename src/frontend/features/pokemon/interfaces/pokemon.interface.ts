export interface ContestTypeName {
  name: string
  color: string
  language: {
    name: string
    url: string
  }
}

export interface ContestType {
  id: number
  name: string
  berry_flavor: {
    name: string
    url: string
  }
  names: ContestTypeName[]
}

export interface PokemonSprites {
  front_default: string
  front_shiny: string
  front_female: string | null
  front_shiny_female: string | null
  back_default: string
  back_shiny: string
  back_female: string | null
  back_shiny_female: string | null
}

export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface Pokemon {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  abilities: PokemonAbility[]
  types: PokemonType[]
  stats: PokemonStat[]
  sprites: PokemonSprites
}
