import Footer from "@/components/common/Footer";

export default function FooterRouteLayout({ children }) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}