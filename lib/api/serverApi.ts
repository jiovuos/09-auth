import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "") + "/api";

export const serverGetMe = async (cookieHeader?: string): Promise<User> => {
  const res = await axios.get(`${baseURL}/users/me`, {
    headers: { Cookie: cookieHeader ?? "" },
  });
  return res.data as User;
};

export const serverGetNote = async (id: string, cookieHeader?: string): Promise<Note> => {
  const res = await axios.get(`${baseURL}/notes/${id}`, {
    headers: { Cookie: cookieHeader ?? "" },
  });
  return res.data as Note;
};
