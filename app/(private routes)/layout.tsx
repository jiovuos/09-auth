import AuthProvider from "@/components/AuthProvider/AuthProvider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
