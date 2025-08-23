'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCreateRequestBondMutation } from '@/lib/features/api/bondsApi';
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
import Link from 'next/link';
import { ArrowBigRight } from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/bonds/all-bonds/my-bonds/MapPicker'), { ssr: false });

const defaultLocation = { lat: -34.6037, lng: -58.3816 };

const formSchema = z.object({
    offer: z.string().min(1, { message: 'Offer is required.' }),
    want: z.string().min(1, { message: 'Want is required.' }),
    tag: z.string().min(1, { message: 'Tag is required.' }),
    radius: z.coerce.number().min(1, { message: 'Radius must be a positive number.' }),
    location: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .nullable()
        .refine((val) => val !== null, { message: 'Please select a location from the map.' }),
});

const Bonds = () => {
    const t = useTranslations('AddNewBondModal');
    const bondsT = useTranslations('Bonds');
    const [createRequestBond, { isLoading }] = useCreateRequestBondMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            offer: '',
            want: '',
            tag: '',
            radius: 5,
            location: defaultLocation,
        },
    });

    const { reset, setValue, watch, formState: { errors } } = form;
    const location = watch('location');

    const onLocationChange = useCallback((loc) => {
        setValue('location', loc, { shouldValidate: true });
    }, [setValue]);

    const onSubmit = async (values) => {
        const newBond = {
            offer: values.offer,
            want: values.want,
            tag: values.tag,
            location: {
                type: 'Point',
                coordinates: [values.location.lng, values.location.lat],
            },
            radius: values.radius,
        };

        try {
            await createRequestBond(newBond).unwrap();
            toast.success('Bond created successfully!');
            reset();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to create bond.');
        }
    };

    return (
        <PageLayout>
            <div className="flex md:flex-row flex-col gap-2 justify-between items-center mb-6">
                <Title>{bondsT('exchangeServicesGoods')}</Title>
                <Link href="/bonds/all-bonds">
                    <Button>
                        {bondsT('allBonds')} <ArrowBigRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="flex justify-center items-center md:p-6">
                <Card className="w-full max-w-4xl p-3 md:p-6">
                    <Title>{bondsT('createANewBondRequest')}</Title>
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                    <FormLabel>Select Location</FormLabel>
                                    <FormControl>
                                        <div className="rounded-md overflow-hidden border h-64">
                                            <MapPicker
                                                onLocationChange={onLocationChange}
                                                center={location}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage>{errors.location?.message}</FormMessage>
                                </FormItem>
                                <FormField
                                    control={form.control}
                                    name="radius"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Radius (km)</FormLabel>
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
                                    <p className='text-sm text-muted-foreground'>Create a bond request and see matching bonds.</p>
                                    <Button loading={isLoading} type="submit" disabled={isLoading}>
                                        {t('createBond')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
}

export default Bonds;
