"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type React from "react"

interface CTAButton {
  text: string
  href: string
  variant?: "default" | "outline"
}

interface FeatureCardData {
  icon: React.ReactNode
  title: string
  description: string
}

interface SharedHeroSectionProps {
  badgeText: string
  mainHeadingTexts: string[]
  subheadingText: string
  ctaButtons: CTAButton[]
  quoteText: string[]
  quoteCite: string
  featuresHeaderText: string
  featuresHeaderSubtext: string
  featureCardsData: FeatureCardData[]
  FeatureCardComponent: React.ComponentType<FeatureCardData>
  BackgroundEffectsComponent: React.ComponentType
}

export function SharedHeroSection({
  badgeText,
  mainHeadingTexts,
  subheadingText,
  ctaButtons,
  quoteText,
  quoteCite,
  featuresHeaderText,
  featuresHeaderSubtext,
  featureCardsData,
  FeatureCardComponent,
  BackgroundEffectsComponent,
}: SharedHeroSectionProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Effects - z-0 to z-20 */}
        <BackgroundEffectsComponent />

        {/* Content - z-30 to ensure it's above background */}
        <div className="relative z-30 flex items-center justify-center h-full">
          <div className="text-center space-y-8 max-w-4xl mx-auto px-8">
            {/* Badge */}
            {badgeText && (
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30 backdrop-blur-sm">
                {badgeText}
              </Badge>
            )}

            {/* Main Heading */}
            <div className="space-y-4">
              {mainHeadingTexts.map((text, index) => (
                <h1
                  key={index}
                  className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl"
                  style={{
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {text}
                </h1>
              ))}
            </div>

            {/* Subheading */}
            {subheadingText && <p className="text-xl text-slate-300 mb-8 drop-shadow-lg">{subheadingText}</p>}

            {/* CTA Buttons */}
            {ctaButtons.length > 0 && (
              <div className="flex gap-4 justify-center flex-wrap">
                {ctaButtons.map((button, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant={button.variant || "default"}
                    className={
                      button.variant === "outline"
                        ? "border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-transparent backdrop-blur-sm"
                        : "bg-blue-600 hover:bg-blue-700 backdrop-blur-sm"
                    }
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            )}

            {/* Quote */}
            {quoteText.length > 0 && (
              <blockquote className="text-slate-300 italic text-lg drop-shadow-lg">
                {quoteText.map((text, index) => (
                  <p key={index}>"{text}"</p>
                ))}
                {quoteCite && <cite className="text-slate-400 text-sm">— {quoteCite}</cite>}
              </blockquote>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      {featureCardsData.length > 0 && (
        <div className="relative bg-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-8">
            {/* Features Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">{featuresHeaderText}</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">{featuresHeaderSubtext}</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCardsData.map((card, index) => (
                <FeatureCardComponent key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
