import { Link } from '@/i18n/navigation';
import { Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const InstitutionHeader = ({ institution }) => {
    return (
        <>
            <div className="relative h-48 w-full bg-card border-b rounded-lg">
                <Image
                    src={institution.cover_image || "/placeholder.png"}
                    alt={institution.name || "Institution cover"}
                    fill
                    className="object-cover rounded-lg"
                    priority
                />
            </div>
            <div className="py-4 flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold text-primary dark:text-white">{institution.name}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{institution.description}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <Link href={`${institution.facebookLink}`}>
                        <Facebook className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </Link>
                    <Link href={`${institution.instagramLink}`}>
                        <Instagram className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </Link>
                </div>
            </div>
        </>
    );
};

export default InstitutionHeader;