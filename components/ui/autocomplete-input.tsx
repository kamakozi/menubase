"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutocompleteOption {
  value: string
  label: string
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  className?: string
  onInputChange?: (value: string) => void
}

export function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder,
  className,
  onInputChange,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()))
    setFilteredOptions(filtered)
  }, [value, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    onInputChange?.(newValue)
    setIsOpen(true)
  }

  const handleOptionSelect = (option: AutocompleteOption) => {
    onChange(option.value)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn("pr-8", className)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="h-4 w-4 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
