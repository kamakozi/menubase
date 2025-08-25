"use client"

import { AutocompleteInput } from "@/components/ui/autocomplete-input"

const COUNTRIES = [
  { value: "AT", label: "Austria" },
  { value: "DE", label: "Germany" },
  { value: "CH", label: "Switzerland" },
  { value: "IT", label: "Italy" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "CZ", label: "Czech Republic" },
  { value: "HU", label: "Hungary" },
  { value: "SI", label: "Slovenia" },
  { value: "SK", label: "Slovakia" },
  { value: "PL", label: "Poland" },
  { value: "HR", label: "Croatia" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
]

interface CountryAutocompleteProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CountryAutocomplete({ value, onChange, className }: CountryAutocompleteProps) {
  return (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      options={COUNTRIES}
      placeholder="Select country..."
      className={className}
    />
  )
}
