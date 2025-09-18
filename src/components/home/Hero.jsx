"use client"

import Link from "next/link"
import { ArrowRight, Music, Music2, Music3, Music4, Headphones, Radio, Volume2, Disc3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

const Hero = () => {
  const t = useTranslations('Hero')
  const [mounted, setMounted] = useState(false)
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    setMounted(true)
  }, [mounted])

  // Music icons array for variety
  const musicIcons = [Music, Music2, Music3, Music4, Headphones, Radio, Volume2, Disc3]

  return (
    <div className="relative w-full min-h-minus-header flex flex-col items-center justify-center text-center bg-primary dark:bg-accent overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden">

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

      {/* ENHANCED ANIMATED PULSE WAVES - MAIN FEATURE */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Small Quick Pulse Waves */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`small-pulse-${i}`}
            className="absolute animate-quick-pulse-wave"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 1}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <svg
              width="35"
              height="18"
              viewBox="0 0 35 18"
              className="text-white/15 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M2 9 L6 9 L10 3 L14 15 L18 6 L22 12 L26 9 L30 9" />
            </svg>
          </div>
        ))}

        {/* Complex EKG Style Pulses */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`ekg-pulse-${i}`}
            className="absolute animate-ekg-pulse-complex"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 90}deg)`,
            }}
          >
            <svg
              width="100"
              height="50"
              viewBox="0 0 100 50"
              className="text-white/22 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 25 L15 25 L18 10 L22 40 L26 15 L30 35 L34 20 L38 30 L42 25 L50 25 L54 12 L58 38 L62 18 L66 32 L70 25 L78 25 L82 15 L86 35 L90 25 L95 25" />
              <path d="M5 28 L15 28 L20 15 L24 38 L28 20 L32 33 L36 25 L40 32 L44 28 L52 28 L56 18 L60 36 L64 22 L68 30 L72 28 L80 28 L84 20 L88 32 L92 28 L95 28" opacity="0.4" strokeWidth="1.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/40 dark:from-transparent dark:via-accent/20 dark:to-accent/40" />

      {/* Content above the overlay */}
      <div className="relative w-full mx-auto z-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-5xl flex flex-col justify-center">

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
            {
              token ? (
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
              ) : (
                <Link href="/auth/login" passHref>
                  <Button className="group relative rounded-full md:w-50 md:h-12 md:text-lg bg-transparent border-2 border-white text-white hover:text-primary hover:bg-white dark:hover:text-primary hover:border-white transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    <span className="relative flex items-center">
                      <Headphones className="mr-2 h-5 w-5 animate-pulse" />
                      {t('signIn')}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
