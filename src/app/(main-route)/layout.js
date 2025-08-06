import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";


export default function MainRouteLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer/>
        </>
    );
}