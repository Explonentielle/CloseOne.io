import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Link
        href="/landingpage"
        className="fixed top-4 left-4 flex items-center gap-2 text-sm font-medium transition-colors text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]"      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Retour à l'accueil
      </Link>

      <SignIn
        appearance={{
          variables: {
            colorPrimary: "hsl(var(--primary))",
            fontFamily: "var(--font-sans), 'Inter', sans-serif",
          },
          layout: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
            animations: false,
          },
        }}
      />
    </main>
  );
}