import PrivateRoute from "@/components/auth/PrivateRoute";

export default function PrivateRouteLayout({ children }) {
    return (
        <>
            <PrivateRoute>
                {children}
            </PrivateRoute>
        </>
    );
}