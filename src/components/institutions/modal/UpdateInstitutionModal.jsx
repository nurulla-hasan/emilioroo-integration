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
import { useUpdateInstitutionMutation } from "@/lib/features/api/InstitutionApi"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(1, { message: "Institution name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  facebookLink: z.string().url({ message: "Invalid URL." }).optional().or(z.literal("")),
  instagramLink: z.string().url({ message: "Invalid URL." }).optional().or(z.literal("")),
  institution_cover: z
    .any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(), // Make optional for update, as it might not be changed
});

export default function UpdateInstitutionModal({ isOpen, onOpenChange, institution }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: institution?.name || "",
      description: institution?.description || "",
      facebookLink: institution?.facebookLink || "",
      instagramLink: institution?.instagramLink || "",
      institution_cover: undefined,
    },
  });

  const fileInputRef = useRef(null);
  const [updateInstitution, { isLoading }] = useUpdateInstitutionMutation();

  useEffect(() => {
    if (isOpen && institution) {
      form.reset({
        name: institution.name,
        description: institution.description,
        facebookLink: institution.facebookLink,
        instagramLink: institution.instagramLink,
        institution_cover: undefined, // Clear file input on open
      });
    }
  }, [isOpen, institution, form.reset, form]);

  const onSubmit = async (values) => {
    const formData = new FormData();

    if (values.institution_cover && values.institution_cover[0]) {
      formData.append("institution_cover", values.institution_cover[0]);
    }

    const data = {
      name: values.name,
      description: values.description,
      facebookLink: values.facebookLink || undefined, // Send undefined if empty
      instagramLink: values.instagramLink || undefined, // Send undefined if empty
    };
    formData.append("data", JSON.stringify(data));

    try {
      await updateInstitution({ id: institution._id, data: formData }).unwrap();
      toast.success("Institution updated successfully!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update institution.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Institution</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Green University" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your institution..." {...field} />
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
                  <FormLabel>Facebook Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/yourinstitution" {...field} />
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
                  <FormLabel>Instagram Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/yourinstitution" {...field} />
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
                  <FormLabel>Institution Cover Image</FormLabel>
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
                    {value && value[0] ? value[0].name : (institution?.cover_image ? "Change Image" : "Upload Image")}
                  </Button>
                  {institution?.cover_image && !value && (
                    <p className="text-sm text-muted-foreground">Current: {institution.cover_image.split('/').pop()}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!form.formState.isValid || isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Updating</> : "Update Institution"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}