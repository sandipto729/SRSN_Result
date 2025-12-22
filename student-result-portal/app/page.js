
'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const role = session.user?.role;
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "student") {
      router.replace("/dashboard/student");
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return null;
}
