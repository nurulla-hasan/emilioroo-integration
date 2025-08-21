import React from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

const PeopleCardSkeleton = ({count = 3}) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <Card key={index} className="flex flex-col items-center p-4">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="text-center flex flex-col justify-center items-center">
                        <Skeleton className="h-6 w-32 rounded mb-2"></Skeleton>
                        <Skeleton className="h-4 w-48 rounded"></Skeleton>
                    </div>
                    <Button className="mt-4 w-full" disabled></Button>
                </Card>
            ))}
        </>
    );
};

export default PeopleCardSkeleton;