import ConversationAudioCardSkeleton from '@/components/skeleton/ConversationAudioCardSkeleton';
import { Button } from '@/components/ui/button';
import { useGetAllAudioQuery } from '@/lib/features/api/chattingApi';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import TrendingAudioCard from '../../trending/TrendingAudioCard';
import { useTranslations } from "next-intl";
import Title2 from '@/components/ui/Title2';
import NoData from '@/components/common/NoData';
import LoadFailed from '@/components/common/LoadFailed';

const ConversionContent = () => {
  const t = useTranslations('Chatting');
  const { data, isLoading, isError } = useGetAllAudioQuery();

  const audios = data?.data?.result || [];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Title2>{t('discoverConversations')}</Title2>
        <Link href="/chatting/conversations" passHref>
          <Button variant="ghost" size="sm" className="text-primary dark:text-white">
            {t('seeAll')} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {
          isLoading ? (
            [...Array(4)].map((_, index) => (
              <ConversationAudioCardSkeleton key={index} />
            ))
          ) : isError ? (
            <div className="col-span-full mx-auto">
              <LoadFailed msg={t('errorLoadingConversations')} />
            </div>
          ) : audios.length > 0 ? (
            audios.slice(0, 4).map((audio) => (
              <TrendingAudioCard key={audio._id} audio={audio} />
            ))
          ) : (
            <div className="col-span-full mx-auto">
              <NoData msg={t('noConversationsFound')} />
            </div>
          )
        }
      </div>
    </>
  );
};

export default ConversionContent;