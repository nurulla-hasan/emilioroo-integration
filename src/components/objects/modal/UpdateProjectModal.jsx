"use client";

import { useRef, useEffect } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";
import { useUpdateProjectMutation } from "@/lib/features/api/projectApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  isPublic: z.boolean(),
  joinControll: z.enum(["Public", "Private"], { message: "Join control is required." }),
  project_cover:
    z
      .any()
      .optional() // Make project_cover optional for update
      .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
});

export default function UpdateProjectModal({ isOpen, onOpenChange, project }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      isPublic: project?.isPublic || false,
      joinControll: project?.joinControll || "Public",
      project_cover: undefined,
    },
  });

  const fileInputRef = useRef(null);
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        name: project.name,
        description: project.description,
        isPublic: project.isPublic,
        joinControll: project.joinControll,
        project_cover: undefined,
      });
    }
  }, [isOpen, project, form.reset, form]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    if (values.project_cover && values.project_cover[0]) {
      formData.append("project_cover", values.project_cover[0]);
    }

    const data = {
      name: values.name,
      description: values.description,
      isPublic: values.isPublic,
      joinControll: values.joinControll,
    };

    formData.append("data", JSON.stringify(data));

    try {
      await updateProject({ id: project._id, formData }).unwrap();
      toast.success("Project updated successfully!");
      onOpenChange(false);
      // No form.reset() here, as we want to keep the updated values in the form
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update project.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Awesome Project" {...field} />
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
                    <Textarea placeholder="Describe your project..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make Project Public</FormLabel>
                    <FormDescription>
                      Anyone can view this project.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joinControll"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Join Control</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} // Use value instead of defaultValue for controlled component
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Public" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Public
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Private" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Private
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Control who can join your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_cover"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Project Cover Image</FormLabel>
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
                    {value?.[0]?.name?.length > 20
                      ? `${value[0].name.slice(0, 30)}...${value[0].name.slice(-10)}`
                      : value?.[0]?.name || (project?.cover_image ? "Change Image" : "Upload Image")
                    }
                  </Button>
                  {project?.cover_image && !value && (
                    <FormDescription>
                      Current image: {
                        project.cover_image.split('/').pop().length > 40
                          ? `${project.cover_image.split('/').pop().slice(0, 30)}...${project.cover_image.split('/').pop().slice(-10)}`
                          : project.cover_image.split('/').pop()
                      }
                    </FormDescription>
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
              <Button loading={isLoading} type="submit" disabled={!form.formState.isValid || isLoading}>
                Update Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}