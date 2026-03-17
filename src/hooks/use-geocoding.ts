import { geocodingApi } from "@/api"
import { WEATHER_API } from "@/config"
import type { GeocodingResult } from "@/types"
import { useEffect, useState } from "react"
import { useDebounce } from "./use-debounce"

export function useGeocoding(query: string) {
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)

  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    geocodingApi
      .get("/search", {
        params: {
          name: debouncedQuery,
          count: WEATHER_API.DEFAULTS.SEARCH_RESULT_LIMIT,
          language: "en",
        },
      })
      .then((res) => {
        if (cancelled) return
        const data = res.data.results as GeocodingResult[] | undefined
        setResults(data ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  return { results, loading }
}
