import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { query } = parse(req.url || "/", true);
  const {
    eyebrow = "",
    heading = "",
    fontSize,
    images,
    widths,
    heights,
    theme,
    md,
    ext = "png",
  } = query || {};

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }

  const parsedRequest: ParsedRequest = {
    fileType: ext === "jpeg" ? ext : "png",
    text: decodeURIComponent(heading as string),
    eyebrow: decodeURIComponent(eyebrow as string),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  const defaultImage =
    theme === "light"
      ? "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg"
      : "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg";

  if (!images || !images[0]) {
    return [defaultImage];
  }
  if (
    !images[0].startsWith("https://assets.vercel.com/") &&
    !images[0].startsWith("https://assets.zeit.co/")
  ) {
    images[0] = defaultImage;
  }
  return images;
}
