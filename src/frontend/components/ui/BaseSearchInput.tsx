'use client'

import { SubmitEventHandler, useState } from 'react'
import { Button } from './Button'

export interface BaseSearchInputProps {
  /** Placeholder text for the search input */
  placeholder?: string
  /** Callback function when search is submitted */
  onSearch: (query: string) => void
  /** Loading state */
  isLoading?: boolean
  /** Initial value */
  defaultValue?: string
  /** Button text */
  buttonText?: string
  /** Show clear button when input has value */
  showClearButton?: boolean
}

export const BaseSearchInput = ({
  placeholder = 'Search...',
  onSearch,
  isLoading = false,
  defaultValue = '',
  buttonText,
  showClearButton = true,
}: BaseSearchInputProps) => {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim().toLowerCase())
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-slate-200 bg-white px-5 py-3 text-base text-slate-900 transition-colors placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-400"
          />
          
          {showClearButton && query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        {buttonText && (
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-to text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2 text-xl">🔍</span>
            {buttonText}
          </Button>
        )}
      </div>
    </form>
  )
}
