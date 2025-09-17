// import React from 'react';
// import ReplyCard from "./ReplyCardComponent";

// const ReplyList = ({ replies, conversationId, onEditClick, onDeleteClick, level = 0 }) => {
//     return (
//         <div className="relative">
//             {level > 0 && <div className="absolute left-4 top-0 h-full border-l-2 border-gray-200 dark:border-gray-700"></div>}
//             <div className="space-y-4">
//                 {replies.map(reply => (
//                     <div key={reply._id} className={`relative ${level > 0 ? 'pl-8' : ''}`}>
//                         <ReplyCard reply={reply} conversationId={conversationId} onEditClick={onEditClick} onDeleteClick={onDeleteClick} level={level} />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ReplyList;
