// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useState, useRef } from "react";
// import { toast } from "sonner";
// import { Image as ImageIcon } from 'lucide-react';
// import { useCreateReplyMutation } from "@/lib/features/api/InstitutionApi";
// import Image from "next/image";

// const ReplyForm = ({ parentId, conversationId, onReplyCreated, onReplySubmitted }) => {
//     const [text, setText] = useState("");
//     const [image, setImage] = useState(null);
//     const [createReply, { isLoading }] = useCreateReplyMutation();
//     const fileInputRef = useRef(null);

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         if (image) {
//             formData.append("comment_image", image);
//         }
//         formData.append("data", JSON.stringify({ text, parent: parentId, conversation: conversationId }));

//         try {
//             await createReply(formData).unwrap();
//             toast.success("Reply created successfully!");
//             setText("");
//             setImage(null);
//             if (onReplyCreated) {
//                 onReplyCreated();
//             }
//             if (onReplySubmitted) {
//                 onReplySubmitted();
//             }
//         } catch (error) {
//             console.error("Failed to create reply:", error);
//             toast.error(error?.data?.message || "Failed to create reply.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="w-full">
//             <Textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Write a reply..."
//                 className="max-h-28"
//             />
//             {image && (
//                 <div className="mt-2 relative h-12 w-12">
//                     <Image src={URL.createObjectURL(image)} fill alt="Selected image" className=" object-cover rounded-lg" />
//                 </div>
//             )}
//             <div className="flex justify-between items-center">
//                 <ImageIcon className="h-5 w-5 cursor-pointer" onClick={() => fileInputRef.current.click()} />
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     className="hidden"
//                     accept="image/*"
//                 />
//                 <Button loading={isLoading} type="submit" disabled={isLoading || !text.trim()} className="mt-2">
//                     Reply
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default ReplyForm;
