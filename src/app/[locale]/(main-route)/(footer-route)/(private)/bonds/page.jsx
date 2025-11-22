'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCreateRequestBondMutation, useGetLastBondLocationQuery } from '@/lib/features/api/bondsApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PageLayout from '@/components/layout/PageLayout';
import Title from '@/components/ui/Title';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowBigRight } from 'lucide-react';
import MatchingBondsModal from '@/components/bonds/MatchingBondsModal';
import CustomBreadcrumb from '@/components/common/CustomBreadcrumb';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/navigation';

const MapPicker = dynamic(() => import('@/components/bonds/all-bonds/my-bonds/MapPicker'), { ssr: false });

const defaultLocation = { lat: -34.6037, lng: -58.3816 };

const Bonds = () => {
  const t = useTranslations('AddNewBondModal');
  const bondsT = useTranslations('Bonds');
  const pageT = useTranslations('BondPage');
  const [selectLocation, setSelectLocation] = useState(false);

  const { data: lastBondData } = useGetLastBondLocationQuery();
  const fetchedLocation = lastBondData?.data?.location?.coordinates
    ? { lat: lastBondData.data.location.coordinates[1], lng: lastBondData.data.location.coordinates[0] }
    : null;
  const hasLastLocation = !!fetchedLocation;
  const requireLocation = !hasLastLocation || selectLocation;

  // Make location optional in schema; we'll enforce conditionally in onSubmit
  const formSchema = z.object({
    offer: z.string().min(1, { message: t('offerIsRequired') }),
    want: z.string().min(1, { message: t('wantIsRequired') }),
    description: z.string().min(1, { message: pageT('descriptionIsRequired') }),
    tag: z.string(),
    radius: z.coerce.number().min(1, { message: pageT('radiusPositive') }),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .nullable(),
  });

  const [createRequestBond, { isLoading }] = useCreateRequestBondMutation();

  // State for MatchingBondsModal
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [newlyCreatedBondId, setNewlyCreatedBondId] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      offer: '',
      want: '',
      description: '',
      tag: '',
      radius: 20,
      location: defaultLocation,
    },
  });

  const { reset, setValue, watch, formState: { errors } } = form;
  const location = watch('location');

  useEffect(() => {
    if (hasLastLocation && !selectLocation) {
      if (!location || location.lat !== fetchedLocation.lat || location.lng !== fetchedLocation.lng) {
        setValue('location', fetchedLocation, { shouldValidate: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLastLocation, fetchedLocation?.lat, fetchedLocation?.lng, selectLocation]);

  const onLocationChange = useCallback((loc) => {
    setValue('location', loc, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (values) => {
    if (requireLocation && !values.location) {
      toast.error(pageT('locationRequired'));
      return;
    }

    const newBond = {
      offer: values.offer,
      want: values.want,
      description: values.description,
      tag: values.tag,
      radius: values.radius,
    };

    if (hasLastLocation && !selectLocation) {
      newBond.location = {
        type: 'Point',
        coordinates: [fetchedLocation.lng, fetchedLocation.lat],
      };
    } else if (values.location) {
      newBond.location = {
        type: 'Point',
        coordinates: [values.location.lng, values.location.lat],
      };
    }

    try {
      const response = await createRequestBond(newBond).unwrap();
      toast.success(pageT('bondCreatedSuccess'));
      reset();

      if (response?.data?._id) {
        setNewlyCreatedBondId(response.data._id);
        setIsMatchModalOpen(true);
      } else {
        console.warn("Created bond ID not found in response:", response);
      }

    } catch (error) {
      toast.error(error?.data?.message || pageT('bondCreatedError'));
    }
  };

  const breadcrumbLinks = [
    { name: pageT('home'), href: "/" },
    { name: pageT('bonds'), isCurrent: true }
  ];

  return (
    <div className="relative min-h-minus-header overflow-hidden bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute -bottom-36 -right-16 h-80 w-80 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/15" />

      <PageLayout className="relative z-10 space-y-10">
        <CustomBreadcrumb links={breadcrumbLinks} />
        <div className="flex md:flex-row flex-col gap-2 justify-between items-center mb-6">
          <Title>{bondsT('exchangeServicesGoods')}</Title>
          <Link href="/bonds/all-bonds">
            <Button>
              {bondsT('allBonds')} <ArrowBigRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex justify-center items-center md:p-6">
          <Card className="w-full max-w-[1400px] p-3 md:p-6 dark:bg-transparent">
            <Title>{t('createANewBond')}</Title>
            <CardContent className="p-0 pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="offer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('offer')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('exampleLaptop')}
                              {...field}
                              aria-invalid={errors.offer ? 'true' : 'false'}
                              className={errors.offer ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <div className="flex gap-2 mt-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setValue('offer', 'empty')}>{pageT('empty')}</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setValue('offer', 'surprise')}>{pageT('surprise')}</Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="want"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('want')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('exampleCamera')}
                              {...field}
                              aria-invalid={errors.want ? 'true' : 'false'}
                              className={errors.want ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <div className="flex gap-2 mt-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setValue('want', 'empty')}>{pageT('empty')}</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setValue('want', 'surprise')}>{pageT('surprise')}</Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('description')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('tellUsMore')}
                            {...field}
                            aria-invalid={errors.description ? 'true' : 'false'}
                            className={errors.description ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('tag')} <span className="text-muted-foreground">({t('forBetterMatching')})</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('exampleElectronics')}
                            {...field}
                            aria-invalid={errors.tag ? 'true' : 'false'}
                            className={errors.tag ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>{pageT('changeLocation')}</FormLabel>
                    {hasLastLocation && !selectLocation && (
                      <div className="mb-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectLocation(true);
                            setValue('location', fetchedLocation || defaultLocation, { shouldValidate: false });
                          }}
                        >
                          {pageT('changeLocation')}
                        </Button>
                      </div>
                    )}
                    {(!hasLastLocation || selectLocation) && (
                      <FormControl>
                        <div className="rounded-md overflow-hidden border h-80 md:h-[500px]">
                          <MapPicker
                            onLocationChange={onLocationChange}
                            center={location || fetchedLocation || defaultLocation}
                          />
                        </div>
                      </FormControl>
                    )}
                    <FormMessage>{errors.location?.message}</FormMessage>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{bondsT('radiusKm')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            aria-invalid={errors.radius ? 'true' : 'false'}
                            className={errors.radius ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-4 justify-end">
                    <p className='text-sm text-muted-foreground'>{pageT('createBondRequestHint')}</p>
                    <Button loading={isLoading} type="submit" disabled={isLoading}>
                      {t('createBond')}
                    </Button>
                  </div>
                </form>
              </Form>
          </CardContent>
        </Card>
      </div>

        <MatchingBondsModal
          isOpen={isMatchModalOpen}
          onOpenChange={setIsMatchModalOpen}
          bondRequestId={newlyCreatedBondId}
        />
      </PageLayout>
    </div>
  );
}

export default Bonds;