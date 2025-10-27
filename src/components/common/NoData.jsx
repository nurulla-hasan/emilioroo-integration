import Image from 'next/image';
import { useTranslations } from 'next-intl';

const NoData = () => {
    const t = useTranslations('NoData');
    return (
        <>
            <div className='col-span-full flex flex-col justify-center items-center h-[55vh]'>
                <Image src="/images/folder.png" alt="No joined projects" width={150} height={150} className="mx-auto" priority />
                <span className='text-primary dark:text-white text-sm md:text-lg'>{t('noData')}</span>
            </div>
        </>
    );
};

export default NoData;