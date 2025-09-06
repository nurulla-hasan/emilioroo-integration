"use client"
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";
import LoadFailed from "@/components/common/LoadFailed";
import PageLayout from "@/components/layout/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPrivacyPolicyQuery } from "@/lib/features/api/legalApi";
import { replaceWhiteBackground } from "@/lib/utils";

const Privacy = () => {
    
    const { data: privacyData, isLoading, isError } = useGetPrivacyPolicyQuery();
    const privacy = privacyData?.data?.description;

    const breadcrumbLinks = [
        { name: 'Home', href: '/' },
        { name: 'Privacy', isCurrent: true },
    ]
    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <CustomBreadcrumb links={breadcrumbLinks} />
                {
                    isLoading ? (
                        <div className="text-lg text-muted-foreground leading-relaxed mt-8">
                            <Skeleton className="h-8 w-1/5 rounded-lg" />
                            <Skeleton className="h-4 w-1/2 rounded-lg mt-2" />
                            <Skeleton className="h-4 w-1/3 rounded-lg mt-2" />
                            <Skeleton className="h-4 w-1/4 rounded-lg mt-2" />
                        </div>
                    ) : isError ? (
                        <LoadFailed msg="Error loading privacy" />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: replaceWhiteBackground(privacy) }} />
                    )
                }
            </PageLayout>
        </div>
    );
};

export default Privacy;