"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Plus } from 'lucide-react';
import UploadAudioModal from './UploadAudioModal';
import MostPlayedContent from './all-content/MostPlayedContent';
import TrendingTopicsContent from './all-content/TrendingTopicsContent';
import ConversionContent from './all-content/ConversionContent';
import { useTranslations } from "next-intl";
import Title from '@/components/ui/Title';

const AllContent = () => {
    const t = useTranslations('Chatting');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
                <Title>
                    {t('realConversation')}
                </Title>

                <div className="flex gap-2 justify-center sm:justify-end">
                    <Button onClick={() => setIsModalOpen(true)} >
                        <Plus />
                        {t('uploadNewAudio')}
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setIsModalOpen(true)}>
                        <Mic />
                    </Button>
                </div>
            </div>
            <UploadAudioModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

            {/* Placeholder for content */}
            <div className='space-y-12'>
                <MostPlayedContent />
                <TrendingTopicsContent />
                <ConversionContent />
            </div>
        </>
    );
};

export default AllContent;