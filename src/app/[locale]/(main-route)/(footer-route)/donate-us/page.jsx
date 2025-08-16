"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDonateMutation } from "@/lib/features/api/donateApi"
import { Loader2, Heart, DollarSign, Gift, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

const DonateUs = () => {
  const t = useTranslations('DonateUs');
  const [donate, { isLoading }] = useDonateMutation()
  const [selectedAmounts, setSelectedAmounts] = useState([])
  const [customAmount, setCustomAmount] = useState("")

  const amounts = [10, 25, 50]

  const handleSelectAmount = (amount) => {
    setSelectedAmounts((prev) => (prev.includes(amount) ? prev.filter((a) => a !== amount) : [...prev, amount]))
  }

  const totalAmount = selectedAmounts.reduce((acc, curr) => acc + curr, 0) + Number(customAmount)

  const handleDonate = () => {
    donate({ amount: totalAmount })
  }

  return (
    <div className="min-h-minus-header flex flex-col items-center justify-between bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-accent dark:via-accent/95 dark:to-accent/90 px-4 pt-10 md:pt-20 overflow-hidden relative">
      {/* Animated Love Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating hearts */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`heart-large-${i}`}
            className="absolute text-white/10 animate-float-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </div>
        ))}

        {/* Medium floating hearts */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`heart-medium-${i}`}
            className="absolute text-white/8 animate-float-heart-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${10 + Math.random() * 3}s`,
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </div>
        ))}

        {/* Small floating hearts */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`heart-small-${i}`}
            className="absolute text-white/6 animate-float-heart-gentle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 2}s`,
            }}
          >
            <Heart className="w-4 h-4 fill-current" />
          </div>
        ))}

        {/* Pulsing heart circles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`heart-pulse-${i}`}
            className="absolute animate-pulse-heart"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            <Heart className="w-12 h-12 text-white/5 fill-current" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-card backdrop-blur-xl rounded-2xl p-4 text-center z-10 w-full max-w-2xl border border-white/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-pink-500 to-primary"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-primary rounded-full opacity-20"></div>

        <Card className="shadow-none border-none bg-transparent">
          <CardHeader className="pb-6">
            {/* Icon Header */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-current animate-pulse" />
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              {t('supportCommunity')}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base mt-3 leading-relaxed">
              {t('description')}
              <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">$25</span>. Every
              contribution helps us improve and expand! 🚀
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label className="text-muted-foreground font-semibold text-lg flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t('chooseSupportLevel')}
              </Label>

              <div className="flex flex-wrap justify-center lg:gap-6 gap-3 mt-6">
                {amounts.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleSelectAmount(amount)}
                    className={cn(
                      "group relative w-[130px] h-10 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      selectedAmounts.includes(amount)
                        ? "bg-gradient-to-br from-primary to-pink-500 text-white shadow-lg ring-2 ring-primary/30 hover:from-primary/90 hover:to-pink-500/90"
                        : "bg-white border-2 border-gray-200 hover:border-primary/50 text-muted-foreground hover:bg-primary/5",
                    )}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>${amount}</span>
                    </div>

                    {selectedAmounts.includes(amount) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Heart className="w-3 h-3 text-primary fill-current" />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-4">
              <Label
                htmlFor="custom-amount"
                className="text-muted-foreground font-semibold text-center flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-pink-500 fill-current" />
                {t('orEnterCustomAmount')}
              </Label>

              <div className="relative max-w-xs mx-auto">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  id="custom-amount"
                  placeholder="25.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-10 h-10 text-center text-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
                />
              </div>
            </div>

            {/* Total Display */}
            {totalAmount > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl py-2 animate-fade-in">
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 text-green-600 fill-current animate-pulse" />
                  <span className="text-green-700 font-semibold">{t('totalDonation')}</span>
                  <span className="text-2xl font-bold text-green-600">${totalAmount}</span>
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
              </div>
            )}

            {/* Donate Button */}
            <div className="pt-4">
              <Button
                onClick={handleDonate}
                disabled={(selectedAmounts.length === 0 && Number(customAmount) <= 0) || isLoading}
                className={cn(
                  "w-full h-10 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden",
                  selectedAmounts.length > 0 || Number(customAmount) > 0
                    ? "bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white shadow-lg"
                    : "bg-gray-300 cursor-not-allowed text-muted-foreground",
                )}
              >
                {/* Button shine effect */}
                {(selectedAmounts.length > 0 || Number(customAmount) > 0) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
                )}

                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('processing')}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 fill-current" />
                      <span>{t('donateNow')}</span>
                      <Gift className="w-5 h-5" />
                    </>
                  )}
                </div>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{t('secure')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>{t('trusted')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>{t('transparent')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DonateUs
