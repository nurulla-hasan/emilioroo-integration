"use client";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

// cn
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// useAuthRedirect
export const useAuthRedirect = () => {
    const router = useRouter();
    // useSelector((state) => state.auth.accessToken) ||
    const token =   "jdhsfiuhyfuiewfds"

    const redirectToAuthPage = (e, targetPath) => {
        if (!token) {
            e.preventDefault();
            toast.error("Please log in to proceed."); 
            return false;
        } else {
            router.push(targetPath);
            return true;
        }
    };

    return redirectToAuthPage;
};