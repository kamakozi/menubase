"use client"

import { useState, useEffect } from "react"
import { AutocompleteInput } from "@/components/ui/autocomplete-input"

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  country: string
  className?: string
}

// Austrian cities for demonstration
const AUSTRIAN_CITIES = [
  { value: "Vienna", label: "Vienna (Wien)" },
  { value: "Graz", label: "Graz" },
  { value: "Linz", label: "Linz" },
  { value: "Salzburg", label: "Salzburg" },
  { value: "Innsbruck", label: "Innsbruck" },
  { value: "Klagenfurt", label: "Klagenfurt" },
  { value: "Villach", label: "Villach" },
  { value: "Wels", label: "Wels" },
  { value: "Sankt Pölten", label: "Sankt Pölten" },
  { value: "Dornbirn", label: "Dornbirn" },
  { value: "Steyr", label: "Steyr" },
  { value: "Wiener Neustadt", label: "Wiener Neustadt" },
  { value: "Feldkirch", label: "Feldkirch" },
  { value: "Bregenz", label: "Bregenz" },
  { value: "Wolfsberg", label: "Wolfsberg" },
  { value: "Baden", label: "Baden" },
  { value: "Leoben", label: "Leoben" },
  { value: "Krems", label: "Krems" },
  { value: "Traun", label: "Traun" },
  { value: "Amstetten", label: "Amstetten" },
  { value: "Kapfenberg", label: "Kapfenberg" },
  { value: "Mödling", label: "Mödling" },
  { value: "Hallein", label: "Hallein" },
  { value: "Kufstein", label: "Kufstein" },
  { value: "Traiskirchen", label: "Traiskirchen" },
  { value: "Schwechat", label: "Schwechat" },
  { value: "Braunau am Inn", label: "Braunau am Inn" },
  { value: "Stockerau", label: "Stockerau" },
  { value: "Saalfelden", label: "Saalfelden" },
  { value: "Ansfelden", label: "Ansfelden" },
  { value: "Tulln", label: "Tulln" },
  { value: "Hohenems", label: "Hohenems" },
  { value: "Spittal an der Drau", label: "Spittal an der Drau" },
  { value: "Telfs", label: "Telfs" },
  { value: "Ternitz", label: "Ternitz" },
  { value: "Perchtoldsdorf", label: "Perchtoldsdorf" },
  { value: "Feldkirchen", label: "Feldkirchen" },
  { value: "Bludenz", label: "Bludenz" },
  { value: "Bad Ischl", label: "Bad Ischl" },
  { value: "Eisenstadt", label: "Eisenstadt" },
  { value: "Rankweil", label: "Rankweil" },
  { value: "Hollabrunn", label: "Hollabrunn" },
  { value: "Klosterneuburg", label: "Klosterneuburg" },
  { value: "Lauterach", label: "Lauterach" },
  { value: "Lustenau", label: "Lustenau" },
  { value: "Klaus", label: "Klaus" },
]

const GERMAN_CITIES = [
  { value: "Berlin", label: "Berlin" },
  { value: "Hamburg", label: "Hamburg" },
  { value: "Munich", label: "Munich (München)" },
  { value: "Cologne", label: "Cologne (Köln)" },
  { value: "Frankfurt", label: "Frankfurt am Main" },
  { value: "Stuttgart", label: "Stuttgart" },
  { value: "Düsseldorf", label: "Düsseldorf" },
  { value: "Leipzig", label: "Leipzig" },
  { value: "Dortmund", label: "Dortmund" },
  { value: "Essen", label: "Essen" },
]

export function CityAutocomplete({ value, onChange, country, className }: CityAutocompleteProps) {
  const [cities, setCities] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    switch (country) {
      case "AT":
        setCities(AUSTRIAN_CITIES)
        break
      case "DE":
        setCities(GERMAN_CITIES)
        break
      default:
        setCities([])
    }
  }, [country])

  return (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      options={cities}
      placeholder={country ? "Type to search cities..." : "Select country first"}
      className={className}
    />
  )
}
