"use client"

import Link from "next/link"
import { ArrowRight, Music, Music2, Music3, Music4, Headphones, Radio, Volume2, Disc3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

const Hero = () => {
  const t = useTranslations('Hero');
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [mounted])

  // Music icons array for variety
  const musicIcons = [Music, Music2, Music3, Music4, Headphones, Radio, Volume2, Disc3]

  return (
    <div className="relative w-full min-h-minus-header flex flex-col items-center justify-center text-center bg-primary dark:bg-accent overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Bubbles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className={`absolute rounded-full bg-white/10 backdrop-blur-sm animate-float-${i % 4}`}
            style={{
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Medium Bubbles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`bubble-med-${i}`}
            className={`absolute rounded-full bg-white/5 backdrop-blur-sm animate-float-${i % 4}`}
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Small Bubbles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`bubble-small-${i}`}
            className={`absolute rounded-full bg-white/8 animate-float-${i % 4}`}
            style={{
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Music Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => {
          const IconComponent = musicIcons[i % musicIcons.length]
          return (
            <div
              key={`music-icon-${i}`}
              className={`absolute text-white/20 animate-music-float-${i % 6}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 5}s`,
                fontSize: `${20 + Math.random() * 30}px`,
              }}
            >
              <IconComponent className="w-6 h-6 md:w-8 md:h-8 drop-shadow-lg hover:text-white/40 transition-colors duration-300" />
            </div>
          )
        })}
      </div>

      {/* Pulsing Music Waves */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute rounded-full border border-white/10 animate-pulse-wave"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      {/* Floating Musical Notes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={`note-${i}`}
            className="absolute text-white/15 animate-bounce-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="text-2xl md:text-3xl font-bold">♪</div>
          </div>
        ))}

        {[...Array(8)].map((_, i) => (
          <div
            key={`note2-${i}`}
            className="absolute text-white/10 animate-bounce-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div className="text-xl md:text-2xl font-bold">♫</div>
          </div>
        ))}
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/40 dark:from-transparent dark:via-accent/20 dark:to-accent/40" />

      {/* Content above the overlay */}
      <div className="relative w-full mx-auto z-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-5xl flex flex-col justify-center">
          {/* Animated Logo/Icon */}
          <div className="mb-8 relative">
            {/* Orbiting music notes */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-white/60 text-lg">♪</div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-white/60 text-lg">♫</div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-white/60 text-lg">♪</div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-white/60 text-lg">♫</div>
            </div>
          </div>

          {/* Main Heading with enhanced styling */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-tight mb-6 drop-shadow-2xl animate-fade-in-up">
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.1s" }}>
              B
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.2s" }}>
              a
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.3s" }}>
              n
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.4s" }}>
              k
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>
              y
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.6s" }}>
              b
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.7s" }}>
              o
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.8s" }}>
              n
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "0.9s" }}>
              d
            </span>
            <span className="inline-block animate-bounce-gentle" style={{ animationDelay: "1.0s" }}>
              y
            </span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg text-white mb-8 opacity-90 drop-shadow-lg animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            {t('title')}
          </p>

          {/* Enhanced CTA Button */}
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Link href="/chatting" passHref>
              <Button className="group relative rounded-full md:w-50 md:h-12 md:text-lg bg-transparent border-2 border-white text-white hover:text-primary hover:bg-white dark:hover:text-primary hover:border-white transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                {/* Button background animation */}
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <span className="relative flex items-center">
                  <Headphones className="mr-2 h-5 w-5 animate-pulse" />
                  {t('explore')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
