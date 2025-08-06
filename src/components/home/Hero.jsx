"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

const Hero = () => {
    return (
        <div
            className="relative w-full min-h-minus-header flex flex-col items-center justify-center text-center bg-primary"
        >
            {/* Content above the overlay */}
            <div className="relative w-full mx-auto z-20 px-4 flex flex-col items-center justify-center">
                <div className="max-w-5xl flex flex-col justify-center">
                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-tight mb-6 drop-shadow-2xl">
                        Bankybondy
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-white mb-8 opacity-90 drop-shadow-lg">
                        We are what we do together
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <Link href="/" passHref>
                            <Button className={"rounded-full md:w-50 md:h-12 md:text-lg bg-transparent border border-white text-white hover:text-primary hover:bg-white hover:border"}>
                                Explor Now
                                <ArrowRight className="ml-2 h-8 w-8" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Wave Images */}
            <div className="relative">
                <img className="absolut" src='images/wave/wave (3).png' alt="Wave 3" />
                <img className="absolut" src='images/wave/wave (3).png' alt="Wave 3" />
                <img className="absolute top-10" src='images/wave/wave (3).png' alt="Wave 3" />
            </div>
        </div>
    )
}

export default Hero