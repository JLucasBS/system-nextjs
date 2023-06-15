import * as prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const client = prismic.createClient("sistema-nextjs");

  return client;
}
