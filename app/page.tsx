import { auth } from "@/auth";
import Chat from "../components/Chat";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <main>
      <Chat />
    </main>
  );
}
