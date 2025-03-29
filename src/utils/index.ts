import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts
 * @param classValue string | number | bigint | boolean | ClassArray | ClassDictionary | null | undefined
 */
export function cn(...classValue: ClassValue[]) {
  return twMerge(clsx(classValue));
}
