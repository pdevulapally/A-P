"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, CreditCard, Landmark, Wallet } from "lucide-react"
import Link from "next/link"
import PaymentForm from "@/components/payment-form"
import { useToast } from "@/hooks/use-toast"

const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 1999,
    description: "Perfect for small businesses just getting started with their online presence.",
    features: [
      "Custom responsive design",
      "Up to 5 pages",
      "Basic SEO optimization",
      "Contact form",
      "Mobile-friendly design",
      "3 months of support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 4999,
    description: "Ideal for growing businesses that need more advanced features and functionality.",
    features: [
      "Everything in Basic",
      "Up to 10 pages",
      "Advanced SEO optimization",
      "Content management system",
      "Blog integration",
      "E-commerce functionality (up to 20 products)",
      "Social media integration",
      "6 months of support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 9999,
    description: "For established businesses that need a comprehensive digital solution.",
    features: [
      "Everything in Professional",
      "Unlimited pages",
      "Custom web applications",
      "Advanced e-commerce (unlimited products)",
      "User authentication system",
      "Custom database integration",
      "Advanced analytics",
      "Priority support",
      "12 months of support",
    ],
  },
]

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(pricingPlans[1])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const { toast } = useToast()

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful!",
      description: "Thank you for your purchase. We'll be in touch shortly to get started on your project.",
    })
  }

  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-6">
          Choose Your Plan
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Select the perfect package for your business needs and get started on your digital transformation journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: pricingPlans.indexOf(plan) * 0.1 }}
          >
            <Card className={`relative h-full flex flex-col ${plan.popular ? "border-primary" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${(plan.price / 100).toFixed(0)}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${selectedPlan.id === plan.id ? "bg-primary" : "bg-primary/80"}`}
                >
                  {selectedPlan.id === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>
              You've selected the <span className="font-semibold">{selectedPlan.name}</span> plan at $
              {(selectedPlan.price / 100).toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card" className="w-full" onValueChange={setPaymentMethod}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Card
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center">
                  <Landmark className="h-4 w-4 mr-2" />
                  Bank Transfer
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Digital Wallet
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="mt-6">
                <PaymentForm type="card" plan={selectedPlan} onSuccess={handlePaymentSuccess} />
              </TabsContent>
              <TabsContent value="bank" className="mt-6">
                <PaymentForm type="bank" plan={selectedPlan} onSuccess={handlePaymentSuccess} />
              </TabsContent>
              <TabsContent value="wallet" className="mt-6">
                <PaymentForm type="wallet" plan={selectedPlan} onSuccess={handlePaymentSuccess} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Need a custom solution? Contact us for a personalized quote.</p>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  )
}

