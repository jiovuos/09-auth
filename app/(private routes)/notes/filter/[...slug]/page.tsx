import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import {
  serverFetchNotes,
  type ServerFetchNotesResponse,
} from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import { cookies } from "next/headers";
import type { Metadata } from "next";

type PageProps = {
  params?: Promise<{ slug?: string[] }>;
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
  params,
}: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug ?? [];
  const tag = slug[0] ?? "All";

  return {
    title: `Notes filtered by ${tag}`,
    description: `Browse notes filtered by ${tag} in NoteHub`,
    openGraph: {
      title: `Notes filtered by ${tag}`,
      description: `Browse notes filtered by ${tag} in NoteHub`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const slug = resolved?.slug ?? [];

  const rawTag = slug[0] ?? "All";

  const currentTag =
    rawTag.charAt(0).toUpperCase() + rawTag.slice(1).toLowerCase();

  const validTags: (NoteTag | "All")[] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
    "All",
  ];

  if (!validTags.includes(currentTag as NoteTag | "All")) {
    notFound();
  }

  const page = 1;
  const search = "";
  const tagParam: NoteTag | undefined =
    currentTag === "All" ? undefined : (currentTag as NoteTag);

  const cookieHeader = await buildCookieHeader();

  const queryClient = new QueryClient();

  const initialNotes: ServerFetchNotesResponse = await serverFetchNotes(
    {
      page,
      perPage: 6,
      search,
      tag: tagParam,
    },
    cookieHeader,
  );

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, currentTag],
    queryFn: () => Promise.resolve(initialNotes),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialNotes={initialNotes}
        tag={currentTag}
      />
    </HydrationBoundary>
  );
}
