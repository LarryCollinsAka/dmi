import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // For MVP demo — skip auth check
  // In production: const session = await getServerSession(authOptions)
  // if (!session) redirect("/")

  return (
    <div>
      <header className="border-b p-3 flex justify-between text-xs text-zinc-500">
        <span>Demo Mode • RBAC disabled for video • dmi.cm</span>
        <span>demo@dmi.cm • ADMIN</span>
      </header>
      {children}
    </div>
  );
}