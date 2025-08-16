"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Plus } from 'lucide-react';
import UploadAudioModal from './UploadAudioModal';
import MostPlayedContent from './all-content/MostPlayedContent';
import TrendingTopicsContent from './all-content/TrendingTopicsContent';
import ConversionContent from './all-content/ConversionContent';
import { useTranslations } from "next-intl";

const AllContent = () => {
    const t = useTranslations('Chatting');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold text-primary dark:text-white">{t('realConversation')}</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsModalOpen(true)}><Plus /> {t('uploadNewAudio')}</Button>
                    <Button variant="outline">
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
