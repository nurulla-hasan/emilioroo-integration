"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { useGetAllUsersQuery } from "@/lib/features/api/projectApi";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { useTranslations } from "next-intl";

const GlobalSearch = ({ isMobile = false }) => {
    const t = useTranslations("Navbar");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);

    const { data: searchResults, isLoading: isSearchLoading } = useGetAllUsersQuery(
        [{ name: "searchTerm", value: debouncedSearchTerm }],
        { skip: !debouncedSearchTerm }
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleClear = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
    };

    const inputClasses = isMobile
        ? "peer ps-9 placeholder:text-white placeholder:text-xs text-white border-none bg-white/5 rounded-full"
        : "w-50 ps-9 placeholder:text-white placeholder:text-xs text-white border-none bg-white/5 rounded-full";

    return (
        <div className="relative" ref={searchRef}>
            <Input
                className={inputClasses}
                placeholder={t('search')}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
            />
            <div className="text-white pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} />
            </div>
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center justify-center pe-3 text-white"
                >
                    <X size={16} />
                </button>
            )}

            {isFocused && debouncedSearchTerm && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                    {isSearchLoading && <p className="p-4 text-sm text-gray-500">{t('loading')}</p>}
                    {!isSearchLoading && searchResults?.data?.result?.length === 0 && (
                        <p className="p-4 text-sm text-gray-500">{t('noUsersFound')}</p>
                    )}
                    {searchResults?.data?.result?.map(user => (
                        <Link href={`/people/${user._id}`} key={user._id} onClick={() => setIsFocused(false)}>
                            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.profile_image} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;