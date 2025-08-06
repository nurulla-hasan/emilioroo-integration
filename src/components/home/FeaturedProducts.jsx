
'use client';

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import PageLayout from '../layout/PageLayout';
import { Badge } from "@/components/ui/badge";


const products = [
    {
        id: "prod_1",
        name: "Classic Denim Jacket",
        price: "3,999",
        originalPrice: "4,999",
        discountPercentage: 20,
        rating: 4,
        imageSrc: "/images/product/product (6).png",
        imageAlt: "A classic blue denim jacket.",
    },
    {
        id: "prod_2",
        name: "Minimalist T-shirt",
        price: "1,200",
        originalPrice: "1,500",
        discountPercentage: 20,
        rating: 5,
        imageSrc: "/images/product/product (2).png",
        imageAlt: "A plain white minimalist t-shirt.",
    },
    {
        id: "prod_3",
        name: "Stylish Sneakers",
        price: "5,500",
        originalPrice: "7,000",
        discountPercentage: 21,
        rating: 4,
        imageSrc: "/images/product/product (3).png",
        imageAlt: "A pair of stylish white sneakers.",
    },
    {
        id: "prod_4",
        name: "Smart Watch",
        price: "8,500",
        originalPrice: "10,000",
        discountPercentage: 15,
        rating: 5,
        imageSrc: "/images/product/product (4).png",
        imageAlt: "A modern smart watch.",
    },
];

const FeaturedProducts = () => {
    return (
        <div className='min-h-minus-header'>
            <div className='py-16'>
                <PageLayout>
                    <div className="container mx-auto px-4">
                        {/* Header Section */}
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-title mb-2">Exclusive Deals & Offers</h2>
                            <p className="text-lg text-subtitle max-w-2xl mx-auto">
                                Explore our handpicked collection of high-quality products at unbeatable prices.
                            </p>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(({ id, name, price, originalPrice, discountPercentage, rating, imageSrc, imageAlt }) => (
                                <Card key={id} className="w-full max-w-sm mx-auto bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                    <CardContent className="p-0">
                                        {/* Image Container */}
                                        <div className="relative bg-muted/50 p-6 group-hover:bg-muted transition-colors duration-300">
                                            {/* Discount Badge */}
                                            <Badge className="absolute top-4 left-4 bg-brand hover:bg-brand/90 text-white font-bold px-3 py-1 text-sm z-10">
                                                {discountPercentage}% Off
                                            </Badge>

                                            {/* Product Image */}
                                            <div className="flex items-center justify-center h-64">
                                                <Image
                                                    src={imageSrc}
                                                    alt={imageAlt}
                                                    width={200}
                                                    height={250}
                                                    className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-6 space-y-4">
                                            {/* Product Name */}
                                            <h3 className="text-xl font-semibold text-title text-center">{name}</h3>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    {/* Price */}
                                                    <div className="text-left space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-brand">${price}</span>
                                                            <span className="text-sm text-subtitle line-through">${originalPrice}</span>
                                                        </div>
                                                    </div>

                                                    {/* Stock Status */}
                                                    <div className="text-left">
                                                        <span className="text-green-600 font-medium text-sm">In Stock</span>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-brand text-brand" />
                                                    <span className="font-bold text-xs text-title">{rating.toFixed(1)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-skyBlue text-skyBlue hover:bg-skyBlue2 hover:border-skyBlue hover:text-skyBlue transition-all duration-200 bg-transparent"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Add to cart
                                                </Button>
                                                <Button className="flex-1 bg-skyBlue hover:bg-skyBlue/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </PageLayout>
            </div>
        </div>
    );
};

export default FeaturedProducts;