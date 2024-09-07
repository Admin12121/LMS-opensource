import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const truncateString = (string: string) => {
  return string.slice(0, 60) + "..."
}

export const validateURLString = (url: string) => {
  const youtubeRegex = new RegExp("www.youtube.com")
  const loomRegex = new RegExp("www.loom.com")

  if (youtubeRegex.test(url)) {
    return {
      url,
      type: "YOUTUBE",
    }
  }

  if (loomRegex.test(url)) {
    return {
      url,
      type: "LOOM",
    }
  } else {
    return {
      url: undefined,
      type: "IMAGE",
    }
  }
}
