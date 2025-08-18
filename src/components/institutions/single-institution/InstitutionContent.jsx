"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Plus } from 'lucide-react';
import ConversationTopics from './ConversationTopics'; 

const InstitutionContent = ({ innovators, thinkers, topics, onTopicClick, onEditTopic, onDeleteTopic, onRemoveMember, onCreateConversationClick, isLoading, error }) => {
    return (
        <div className="grid grid-cols-4 gap-4 mt-4"> 

            {/* <Innovators /> */}
            <div className="col-span-1">
                <div className='border rounded-lg p-3'>
                    <h2 className="text-md font-semibold mb-2">Innovators Hub</h2>
                    <div className="space-y-2">
                        {innovators.length > 0 ? (
                            innovators.map(innovator => (
                                <div key={innovator._id} className="bg-card p-2 rounded-lg border flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={innovator.user.profile_image} />
                                            <AvatarFallback>{innovator.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{innovator.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{innovator.designation}</p>
                                        </div>
                                    </div>
                                    <Trash2 color='red' className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onRemoveMember(innovator._id)} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No innovators found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* <Conversations /> */}
            <div className="col-span-2 border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-md font-semibold">Conversations</h2>
                    <Plus className="h-5 w-5 cursor-pointer" onClick={onCreateConversationClick} />
                </div>
                {isLoading && <p>Loading conversations...</p>}
                {error && <p className="text-red-500">Error loading conversations.</p>}
                {!isLoading && !error && <ConversationTopics topics={topics} onTopicClick={onTopicClick} onEditTopic={onEditTopic} onDeleteTopic={onDeleteTopic} />}
            </div>

            {/* <Innovators /> */}
            <div className="col-span-1">
                <div className='border rounded-lg p-3'>
                    <h2 className="text-md font-semibold mb-2">Critical Thinkers</h2>
                    <div className="space-y-2">
                        {thinkers.length > 0 ? (
                            thinkers.map(thinker => (
                                <div key={thinker._id} className="bg-card p-2 rounded-lg border flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={thinker.user.profile_image } />
                                            <AvatarFallback>{thinker.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{thinker.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{thinker.designation}</p>
                                        </div>
                                    </div>
                                    <Trash2 color='red' className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onRemoveMember(thinker._id)} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No critical thinkers found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionContent;
