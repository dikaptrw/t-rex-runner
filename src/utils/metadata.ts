import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { Twitter } from "next/dist/lib/metadata/types/twitter-types";

export const type = "website";
export const title = "T-Rex Runner - Play t-rex runner game online for free";
export const url = "https://snake.dikaptrw.com/";
export const description =
  "Play t-rex runner game online for free. No sign up required.";
export const imageUrl = `/seo.webp`;
export const imageType = "image/webp";
export const imageWidth = "1200";
export const imageHeight = "630";
export const twitterSite = "@dikaptrw";
export const twitterCard = "summary_large_image";

interface CustomMetadata extends Metadata {
  openGraph: {
    type?: string;
    width?: string | number;
    height?: string | number;
  } & OpenGraph;
  twitter: {
    url: string | URL;
    card?: "summary_large_image" | "summary" | "player" | "app" | undefined;
  } & Twitter;
}

export const getGlobalMetadata = (meta?: CustomMetadata): Metadata => {
  return {
    ...meta,
    metadataBase: new URL(url),
    title: meta?.title ?? title,
    description: meta?.description ?? description,
    keywords: [
      "portfolio",
      "website",
      "web",
      "developer",
      "front-end",
      "front",
      "end",
      "dika",
      "putra",
    ],
    openGraph: {
      url: meta?.openGraph.url ?? url,
      type: type,
      images: [
        {
          url: meta?.openGraph?.url ?? imageUrl,
          type: meta?.openGraph?.type ?? imageType,
          width: meta?.openGraph?.width ?? imageWidth,
          height: meta?.openGraph?.height ?? imageHeight,
        },
      ],
    },
    twitter: {
      card: meta?.twitter?.card ?? twitterCard,
      site: meta?.twitter?.site ?? twitterSite,
      title: meta?.twitter?.title ?? title,
      description: meta?.twitter?.description ?? description,
      images: [
        {
          url: meta?.twitter?.url ?? imageUrl,
        },
      ],
    },
    robots: {
      follow: process.env.NEXT_PUBLIC_ENV === "production" ? true : false,
      index: process.env.NEXT_PUBLIC_ENV === "production" ? true : false,
    },
  };
};
