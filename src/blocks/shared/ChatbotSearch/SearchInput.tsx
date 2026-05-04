"use client"

import { useState, type FormEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { useTypewriter } from "./useTypewriter"
import type { SearchTranslations } from "./types"
import styles from "./SearchInput.module.css"

const DEFAULT_TRANSLATIONS: SearchTranslations = {
  label: "¿Qué servicio buscas?",
  placeholder: "¿Qué servicio buscas?",
  ariaLabel: "¿Qué servicio buscas?",
  submitAriaLabel: "Enviar pregunta",
  services: [
    "Desarrollo web y de aplicaciones móviles",
    "Pruebas de usabilidad",
    "Desarrollo de Branding",
    "Diseño UX/UI",
    "Consultoría Digital",
  ],
}

interface SearchInputProps {
  onSubmit?: (query: string) => void
  isLoading?: boolean
  translations?: SearchTranslations
}

export function SearchInput({ onSubmit, isLoading = false, translations }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const t = translations ?? DEFAULT_TRANSLATIONS

  const typewriterText = useTypewriter({
    words: t.services,
    typeSpeed: 80,
    deleteSpeed: 40,
    delayBetweenWords: 2500,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onSubmit?.(query.trim())
      setQuery("")
    }
  }

  const isActive = query.trim().length > 0 && !isLoading

  return (
    <motion.div
      className={styles.searchInputWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      role="search"
    >
      <form onSubmit={handleSubmit} className={styles.form} aria-label={t.ariaLabel}>
        <label htmlFor="chatbot-input" className={styles.label}>
          {t.label}
        </label>
        <div className={styles.inputContainer}>
          <input
            id="chatbot-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={typewriterText || t.placeholder}
            disabled={isLoading}
            className={styles.input}
            aria-label={t.ariaLabel}
            aria-busy={isLoading}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={!isActive}
          className={styles.submitButton}
          aria-label={t.submitAriaLabel}
          aria-disabled={!isActive}
        >
          <ArrowUpRight strokeWidth={2.5} size={20} />
        </button>
      </form>
    </motion.div>
  )
}
