"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// cn
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Time Ago
export const  timeAgo =(createdAt)=> {
  if (!createdAt) return ""
  const s = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  if (s < 60) return "Just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// Is New
export function isNew(createdAt, days = 7) {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  const diff = Date.now() - created
  return diff <= days * 24 * 60 * 60 * 1000
}

// Format Duration
export const formatDuration = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "0m";
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format Date
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


// Format File Name
export const formatFileName = (url, len) => {
    const fileName = url.split('/').pop();
    if (fileName.length > len) {
        return `${fileName.slice(0, 5)}...${fileName.slice(-10)}`;
    }
    return fileName;
};

// useAuthRedirect
// export const useAuthRedirect = () => {
//     const router = useRouter();
//     const token =   "jdhsfiuhyfuiewfds"

//     const redirectToAuthPage = (e, targetPath) => {
//         if (!token) {
//             e.preventDefault();
//             toast.error("Please log in to proceed."); 
//             return false;
//         } else {
//             router.push(targetPath);
//             return true;
//         }
//     };

//     return redirectToAuthPage;
// };
