import { apiClient } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export type FetchNotesResponse = {
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
};

// AUTH
export const clientAuthRegister = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post("/auth/register", data);
  return res.data as User;
};

export const clientAuthLogin = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data as User;
};

export const clientAuthLogout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data;
};

export const clientAuthSession = async () => {
  const res = await apiClient.get("/auth/session");
  return res.data;
};

// USERS
export const clientGetMe = async (): Promise<User> => {
  const res = await apiClient.get("/users/me");
  return res.data as User;
};

export const clientPatchMe = async (payload: Partial<User>): Promise<User> => {
  const res = await apiClient.patch("/users/me", payload);
  return res.data as User;
};

// NOTES
export const fetchNotes = async (
  params: {
    page?: number;
    perPage?: number;
    search?: string;
    tag?: string;
  } = {}
): Promise<FetchNotesResponse> => {
  const res = await apiClient.get("/notes", { params });
  const payload = res.data;

  if (Array.isArray(payload)) {
    return {
      data: payload as Note[],
      totalPages: 1,
      page: 1,
      perPage: payload.length
    };
  }

  if (payload && Array.isArray(payload.data)) {
    return payload as FetchNotesResponse;
  }

  if (payload && Array.isArray(payload.notes)) {
    return {
      data: payload.notes as Note[],
      totalPages: payload.totalPages ?? 1,
      page: payload.page ?? 1,
      perPage: payload.perPage ?? (payload.notes ? payload.notes.length : 0)
    };
  }

  return {
    data: [],
    totalPages: 1,
    page: 1,
    perPage: 0
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await apiClient.get(`/notes/${id}`);
  return res.data as Note;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: string;
}) => {
  const res = await apiClient.post("/notes", payload);
  return res.data as Note;
};

export const deleteNote = async (id: string) => {
  const res = await apiClient.delete(`/notes/${id}`);
  return res.data as Note;
};
