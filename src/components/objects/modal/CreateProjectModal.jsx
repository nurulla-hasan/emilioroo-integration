// "use client";

// import { useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Upload } from "lucide-react";
// import { useCreateProjectMutation } from "@/lib/features/api/projectApi";
// import { useTranslations } from "next-intl";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];



// export default function CreateProjectModal({ isOpen, onOpenChange }) {
//   const t = useTranslations('CreateProjectModal');

//   const formSchema = z.object({
//     name: z.string().min(1, { message: t('projectNameRequired') }),
//     description: z.string().min(1, { message: t('descriptionRequired') }),
//     isPublic: z.boolean(),
//     joinControll: z.enum(["Public", "Private"], { message: t('joinControlRequired') }),
//     project_cover:
//       z
//         .any()
//         .refine((files) => files?.length == 1, t('projectCoverRequired'))
//         .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, t('maxImageSize'))
//         .refine(
//           (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//           t('supportedFormats')
//         ),
//   });

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//     defaultValues: {
//       name: "",
//       description: "",
//       isPublic: true,
//       joinControll: "Public",
//       project_cover: undefined,
//     },
//   });

//   const fileInputRef = useRef(null);
//   const [createProject, { isLoading }] = useCreateProjectMutation();

//   useEffect(() => {
//     if (isOpen) {
//       form.reset();
//     }
//   }, [isOpen, form.reset, form]);

//   const onSubmit = async (values) => {
//     const formData = new FormData();
//     if (values.project_cover && values.project_cover[0]) {
//       formData.append("project_cover", values.project_cover[0]);
//     }

//     const data = {
//       name: values.name,
//       description: values.description,
//       isPublic: values.isPublic,
//       joinControll: values.joinControll,
//     };

//     console.log({ data });

//     formData.append("data", JSON.stringify(data));

//     try {
//       await createProject(formData).unwrap();
//       toast.success("Project created successfully!");
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to create project.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>{t('createProject')}</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t('projectName')}</FormLabel>
//                   <FormControl>
//                     <Input placeholder={t('exampleProjectName')} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t('description')}</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder={t('describeProject')} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="isPublic"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>{t('makeProjectPublic')}</FormLabel>
//                     <FormDescription>
//                       {t('anyoneCanView')}
//                     </FormDescription>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="joinControll"
//               render={({ field }) => (
//                 <FormItem className="space-y-3">
//                   <FormLabel>{t('joinControl')}</FormLabel>
//                   <FormControl>
//                     <RadioGroup
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       className="flex flex-col space-y-1"
//                     >
//                       <FormItem className="flex items-center space-x-3 space-y-0">
//                         <FormControl>
//                           <RadioGroupItem value="Public" />
//                         </FormControl>
//                         <FormLabel className="font-normal">
//                           {t('public')}
//                         </FormLabel>
//                       </FormItem>
//                       <FormItem className="flex items-center space-x-3 space-y-0">
//                         <FormControl>
//                           <RadioGroupItem value="Private" />
//                         </FormControl>
//                         <FormLabel className="font-normal">
//                           {t('private')}
//                         </FormLabel>
//                       </FormItem>
//                     </RadioGroup>
//                   </FormControl>
//                   <FormDescription>
//                     {t('controlWhoCanJoin')}
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="project_cover"
//               render={({ field: { value, onChange, ...fieldProps } }) => (
//                 <FormItem>
//                   <FormLabel>{t('projectCoverImage')}</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...fieldProps}
//                       type="file"
//                       accept="image/jpeg, image/jpg, image/png, image/webp"
//                       onChange={(event) => {
//                         onChange(event.target.files);
//                       }}
//                       ref={fileInputRef}
//                       className="hidden" // Hide the default file input
//                     />
//                   </FormControl>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full flex items-center justify-center gap-2"
//                   >
//                     <Upload className="h-4 w-4" />
//                     <span className="truncate overflow-hidden whitespace-nowrap">
//                       {value?.[0]?.name?.length > 17
//                         ? `${value[0].name.slice(0, 17)}...${value[0].name.slice(-10)}`
//                         : value?.[0]?.name || t('uploadImage')}
//                     </span>
//                   </Button>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter>
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   {t('cancel')}
//                 </Button>
//               </DialogClose>
//               <Button loading={isLoading} type="submit" disabled={!form.formState.isValid || isLoading}>
//                 {t('createProjectButton')}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }