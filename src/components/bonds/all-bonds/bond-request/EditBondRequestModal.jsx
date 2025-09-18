'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useUpdateRequestBondMutation } from '@/lib/features/api/bondsApi';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

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

const MapPicker = dynamic(() => import('../my-bonds/MapPicker'), { ssr: false });

const formSchema = (t) =>
  z.object({
    offer: z.string().min(1, { message: t('offerRequired') }),
    want: z.string().min(1, { message: t('wantRequired') }),
    radius: z.coerce.number().min(1, { message: t('radiusPositive') }),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .nullable()
      .refine((val) => val !== null, { message: t('locationRequired') }),
  });

export default function EditBondRequestModal({ isOpen, onOpenChange, request }) {
  const t = useTranslations('EditBondRequestModal');
  const [updateRequestBond, { isLoading }] = useUpdateRequestBondMutation();

  const form = useForm({
    resolver: zodResolver(formSchema(t)),
    mode: 'onChange',
  });

  const { reset, setValue, watch, formState: { errors } } = form;
  const location = watch('location');

  useEffect(() => {
    if (isOpen && request) {
      reset({
        offer: request.offer,
        want: request.want,
        radius: request.radius,
        location: {
            lat: request.location.coordinates[1],
            lng: request.location.coordinates[0],
        },
      });
    }
  }, [isOpen, request, reset]);

  const onSubmit = async (values) => {
    const updatedBondRequest = {
      offer: values.offer,
      want: values.want,
      location: {
        type: 'Point',
        coordinates: [values.location.lng, values.location.lat],
      },
      radius: values.radius,
    };

    try {
      await updateRequestBond({ id: request._id, data: updatedBondRequest }).unwrap();
      toast.success(t('updateSuccess'));
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.data?.message || t('updateError'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="offer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('offerLabel')}</FormLabel>
                    <FormControl>
                      <Input
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
                    <FormLabel>{t('wantLabel')}</FormLabel>
                    <FormControl>
                      <Input
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
            <FormItem>
              <FormLabel>{t('locationLabel')}</FormLabel>
              <FormControl>
                <div className="rounded-md overflow-hidden border h-64">
                  {isOpen && (
                    <MapPicker
                      onLocationChange={(loc) => setValue('location', loc, { shouldValidate: true })}
                      center={location}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage>{errors.location?.message}</FormMessage>
            </FormItem>
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('radiusLabel')}</FormLabel>
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button loading={isLoading} type="submit" disabled={isLoading}>
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}