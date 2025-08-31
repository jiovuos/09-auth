import { apiClient } from "./api";
import type { Note } from "@/types/note";

export type FetchNotesResponse = {
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
};

export async function fetchNotes(params: { page?: number; perPage?: number; search?: string; tag?: string }) {
  const res = await apiClient.get("/notes", { params });
  const data = res.data as FetchNotesResponse | Note[];

  // Нормалізація на випадок, якщо прийде просто масив (малоймовірно з нашими route’ами)
  if (Array.isArray(data)) {
    return {
      data,
      totalPages: 1,
      page: 1,
      perPage: data.length,
    } as FetchNotesResponse;
  }
  return data as FetchNotesResponse;
}

export async function fetchNoteById(id: string) {
  const res = await apiClient.get(`/notes/${id}`);
  return res.data as Note;
}

export async function createNote(payload: { title: string; content: string; tag: string }) {
  const res = await apiClient.post("/notes", payload);
  return res.data as Note;
}

export async function deleteNote(id: string) {
  const res = await apiClient.delete(`/notes/${id}`);
  return res.data as Note;
}
