"use client"

import { motion } from "motion/react"
import { Bot } from "lucide-react"
import styles from "./ChatbotResponse.module.css"

interface ChatbotResponseProps {
  response: string
}

export function ChatbotResponse({ response }: ChatbotResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={styles.container}
    >
      <div className={styles.iconWrapper}>
        <Bot className={styles.icon} aria-hidden="true" />
      </div>
      <p className={styles.text}>{response}</p>
    </motion.div>
  )
}
