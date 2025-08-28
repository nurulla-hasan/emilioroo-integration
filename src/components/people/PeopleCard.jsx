import React from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { fallbackAvatar, getInitials } from '@/lib/utils';
import PeopleCardButton from './PeopleCardButton';

const PeopleCard = ({ user, }) => {
    console.log(user);
    return (
        <div>
            <Card key={user._id} className="flex flex-col items-center p-4">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profile_image || fallbackAvatar(user.gender)} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex mt-4 w-full gap-2">
                    <PeopleCardButton user={user} />
                    <Link href={`/people/${user._id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Profile</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default PeopleCard;