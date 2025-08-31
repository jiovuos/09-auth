import { apiClient } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// AUTH
export const clientAuthRegister = async (data: { email: string; password: string }) => {
  const res = await apiClient.post("/auth/register", data);
  return res.data as User;
};

export const clientAuthLogin = async (data: { email: string; password: string }) => {
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
export const clientFetchNotes = async (params: { page?: number; perPage?: number; search?: string; tag?: string }) => {
  const res = await apiClient.get("/notes", { params });
  return res.data; // очікувано: {data, page, perPage, totalPages}
};

export const clientFetchNoteById = async (id: string) => {
  const res = await apiClient.get(`/notes/${id}`);
  return res.data as Note;
};

export const clientCreateNote = async (data: { title: string; content: string; tag: string }) => {
  const res = await apiClient.post("/notes", data);
  return res.data as Note;
};

export const clientDeleteNote = async (id: string) => {
  const res = await apiClient.delete(`/notes/${id}`);
  return res.data as Note;
};
