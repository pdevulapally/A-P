"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Code, Palette, BarChart } from "lucide-react"

export default function FeaturedServices() {
  const services = [
    {
      icon: Palette,
      title: "Web Design",
      description:
        "Custom, responsive designs that capture your brand's essence and provide exceptional user experiences.",
    },
    {
      icon: Code,
      title: "Web Development",
      description:
        "Cutting-edge web applications built with modern technologies that deliver performance and reliability.",
    },
    {
      icon: BarChart,
      title: "Business Solutions",
      description:
        "Strategic digital solutions that help your business grow, from marketing websites to enterprise applications.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Services</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Transforming Ideas into Digital Reality
            </h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              We offer a comprehensive range of web development services to help your business thrive in the digital
              world.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-background/60 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="link" className="p-0">
                      <Link href="/services" className="group">
                        Learn more{" "}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild>
            <Link href="/services">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

