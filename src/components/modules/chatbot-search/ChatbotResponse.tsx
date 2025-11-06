"use client"

import { motion } from "motion/react"
import { GlassEffect } from "./GlassEffect"
import { Bot } from "lucide-react"
import styles from "./ChatbotResponse.module.css"

interface ChatbotResponseProps {
  response: string
}

export function ChatbotResponse({ response }: ChatbotResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={styles.responseContainer}
    >
      <GlassEffect className={styles.glassContainer}>
        <div className={styles.contentWrapper}>
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.iconWrapper}
          >
            <div className={styles.iconBackground}>
              <Bot className={styles.icon} aria-hidden="true" />
            </div>
          </motion.div>
          <div className={styles.textWrapper}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={styles.responseText}
            >
              {response}
            </motion.p>
          </div>
        </div>
      </GlassEffect>
    </motion.div>
  )
}
