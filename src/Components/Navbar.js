import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white shadow w-full">
          <div className="px-4 h-14 flex justify-between items-center">
            <div className="text-xl font-bold">Cybix</div>
            <Link href="/login">Log In</Link>
          </div>
        </nav>
    );
}