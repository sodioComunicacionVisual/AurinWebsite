// contentlayer/generated の型定義
export interface SolutionHero {
  badge?: string
  title: string | string[]
  description?: string
  cta?: Array<{
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
