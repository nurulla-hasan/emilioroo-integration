"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Mediators = ({ mediators }) => {
    return (
        <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Mediators</h2>
            <div className="flex justify-around">
                {mediators.map(mediator => (
                    <div key={mediator.id} className="flex flex-col items-center">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={mediator.avatar} />
                            <AvatarFallback>{mediator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="mt-2 font-semibold">{mediator.name}</p>
                        <p className="text-sm text-muted-foreground">{mediator.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mediators;
