// "use client";

// import React from 'react';
// import Image from 'next/image';
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Users, Pencil, Trash2 } from 'lucide-react';

// const MyInstitutionCard = ({ institution, onEdit, onDelete }) => {
//     const handleNavigate = () => {
//         window.location.href = `/institutions/${institution._id}`;
//     };

//     return (
//         <Card className="w-full overflow-hidden bg-card flex flex-col">
//             <CardHeader className="p-0 relative h-40">
//                 <div onClick={handleNavigate} className="relative h-40 w-full bg-card border-b cursor-pointer">
//                     <Image
//                         src={
//                             institution?.cover_image || "/placeholder"}
//                         alt={institution?.name || "Institution cover"}
//                         fill
//                         sizes="(max-width: 768px) 100vw, 400px"
//                         className="object-cover"
//                         priority
//                     />
//                 </div>
//             </CardHeader>
//             <CardContent className="p-4 flex flex-col flex-grow">
//                 {/* Title + Description */}
//                 <h3 className="text-[17px] font-semibold text-primary dark:text-white">
//                     {institution?.name}
//                 </h3>
//                 <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow">
//                     {institution?.description}
//                 </p>

//                 {/* Two columns: Innovators Hub | Critical Thinkers */}
//                 <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//                     <div className="flex flex-col">
//                         <span className="font-semibold text-foreground">Innovators Hub</span>
//                         <div className="mt-1 inline-flex items-center gap-1 text-muted-foreground">
//                             <Users className="h-4 w-4" />
//                             <span className="tabular-nums">
//                                 {institution?.participantOfGroupA ?? 0}
//                             </span>
//                             <span>Participants</span>
//                         </div>
//                     </div>

//                     <div className="flex flex-col items-end">
//                         <span className="font-semibold text-foreground">Critical Thinkers</span>
//                         <div className="mt-1 inline-flex items-center gap-1 text-muted-foreground">
//                             <Users className="h-4 w-4" />
//                             <span className="tabular-nums">
//                                 {institution?.participantOfGroupB ?? 0}
//                             </span>
//                             <span>Participants</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-4 flex gap-2">
//                     {
//                         institution.isCreator && (
//                             <Button
//                                 size={"sm"}
//                                 className="flex-1"
//                                 onClick={() => onEdit?.(institution)}
//                             >
//                                 <Pencil className="h-4 w-4 mr-2" /> Edit
//                             </Button>
//                         )
//                     }
//                     <Button
//                         variant="outline"
//                         size={"sm"}
//                         className="flex-1"
//                         onClick={() => onDelete?.(institution._id)}
//                     >
//                         <Trash2 className="h-4 w-4 mr-2" /> Delete
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default MyInstitutionCard;