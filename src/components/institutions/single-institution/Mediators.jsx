// "use client";

// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const Mediators = ({ mediators }) => {
//     return (
//         <div className="bg-card p-4 rounded-lg border">
//             <h2 className="text-lg font-semibold mb-4">Mediators</h2>
//             <div className="flex justify-around">
//                 {mediators.map(mediator => (
//                     <div key={mediator._id} className="flex flex-col items-center">
//                         <Avatar className="h-12 w-12">
//                             <AvatarImage src={mediator.user.profile_image} />
//                             <AvatarFallback>{mediator.user.name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <p className="mt-2 text-sm font-semibold">{mediator.user.name}</p>
//                         <p className="text-xs text-muted-foreground">{mediator.designation}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Mediators;
