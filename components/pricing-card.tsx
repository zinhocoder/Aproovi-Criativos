import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface PricingFeature {
  text: string
}

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: PricingFeature[]
  popular?: boolean
  planId: string
}

export function PricingCard({ name, price, description, features, popular, planId }: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md relative ${
        popular ? "border-primary shadow-md scale-105 md:scale-110 z-10" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Popular
        </div>
      )}
      <div className="p-6 pt-8">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-5xl font-bold text-primary">{price}</span>
          <span className="ml-1 text-xl font-normal text-muted-foreground">/mês</span>
        </div>
        <div className="mt-1 mb-4">
          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Teste grátis por 14 dias
          </span>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-1 flex-col p-6 bg-muted/30">
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Link href={`/register?plan=${planId}`} className="w-full">
            <Button className={`w-full ${popular ? "bg-primary hover:bg-primary/90" : ""}`}>
              {popular ? "Escolher Plano Pro" : "Começar Agora"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
