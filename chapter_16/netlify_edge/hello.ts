// Netlify Edge Function
// Handles requests at the edge, modifying responses or headers

import type { Context, Config } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  // Check for a specific cookie
  const cookies = context.cookies;
  const loyaltyStatus = cookies.get("loyalty_status");

  // Log the request location (provided by Netlify)
  console.log(`Request from: ${context.geo.city}, ${context.geo.country.name}`);

  if (loyaltyStatus === "gold") {
    // Rewrite the path to a special page for gold members
    return new URL("/gold-member-welcome", request.url);
  }

  // Continue to the next handler or origin
  const response = await context.next();
  
  // Modify the response header
  response.headers.set("X-Powered-By", "Deno on Netlify Edge");

  return response;
};

// Configuration for this edge function
export const config: Config = {
  path: "/*",
  excludedPath: ["/*.css", "/*.js", "/images/*"],
};
