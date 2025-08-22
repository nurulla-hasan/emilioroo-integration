import PrivateRoute from "@/components/auth/PrivateRoute";
import Footer from "@/components/common/Footer";

export default function PrivateRouteLayout({ children }) {
    return (
        <>
            <PrivateRoute>
                {children}
                <Footer />
            </PrivateRoute>
        </>
    );
}