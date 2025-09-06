"use client";
import { clsx } from "clsx";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { twMerge } from "tailwind-merge"

// cn
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fallback Image
export const fallbackAvatar = (gender) => {
  if (gender === 'MALE') {
    return 'https://avatar.iran.liara.run/public/boy';
  } else if (gender === 'FEMALE') {
    return 'https://avatar.iran.liara.run/public/girl';
  } else {
    return '/images/placeholder-image.jpg';
  }
};
export const fallbackAvatar2 = "https://avatar.iran.liara.run/public";

// Time Ago
export const timeAgo = (createdAt) => {
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
    return `${fileName.slice(0, 10)}...${fileName.slice(-10)}`;
  }
  return fileName;
};

// Get Initials
export const getInitials = (str) => {
  if (!str) return "";
  return str
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}


// Get social link

export const getSocialIcon = (url) => {
  if (url.includes("facebook")) return <Facebook className="h-5 w-5" />
  if (url.includes("instagram")) return <Instagram className="h-5 w-5" />
  if (url.includes("x")) return <Twitter className="h-5 w-5" />
  if (url.includes("linkedin")) return <Linkedin className="h-5 w-5" />
  return null
}

// Replace White Background
export const replaceWhiteBackground = (html) => {
  if (!html) return "";

  return html.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleProperties = styleString.split(';').filter(prop => prop.trim() !== '');

    const filteredProperties = styleProperties.filter(prop => {
      const i = prop.indexOf(':');
      if (i === -1) return true;

      const propName = prop.substring(0, i).trim();
      const propValue = prop.substring(i + 1).trim();

      // Exclude 'background-color' only if it's white
      if (propName === 'background-color') {
        const lowerCaseValue = propValue.toLowerCase().replace(/\s/g, '');
        if (
          lowerCaseValue === 'white' ||
          lowerCaseValue === '#fff' ||
          lowerCaseValue === '#ffffff' ||
          lowerCaseValue === 'rgb(255,255,255)'
        ) {
          return false;
        }
      }

      return true;
    });

    if (filteredProperties.length > 0) {
      const newStyleString = filteredProperties.join('; ');
      return `style="${newStyleString};"`;
    } else {
      return '';
    }
  });
};


