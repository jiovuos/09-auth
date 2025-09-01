import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { serverGetNote } from "@/lib/api/serverApi";
import { cookies } from "next/headers";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll ? cookieStore.getAll() : [];
  if (!all || all.length === 0) return "";
  return all
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cookieHeader = await buildCookieHeader();

  try {
    const note = await serverGetNote(id, cookieHeader);

    const description =
      note.content && note.content.trim() !== ""
        ? note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "")
        : "Note details";

    return {
      title: `${note.title} - NoteHub`,
      description,
      openGraph: {
        title: `${note.title} - NoteHub`,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"]
      }
    };
  } catch {
    return {
      title: "Note not found - NoteHub",
      description: "This note does not exist",
      openGraph: {
        title: "Note not found - NoteHub",
        description: "This note does not exist",
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"]
      }
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const cookieHeader = await buildCookieHeader();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => serverGetNote(id, cookieHeader)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
