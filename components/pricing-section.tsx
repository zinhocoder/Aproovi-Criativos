import { PricingCard } from "@/components/pricing-card"

const plans = [
  {
    name: "Starter",
    price: "R$99",
    description: "Ideal para agências iniciantes.",
    planId: "starter",
    features: [
      { text: "Até 5 clientes" },
      { text: "100 criativos/mês" },
      { text: "2 usuários" },
      { text: "Suporte por email" },
    ],
  },
  {
    name: "Pro",
    price: "R$199",
    description: "Para agências em crescimento.",
    planId: "pro",
    popular: true,
    features: [
      { text: "Até 15 clientes" },
      { text: "500 criativos/mês" },
      { text: "5 usuários" },
      { text: "Suporte prioritário" },
      { text: "Relatórios avançados" },
    ],
  },
  {
    name: "Enterprise",
    price: "R$399",
    description: "Para agências de grande porte.",
    planId: "enterprise",
    features: [
      { text: "Clientes ilimitados" },
      { text: "Criativos ilimitados" },
      { text: "Usuários ilimitados" },
      { text: "Suporte 24/7" },
      { text: "API personalizada" },
      { text: "Marca personalizada" },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="planos" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Planos</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Escolha o plano ideal para o tamanho da sua agência.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl items-start gap-6 py-12 grid grid-cols-1 md:grid-cols-3 md:gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`my-4 md:my-0 ${plan.popular ? "md:-my-4" : ""}`}>
              <PricingCard
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                planId={plan.planId}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
