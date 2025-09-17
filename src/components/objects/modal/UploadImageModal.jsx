// "use client";

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
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Image as IconImage, UploadCloud } from "lucide-react";
// import { useCreateProjectImageMutation, useCheckImageMutation } from "@/lib/features/api/projectApi";
// import { useParams } from "next/navigation";
// import React, { useRef } from "react";
// import { formatFileName } from "@/lib/utils";

// const formSchema = z.object({
//   project_image: z.any()
//     .refine((file) => file, "File is required.")
//     .refine((file) => file?.size <= 5 * 1024 * 1024, `File size should be less than 5MB.`) // 5MB
//     .refine(
//       (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
//       "Only .jpg, .jpeg, .png and .webp formats are supported."
//     ),
// });

// export default function UploadImageModal({ isOpen, onOpenChange }) {
//   const params = useParams();
//   const projectId = params.id;
//   const fileInputRef = useRef(null);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//   });

//   const [createProjectImage, { isLoading }] = useCreateProjectImageMutation();
//   const [checkImage, { isLoading: isCheckingImage }] = useCheckImageMutation();

//   const handleFileAnalysis = async (event) => {
//     const file = event.target.files && event.target.files[0];
//     if (!file) return;

//     const imageFormData = new FormData();
//     imageFormData.append('image_file', file);

//     try {
//       toast.info("Analyzing image, please wait...");
//       const result = await checkImage(imageFormData).unwrap();

//       if (result.output !== 0) {
//         toast.error("This image cannot be uploaded.", {
//           description: result.message || "The image content does not meet the requirements.",
//         });
//         form.setValue('project_image', null, { shouldValidate: true });
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//         return;
//       }

//       toast.success("Image analysis passed!");
//       form.setValue('project_image', file, { shouldValidate: true });

//     } catch (error) {
//       console.log(error)
//       toast.error("Failed to analyze image", {
//         description: error?.data?.message || "An error occurred during analysis.",
//       });
//       form.setValue('project_image', null, { shouldValidate: true });
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   const onSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append("project_image", values.project_image);

//     try {
//       await createProjectImage({ id: projectId, data: formData }).unwrap();
//       toast.success("Image uploaded successfully!");
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to upload image.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Upload Image</DialogTitle>
//           <DialogDescription className="sr-only">Upload an image for your object.</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <FormField
//               control={form.control}
//               name="project_image"
//               render={({ field: { value, ...fieldProps } }) => (
//                 <FormItem>
//                   <FormLabel>Image File</FormLabel>
//                   <FormControl>
//                     <div>
//                       <Input
//                         {...fieldProps}
//                         type="file"
//                         accept="image/jpeg,image/jpg,image/png,image/webp"
//                         onChange={handleFileAnalysis}
//                         disabled={isCheckingImage}
//                         className="hidden"
//                         ref={fileInputRef}
//                       />
//                       <div
//                         className="flex flex-col items-center justify-center w-full p-6 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
//                         onClick={() => !isCheckingImage && fileInputRef.current?.click()}
//                       >
//                         <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
//                         {!value && <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>}
//                         {value && <>
//                           <p className="text-sm text-center text-primary mt-1">
//                             <IconImage className="h-8 w-8 text-muted-foreground mb-2" />
//                           </p>
//                           {formatFileName(value.name, 10)}
//                           </>}
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter>
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <Button loading={isLoading || isCheckingImage} type="submit" disabled={!form.formState.isValid || isLoading || isCheckingImage}>
//                 {isCheckingImage ? "Analyzing..." : "Upload Image"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }