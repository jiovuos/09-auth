import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "") + "/api";

// AUTH / SESSION
export const serverGetSession = async (
  cookieHeader?: string
): Promise<User | null> => {
  const res = await axios.get(`${baseURL}/auth/session`, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data ?? null;
};

// USERS
export const serverGetMe = async (cookieHeader?: string): Promise<User> => {
  const res = await axios.get(`${baseURL}/users/me`, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data as User;
};

export const serverPatchMe = async (
  payload: Partial<User>,
  cookieHeader?: string
): Promise<User> => {
  const res = await axios.patch(`${baseURL}/users/me`, payload, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data as User;
};

// NOTES
export type ServerFetchNotesResponse = {
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
};

export const serverFetchNotes = async (
  params: { page?: number; perPage?: number; search?: string; tag?: string },
  cookieHeader?: string
): Promise<ServerFetchNotesResponse> => {
  const res = await axios.get(`${baseURL}/notes`, {
    params,
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });

  const data = res.data as ServerFetchNotesResponse | Note[];
  if (Array.isArray(data)) {
    return {
      data,
      totalPages: 1,
      page: 1,
      perPage: data.length
    } as ServerFetchNotesResponse;
  }
  return data as ServerFetchNotesResponse;
};

export const serverGetNote = async (
  id: string,
  cookieHeader?: string
): Promise<Note> => {
  const res = await axios.get(`${baseURL}/notes/${id}`, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data as Note;
};

export const serverCreateNote = async (
  payload: { title: string; content: string; tag: string },
  cookieHeader?: string
) => {
  const res = await axios.post(`${baseURL}/notes`, payload, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data as Note;
};

export const serverDeleteNote = async (id: string, cookieHeader?: string) => {
  const res = await axios.delete(`${baseURL}/notes/${id}`, {
    headers: { Cookie: cookieHeader ?? "" },
    withCredentials: true
  });
  return res.data as Note;
};
