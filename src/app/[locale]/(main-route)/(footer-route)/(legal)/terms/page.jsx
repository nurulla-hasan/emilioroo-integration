import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";
import PageLayout from "@/components/layout/PageLayout";
import Title from "@/components/ui/Title";


const Terms = () => {

    const breadcrumbLinks = [
        { name: 'Home', href: '/' },
        { name: 'Terms', isCurrent: true },
    ]
    return (
        <div className="min-h-minus-header">
            <PageLayout>
                 <CustomBreadcrumb links={breadcrumbLinks} />
                <Title>Terms of Service</Title>
                <p className="text-lg text-muted-foreground leading-relaxed mt-8">
                    These Terms of Service Terms govern your access to and use of our website and services. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
                    We reserve the right to modify these Terms at any time. Your continued use of the services after any such changes constitutes your acceptance of the new Terms.
                </p>
            </PageLayout>
        </div>
    );
};

export default Terms;