import { cookies } from "next/headers";
import { serverGetMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - NoteHub",
  description: "User profile page",
  openGraph: {
    title: "Profile - NoteHub",
    description: "User profile page",
    url: "https://example.com/profile",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"]
  }
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await serverGetMe(cookieHeader);

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username ?? "(no username)"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
