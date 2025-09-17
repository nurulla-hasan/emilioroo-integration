// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { MoreHorizontal } from 'lucide-react';
// import { useGetCommentRepliesQuery } from "@/lib/features/api/InstitutionApi";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
// import { timeAgo } from "@/lib/utils";
// import ReplyForm from "./ReplyForm";
// import ReplyList from "./ReplyList";
// import ReplyCardSkeleton from "./ReplyCardSkeleton";

// const ReplyCard = ({ reply, conversationId, onEditClick, onDeleteClick, level = 0 }) => {
//     const [showReplyForm, setShowReplyForm] = useState(false);
//     const { data: repliesData, isLoading: areRepliesLoading, refetch } = useGetCommentRepliesQuery(reply._id, { skip: !showReplyForm });
//     const replies = repliesData?.data?.result;
//     const MAX_NESTING_LEVEL = 3;

//     return (
//         <div className="flex items-start space-x-2 mt-4 relative">
//             <Avatar className="h-8 w-8">
//                 <AvatarImage src={reply.commentorProfileImage} />
//                 <AvatarFallback>{reply.commentorName.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//                 <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
//                     <div className="flex justify-between items-center">
//                         <p className="font-semibold text-sm">{reply.commentorName}</p>

//                     </div>
//                     <p className="text-sm break-words">{reply.text}</p>
//                 </div>
//                 <div className="flex justify-between items-center space-x-4 text-xs text-muted-foreground mt-1 px-3">
//                     {level < MAX_NESTING_LEVEL && (
//                         <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowReplyForm(!showReplyForm)}>
//                             Reply {reply.totalReplies > 0 && `(${reply.totalReplies})`}
//                         </Button>
//                     )}
//                     <div className="text-xs text-muted-foreground flex items-center space-x-2">
//                         <p>{timeAgo(reply.createdAt)}</p>
//                         {reply.isMyComment && (
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" size="sm" className="h-auto p-1">
//                                         <MoreHorizontal className="h-4 w-4" />
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                     <DropdownMenuItem onClick={() => onEditClick(reply)}>
//                                         Edit
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => onDeleteClick(reply)} className="text-red-500">
//                                         Delete
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         )}
//                     </div>
//                 </div>

//                 {showReplyForm && (
//                     <div className="mt-2">
//                         <ReplyForm parentId={reply._id} conversationId={conversationId} onReplyCreated={refetch} onReplySubmitted={() => setShowReplyForm(false)} />
//                     </div>
//                 )}

//                 {areRepliesLoading ? (
//                     <div className={`mt-2 ${level < MAX_NESTING_LEVEL ? '' : ''}`}>
//                         <ReplyCardSkeleton />
//                     </div>
//                 ) : (
//                     replies && replies.length > 0 && (
//                         <div className={`mt-2 ${level < MAX_NESTING_LEVEL ? '-ml-10' : ''}`}>
//                             <ReplyList replies={replies} conversationId={conversationId} onEditClick={onEditClick} onDeleteClick={onDeleteClick} level={level + 1} />
//                         </div>
//                     )
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ReplyCard;
