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
// import { UploadCloud, Folder } from "lucide-react";
// import { useCreateProjectDocumentMutation } from "@/lib/features/api/projectApi";
// import { useParams } from "next/navigation";
// import { formatFileName } from "@/lib/utils";

// const formSchema = z.object({
//   project_document: z.any()
//     .refine((file) => file, "File is required.")
//     .refine((file) => file?.size <= 10 * 1024 * 1024, `File size should be less than 10MB.`)
//     .refine(
//       (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.type),
//       "Only .jpg, .jpeg, .png and .webp formats are supported."
//     ),
// });

// export default function UploadDocumentModal({ isOpen, onOpenChange }) {
//   const params = useParams();
//   const projectId = params.id;

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//   });

//   const [createProjectDocument, { isLoading }] = useCreateProjectDocumentMutation();

//   const onSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append("project_ducument", values.project_document);

//     try {
//       await createProjectDocument({ id: projectId, data: formData }).unwrap();
//       toast.success("Document uploaded successfully!");
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to upload document.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Upload Document</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <FormField
//               control={form.control}
//               name="project_document"
//               render={({ field: { value, onChange, ...fieldProps } }) => (
//                 <FormItem>
//                   <FormLabel>Document File</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       {/* Actual file input, which is visually hidden but functional */}
//                       <Input
//                         {...fieldProps}
//                         type="file"
//                         accept="image/jpeg,image/jpg,image/png,image/webp"
//                         onChange={(event) => {
//                           onChange(event.target.files && event.target.files[0]);
//                         }}
//                         className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
//                       />
//                       {/* Custom design for the file input */}
//                       <div
//                         className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
//                         onClick={() => document.getElementById(fieldProps.id).click()}
//                       >
//                         {value ? (
//                           <>
//                             <Folder className="h-8 w-8 text-muted-foreground mb-2" />
//                             <p className="text-sm font-medium">{formatFileName(value.name, 10)}</p>
//                           </>
//                         ) : (
//                           <>
//                             <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
//                             <p className="text-sm text-gray-500">Drag and drop a file or click to browse</p>
//                           </>
//                         )}
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
//               <Button loading={isLoading} type="submit" disabled={!form.formState.isValid || isLoading}>
//                 Upload Document
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
