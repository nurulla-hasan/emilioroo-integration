import React from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Link } from '@/i18n/navigation';
import { fallbackAvatar, getInitials } from '@/lib/utils';
import PeopleCardButton from './PeopleCardButton';
import { Mail } from 'lucide-react';

const PeopleCard = ({ user }) => {
    return (
        <Card className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white via-white/90 to-sky-50 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/80">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/20" />
                <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-500/10" />
            </div>

            <div className="relative flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 opacity-60 blur-md transition group-hover:opacity-80" />
                    <Avatar className="relative h-24 w-24 border-4 border-white/80 bg-white shadow-xs dark:border-slate-800">
                        <AvatarImage src={user.profile_image || fallbackAvatar(user.gender)} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{user.name}</h3>
                    {user.email && (
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[180px]">{user.email}</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
                    <PeopleCardButton user={user} />
                    <Link href={`/people/${user._id}`} className="flex-1">
                        <Button variant="secondary" className="w-full rounded-2xl border border-transparent bg-white/70 text-slate-700 shadow-sm transition hover:bg-white focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-800">
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default PeopleCard;