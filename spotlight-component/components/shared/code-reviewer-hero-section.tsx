"use client"

import { FeatureCard } from "@/components/shared/feature-card"
import { SharedHeroSection } from "@/components/shared/hero-section"
import { BackgroundEffects } from "@/components/shared/solution-hero-background"
import {
  Cog,
  FileCheck2,
  GitMerge,
  GitPullRequestArrow,
  type LucideIcon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

// SolutionHero型の定義
interface SolutionHero {
  badge?: string
  title: string[]
  description: string
  cta: Array<{
    text: string
    href: string
    variant?: "default" | "outline"
  }>
  quote?: {
    text: string
    cite: string
  }
  features?: {
    title: string
    description: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  }
}

const iconMap: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Cog,
  GitPullRequestArrow,
  Sparkles,
  ShieldAlert,
  GitMerge,
  FileCheck2,
}

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} />
}

export function CodeReviewerHeroSection({ hero }: { hero: SolutionHero }) {
  const featureCardsData =
    hero.features?.items.map((card) => ({
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg flex items-center justify-center">
          <IconComponent name={card.icon} className="w-5 h-5 text-white" />
        </div>
      ),
      title: card.title,
      description: card.description,
    })) || []

  return (
    <SharedHeroSection
      badgeText={hero.badge || ""}
      mainHeadingTexts={hero.title || []}
      subheadingText={hero.description || ""}
      ctaButtons={hero.cta || []}
      quoteText={hero.quote ? [hero.quote.text] : []}
      quoteCite={hero.quote?.cite || ""}
      featuresHeaderText={hero.features?.title || ""}
      featuresHeaderSubtext={hero.features?.description || ""}
      featureCardsData={featureCardsData}
      FeatureCardComponent={FeatureCard}
      BackgroundEffectsComponent={BackgroundEffects}
    />
  )
}
