"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";
 
export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };
 
  const inputClass =
    "w-full h-11 rounded-lg border border-[#2A2F35] bg-[#1A1F24] px-4 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#0EFF9C]/50 transition-all";
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0EFF9C]/5 rounded-full blur-[120px] pointer-events-none" />
 
      <div className="w-full max-w-md space-y-8 relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap size={20} className="text-[#0D1117]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Close</span>
              <span className="text-[#0EFF9C]">One</span>
              <span className="text-[#A0A0A0]">.io</span>
            </h1>
          </div>
          <p className="text-[#A0A0A0] text-sm">Growth Smarter.</p>
        </div>
 
        {/* Form Card */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold mb-6">
            {isSignup ? "Créer un compte" : "Se connecter"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-sm text-[#A0A0A0] mb-1.5 block">Nom complet</label>
                <input type="text" placeholder="Julien De Bonnières" className={inputClass} />
              </div>
            )}
            <div>
              <label className="text-sm text-[#A0A0A0] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-[#A0A0A0] mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-lg gradient-primary text-[#0D1117] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {isSignup ? "Créer mon compte" : "Se connecter"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
 
        <p className="text-center text-sm text-[#A0A0A0]">
          {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-[#0EFF9C] hover:underline font-medium"
          >
            {isSignup ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
}