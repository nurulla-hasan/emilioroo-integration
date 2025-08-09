"use client";

import { useGetSingleInstitutionQuery, useGetAllInstitutionQuery } from "@/lib/features/api/InstitutionApi";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import InstitutionNavCard from "@/components/institutions/all-institutions/InstitutionNavCard";
import InstitutionNavCardSkeleton from "@/components/institutions/all-institutions/InstitutionNavCardSkeleton";

const SingleInstitutionPage = () => {
    const { id } = useParams();
    const { data: singleInstitutionData, isLoading: isSingleInstitutionLoading, isError: isSingleInstitutionError } = useGetSingleInstitutionQuery(id);
    const { data: allInstitutionsData, isLoading: areAllInstitutionsLoading, isError: areAllInstitutionsError } = useGetAllInstitutionQuery();

    const institution = singleInstitutionData?.data;
    const allInstitutions = allInstitutionsData?.data?.result;

    return (
        <div className="min-h-minus-header grid grid-cols-12 gap-8 p-2">
            {/* Sidebar */}
            <div className="hidden lg:block col-span-3 border rounded-lg p-4">
                <div className="flex flex-col gap-2">
                    {areAllInstitutionsLoading && [...Array(5)].map((_, i) => <InstitutionNavCardSkeleton key={i} />)}
                    {areAllInstitutionsError && <p className="text-red-500">Error loading institutions.</p>}
                    {allInstitutions && allInstitutions.map(inst => (
                        <InstitutionNavCard key={inst._id} institution={inst} />
                    ))}
                </div>
            </div>
            {/* Main content */}
            <div className="col-span-12 lg:col-span-9">
                {isSingleInstitutionLoading && <div>Loading...</div>}
                {isSingleInstitutionError && <p className="text-red-500">Error loading institution.</p>}
                {institution && (
                    <>
                        <div className="relative h-48 md:h-64 w-full bg-card">
                            <Image
                                src={institution.cover_image || "/placeholder.png"}
                                alt={institution.name || "Institution cover"}
                                fill
                                className="object-cover rounded-lg"
                                priority
                            />
                        </div>
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <h1 className="text-3xl font-bold text-primary dark:text-white">{institution.name}</h1>
                                <Button className="mt-4 md:mt-0">Join Institution</Button>
                            </div>
                            <p className="mt-4 text-muted-foreground">{institution.description}</p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold text-foreground">Innovators Hub</h2>
                                    <div className="mt-2 inline-flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-5 w-5" />
                                        <span className="tabular-nums">
                                            {institution.participantOfGroupA ?? 0}
                                        </span>
                                        <span>Participants</span>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end">
                                    <h2 className="text-xl font-semibold text-foreground">Critical Thinkers</h2>
                                    <div className="mt-2 inline-flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-5 w-5" />
                                        <span className="tabular-nums">
                                            {institution.participantOfGroupB ?? 0}
                                        </span>
                                        <span>Participants</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SingleInstitutionPage;
