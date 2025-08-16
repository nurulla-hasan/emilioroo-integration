"use client"

import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from "lucide-react"
import { useCreateInstitutionMutation } from "@/lib/features/api/InstitutionApi"
import { useTranslations } from "next-intl"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];



export default function CreateInstitutionModal({ isOpen, onOpenChange }) {
  const t = useTranslations('CreateInstitutionModal');

  const formSchema = z.object({
  name: z.string().min(1, { message: t('institutionNameRequired') }),
  description: z.string().min(1, { message: t('descriptionRequired') }),
  facebookLink: z.string().url({ message: t('invalidUrl') }).optional().or(z.literal("")),
  instagramLink: z.string().url({ message: t('invalidUrl') }).optional().or(z.literal("")),
  institution_cover:
    z
      .any()
      .refine((files) => files?.length == 1, t('institutionCoverRequired'))
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, t('maxImageSize'))
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        t('supportedFormats')
      ),
});


  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      facebookLink: "",
      instagramLink: "",
      institution_cover: undefined,
    },
  });

  const fileInputRef = useRef(null);
  const [createInstitution, { isLoading }] = useCreateInstitutionMutation();

  useEffect(() => {
    if (isOpen) {
      form.reset(); 
    }
  }, [isOpen, form.reset, form]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("institution_cover", values.institution_cover[0]);

    const data = {
      name: values.name,
      description: values.description,
      facebookLink: values.facebookLink || undefined, // Send undefined if empty
      instagramLink: values.instagramLink || undefined, // Send undefined if empty
    };
    formData.append("data", JSON.stringify(data));

    try {
      await createInstitution(formData).unwrap();
      toast.success(t('institutionCreatedSuccessfully'));
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || t('failedToCreateInstitution'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createNewInstitution')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('institutionName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('exampleInstitutionName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('describeInstitution')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('facebookLinkOptional')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('facebookPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagramLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('instagramLinkOptional')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('instagramPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution_cover"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t('institutionCoverImage')}</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/jpeg, image/jpg, image/png, image/webp"
                      onChange={(event) => {
                        onChange(event.target.files);
                      }}
                      ref={fileInputRef}
                      className="hidden" // Hide the default file input
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {value && value[0] ? value[0].name : t('uploadImage')}
                  </Button>
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
              <Button type="submit" disabled={!form.formState.isValid || isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />{t('creating')}</> : t('createInstitutionButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}