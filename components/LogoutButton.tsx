"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/landingpage",
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}
