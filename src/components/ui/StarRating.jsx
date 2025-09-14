'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating, setRating, totalStars = 5 }) => {
    return (
        <div className="flex items-center gap-1">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={cn(
                                "w-8 h-8 cursor-pointer",
                                starValue <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
