import { useGetMyProfileQuery } from "@/lib/features/api/authApi";
import { useSelector } from "react-redux";

export const useGetMe = () => {
    const { accessToken: token } = useSelector((state) => state.auth);
    const { data: profile, isLoading: profileLoading, isError: profileError } = useGetMyProfileQuery(undefined, { skip: !token });

    return {
        profile,
        profileLoading,
        profileError,
        token
    };
}