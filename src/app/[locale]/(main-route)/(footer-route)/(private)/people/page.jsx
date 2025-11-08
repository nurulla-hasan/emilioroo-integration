"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/components/common/CustomPagination";
import { Search, Sparkles } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PeopleCardSkeleton from "@/components/skeleton/PeopleCardSkeleton";
import PeopleCard from "@/components/people/PeopleCard";
import LoadFailed from "@/components/common/LoadFailed";
import { useGetUsersWithoutMe } from "@/hooks/useGetUsersWithoutMe";
import NoData from "@/components/common/NoData";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";
import { useTranslations } from "next-intl";

const PeoplePage = () => {
    const t = useTranslations('PeoplePage');
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(15);

    const { users, isLoading, isError, totalPages } = useGetUsersWithoutMe(currentPage, pageSize, searchTerm);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const breadcrumbLinks = [
        { name: t('home'), href: '/' },
        { name: t('people'), href: '/people', isCurrent: true },
    ]

    return (
        <div className="relative min-h-minus-header overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
            <div className="pointer-events-none absolute -left-32 top-24 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/20" />
            <div className="pointer-events-none absolute -right-32 bottom-12 h-72 w-72 rounded-full bg-fuchsia-200/50 blur-3xl dark:bg-fuchsia-500/20" />

            <PageLayout className="pb-0 md:pb-0">
                <div className="relative z-10 space-y-10">
                    <CustomBreadcrumb links={breadcrumbLinks} />

                    <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-xs backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600 dark:text-sky-300">
                                    <Sparkles className="h-4 w-4" />
                                    {t('people')}
                                </span>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                    <span className="bg-gradient-to-r from-sky-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                        {t('findPeople')}
                                    </span>
                                </h1>
                                <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                                    Discover inspiring profiles from across the community and create meaningful connections.
                                </p>
                            </div>
                            <div className="relative w-full md:max-w-sm">
                                <Search className="text-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    type="text"
                                    placeholder={t('search')}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="h-12 rounded-2xl border bg-white/80 ps-10 text-sm shadow-xs backdrop-blur transition focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/40 bg-white/75 p-6 shadow-xs backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {isLoading ? (
                                <PeopleCardSkeleton count={12} />
                            ) : isError ? (
                                <div className="col-span-full flex min-h-[200px] items-center justify-center">
                                    <LoadFailed msg={t("failedToLoad")} />
                                </div>
                            ) : users.length === 0 ? (
                                <div className="col-span-full flex min-h-[200px] items-center justify-center">
                                    <NoData msg={t("noUsersFound")} />
                                </div>
                            ) : (
                                users.map((user) => (
                                    <PeopleCard
                                        key={user._id}
                                        user={user}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center pb-6">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </PageLayout>
        </div>
    );
};

export default PeoplePage;