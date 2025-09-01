import BackModal from "@/components/Modal/BackModal";
import NotePreview from "./NotePreview.client";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { serverGetNote } from "@/lib/api/serverApi";

type PageProps = {
  params?: Promise<{ id: string }>;
};

export default async function NoteModalPage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id;

  if (!id) {
    notFound();
  }

  const cookieHeader = cookies().toString();
  const note = await serverGetNote(id, cookieHeader);

  return (
    <BackModal>
      <NotePreview note={note} />
    </BackModal>
  );
}
