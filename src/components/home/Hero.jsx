"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"

const Hero = () => {
    return (
        <div
            className="relative w-full min-h-[100vh] flex items-center justify-center text-center -mt-[81px]"
        >
            {/* Next.js Image component for background */}
            <Image
                src="/images/hero.png"
                alt="Hero Background"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="absolute inset-0 z-0"
            />


            {/* Content above the overlay */}
            <div className="relative w-full z-20 px-4 md:pl-20">
                <div className="max-w-5xl flex flex-col justify-start">
                    {/* Main Heading */}
                    <h1 className="text-start text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-tight mb-6 drop-shadow-2xl">
                        Enhance Your Vape experience
                    </h1>

                    <p className="text-start text-sm sm:text-base md:text-lg text-white mb-8 opacity-90 drop-shadow-lg">
                        Discover premium flavors and unmatched satisfaction.
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-start">
                        <Link href="/shop" passHref>
                            <Button className={"md:w-40 md:h-12 md:text-lg bg-transparent border border-white text-white hover:text-primary hover:bg-transparent hover:border"}>
                                Shop Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero