import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0D1117" }}
    >
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0EFF9C",
            borderRadius: "0.75rem",
            fontFamily: "'Inter', sans-serif",
          },
          layout: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "blockButton",
            animations: true,
          },
        }}
      />
    </main>
  );
}