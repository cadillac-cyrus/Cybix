import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Navbar() {
  const user = useUser();
    return (
        <nav className="bg-white shadow w-full">
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-xl font-bold">Cybix</div>
            {user ? <Link href="/logout">Log Out</Link> : <Link href="/login">Log In</Link>}
          </div>
        </nav>
    );
}