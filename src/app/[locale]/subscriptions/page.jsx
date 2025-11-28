

"use client"

import React, { useState } from "react"
// Link removed: using button handlers for actions
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, User, Star, Trophy } from "lucide-react"
import { useSubscribeMutation } from "@/lib/features/api/donateApi"

const plans = [
    {
        id: "free",
        title: "Starter",
        price: "$0",
        summary: "Perfect for getting started",
        icon: User,
        features: [
            "Up to 10 active bond requests",
            "Basic matching",
            "Message unlimited matches",
            "Rate and review peers",
            "Community access",
        ],
        cta: "/normal-user/subscribe",
        variant: "outline",
    },
    {
        id: "pro",
        title: "Standard",
        price: "$9.99",
        summary: "For active exchangers",
        icon: Star,
        features: [
            "Up to 100 active bond requests",
            "Advanced matching algorithms",
            "Priority in search results",
            "Extended messaging storage",
            "Priority support",
            "Performance analytics",
        ],
        cta: "/normal-user/subscribe",
    },
    {
        id: "business",
        title: "Premium",
        price: "$24.99",
        summary: "For power users & teams",
        icon: Trophy,
        features: [
            "Up to 1000 active bond requests",
            "Premium matching + AI suggestions",
            "Featured profile status",
            "Dedicated account support",
            "Team workspace (3 members)",
            "Advanced analytics & insights",
            "Custom branding options",
        ],
        cta: "/normal-user/subscribe",
        variant: "secondary",
    },
]

const Page = () => {
    const router = useRouter()
    const [loadingPlan, setLoadingPlan] = useState(null)
    const [subscribe] = useSubscribeMutation()

    // Handler for choosing a plan (free or paid)
    const handleChoose = async (plan) => {
        // Free plan: quick 2s loading then redirect home
        if (plan.id === 'free') {
            try {
                setLoadingPlan(plan.id)
                await new Promise((r) => setTimeout(r, 2000))
                router.push('/')
            } finally {
                setLoadingPlan(null)
            }
            return
        }

        // Paid plans: call subscribe mutation (handles redirect via onQueryStarted in donateApi)
        try {
            setLoadingPlan(plan.id)
            await subscribe({ type: plan.title }).unwrap()
            // onQueryStarted in donateApi will redirect if payment URL provided
        } catch (err) {
            console.error(err)
            toast.error(err?.data?.message || 'Failed to initiate subscription')
            setLoadingPlan(null)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h1 className="text-3xl font-semibold text-foreground">Choose Your Plan</h1>
                    <p className="text-muted-foreground mt-2">
                        One-time purchase — unlock more bond requests and grow your network with Bankybondy. No recurring billing.
                    </p>
                </div>            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.id} className="p-0 flex flex-col h-full transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary/50">
                            <CardHeader className="flex items-start justify-between px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <plan.icon className="h-6 w-6 text-primary" />
                                    <div>
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">{plan.title}</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-300">{plan.summary}</CardDescription>
                                    </div>
                                </div>
                                {plan.badge ? (
                                    <div className="ml-4">
                                        <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-white">{plan.badge}</Badge>
                                    </div>
                                ) : null}
                            </CardHeader>

                            <CardContent className="px-6 pb-4 flex-1">
                                <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">One‑time</span>
                                    </div>
                                </div>

                                <ul className="space-y-2 text-sm">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                            <Check className="h-4 w-4 text-primary dark:text-sky-400 flex-shrink-0" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="px-6 py-4">
                                <div className="w-full">
                                    <Button
                                        className="w-full"
                                        variant={plan.variant || 'default'}
                                        loading={loadingPlan === plan.id}
                                        onClick={() => handleChoose(plan)}
                                    >
                                        Choose {plan.title}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page;