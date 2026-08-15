import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../lib/auth';

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    if (error) setError(error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-semibold text-gold">
            Christ Mission Church
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-mist">
            Espace administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-panel space-y-4 p-6">
          <div>
            <label className="text-xs font-medium text-mist">Email</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-gold">
              <Mail size={15} className="text-mist" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-paper focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-mist">Mot de passe</label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-gold">
              <Lock size={15} className="text-mist" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-paper focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold w-full"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <LogIn size={16} /> Se connecter
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-mist">
          Accès réservé à l'équipe. Les comptes se créent depuis le tableau
          de bord Supabase.
        </p>
      </div>
    </div>
  );
}
