"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as IconImage, UploadCloud } from "lucide-react";
import { useCreateProjectImageMutation } from "@/lib/features/api/projectApi";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import { formatFileName } from "@/lib/utils";

const formSchema = z.object({
  project_image: z.any()
    .refine((file) => file, "File is required.")
    .refine((file) => file?.size <= 5 * 1024 * 1024, `File size should be less than 5MB.`) // 5MB
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function UploadImageModal({ isOpen, onOpenChange }) {
  const params = useParams();
  const projectId = params.id;
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [createProjectImage, { isLoading }] = useCreateProjectImageMutation();

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("project_image", values.project_image);

    try {
      await createProjectImage({ id: projectId, data: formData }).unwrap();
      toast.success("Image uploaded successfully!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload image.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="project_image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(event) => onChange(event.target.files && event.target.files[0])}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <div
                        className="flex flex-col items-center justify-center w-full p-6 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        {!value && <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>}
                        {value && <>
                          <p className="text-sm text-center text-primary mt-1">
                            <IconImage className="h-8 w-8 text-muted-foreground mb-2" />
                          </p>
                          {formatFileName(value.name, 10)}
                          </>}
                      </div>
                    </div>
                  </FormControl>
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
              <Button loading={isLoading} type="submit" disabled={!form.formState.isValid || isLoading}>
                Upload Image
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
