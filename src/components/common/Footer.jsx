"use client";

import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-16 border-t border-gray-500">
            <div className="flex flex-col md:flex-row gap-10 justify-between text-center lg:text-left xl:max-w-[1400px] mx-auto">
                {/* Logo and Description */}
                <div className="space-y-4 relative">
                    <div className="flex justify-center lg:justify-start gap-3 items-center">
                        <Link href="/">
                            <div className="md:h-7 lg:h-8 border-[#FFFFFF] font-bold text-lg flex justify-center items-center gap-2 border-2 rounded-[100%] p-2">
                                <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#22B14C]"></div>
                                <div className="lg:w-12 w-8 h-2 rounded-full bg-[#FFF200]"></div>
                                <div className="lg:w-2 w-2 lg:h-2 h-2 rounded-full bg-[#ED1C24]"></div>
                            </div>
                        </Link>
                        <h2 className="text-xl font-bold">Bankybondy</h2>
                    </div>
                    <p className="text-xs lg:absolute lg:top-8 lg:left-36">We are chatting</p>
                    <p className="text-sm font-[300] mt-4 lg:mt-12 mx-auto lg:mx-0 max-w-xs">
                        A free platform for sharing and exploring daily life conversations. Enjoy authentic audio snippets from real
                        people, and if you&apos;d like to support us, donations are always appreciated.
                    </p>
                </div>

                {/* Information Links */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4 lg:mb-6">Information</h3>
                    <nav className="flex flex-col space-y-3 *:text-sm">
                        <Link href="/donate-us" className="hover:underline">
                            Donate us
                        </Link>
                        <Link href="/contact" className="hover:underline">
                            Contact us
                        </Link>
                        <Link href="/about" className="hover:underline">
                            About Us
                        </Link>
                        <Link href="/terms" className="hover:underline">
                            Terms and Conditions
                        </Link>
                        <Link href="/privacy" className="hover:underline">
                            Privacy policy
                        </Link>
                    </nav>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4 lg:mb-6">Social media</h3>
                    <div className="flex flex-col space-y-3 *:text-sm items-center lg:items-start">
                        <Link href="https://facebook.com" className="flex items-center space-x-2 hover:underline">
                            <div className="bg-primary rounded-full p-1.5 border">
                                <Facebook className="w-4 h-4 text-white" />
                            </div>
                            <span>Facebook</span>
                        </Link>
                        <Link href="https://instagram.com" className="flex items-center space-x-2 hover:underline">
                            <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-full border p-1.5">
                                <Instagram className="w-4 h-4 text-white" />
                            </div>
                            <span>Instagram</span>
                        </Link>
                        <Link href="https://twitter.com" className="flex items-center space-x-2 boredr hover:underline">
                            <div className="bg-black rounded-full p-2">
                                <Twitter className="w-4 h-4 text-white" />
                            </div>
                            <span>Twitter</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
