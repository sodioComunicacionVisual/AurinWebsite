"use client"

import { useState, type FormEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { useTypewriter } from "./useTypewriter"
import styles from "./SearchInput.module.css"

interface SearchInputProps {
  onSubmit?: (query: string) => void
  isLoading?: boolean
  translations?: {
    label: string
    placeholder: string
    ariaLabel: string
    submitAriaLabel: string
    services: readonly string[]
  }
}

const DEFAULT_SERVICES = [
  "Desarrollo web y de aplicaciones móviles",
  "Pruebas de usabilidad",
  "Desarrollo de Branding",
  "Diseño UX/UI",
  "Consultoría Digital",
] as const

export function SearchInput({ onSubmit, isLoading = false, translations }: SearchInputProps) {
  const [query, setQuery] = useState("")
  
  const t = translations || {
    label: "¿Qué servicio buscas?",
    placeholder: "¿Qué servicio buscas?",
    ariaLabel: "Escribe tu pregunta sobre servicios",
    submitAriaLabel: "Enviar pregunta",
    services: DEFAULT_SERVICES
  }
  
  const typewriterText = useTypewriter({
    words: t.services,
    typeSpeed: 80,
    deleteSpeed: 40,
    delayBetweenWords: 2500,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      if (onSubmit) {
        onSubmit(query.trim())
      }
      setQuery("")
    }
  }

  return (
    <motion.div 
      className={styles.searchInputWrapper}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.glassContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <motion.div 
            className={styles.inputContainer}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <label htmlFor="chatbot-input" className={styles.label}>
              {t.label}
            </label>
            <input
              id="chatbot-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t.placeholder} ${typewriterText}`}
              disabled={isLoading}
              className={styles.input}
              aria-label={t.ariaLabel}
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={styles.submitButton}
            whileHover={{ y: -2, filter: "brightness(1.1)", boxShadow: "0 4px 12px rgba(208, 223, 0, 0.3)" }}
            whileTap={{ y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label={t.submitAriaLabel}
          >
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight strokeWidth={2.5} size={22} />
            </motion.div>
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
