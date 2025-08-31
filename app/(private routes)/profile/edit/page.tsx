"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientGetMe, clientPatchMe } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const me = await clientGetMe();
      setUsername(me.username ?? "");
      setEmail(me.email);
    })();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await clientPatchMe({ username });
    const me = await clientGetMe();
    setUser(me);
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="/default-avatar.png"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
