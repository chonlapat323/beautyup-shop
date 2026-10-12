import { notFound } from "next/navigation";

// Unknown paths can't be prerendered (the header reads the URL), so render on request
export const instant = false;

// Unknown paths under a language render the localized 404 page
export default function CatchAll() {
  notFound();
}
