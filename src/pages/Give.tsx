import { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  HandHeart,
  Loader2,
  Smartphone,
} from 'lucide-react';
import Reveal from '../components/Reveal';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Donation, DonationFund, DonationMethod } from '../types';

const funds: { value: DonationFund; label: string; description: string }[] = [
  {
    value: 'general',
    label: 'Fonds général',
    description: "Soutient l'ensemble du ministère de l'église",
  },
  {
    value: 'missions',
    label: 'Missions',
    description: 'Envoi et soutien de missionnaires',
  },
  {
    value: 'construction',
    label: 'Construction',
    description: "Agrandissement de notre lieu de culte",
  },
  {
    value: 'jeunesse',
    label: 'Jeunesse',
    description: 'Camps, retraites et activités pour les jeunes',
  },
  {
    value: 'benevolence',
    label: 'Bienfaisance',
    description: 'Aide directe aux familles dans le besoin',
  },
];

const methods: { value: DonationMethod; label: string; icon: typeof CreditCard }[] = [
  { value: 'card', label: 'Carte bancaire', icon: CreditCard },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  { value: 'bank_transfer', label: 'Virement bancaire', icon: Banknote },
];

const quickAmounts = [5000, 10000, 25000, 50000];

export default function Give() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    amount: 10000,
    fund: 'general' as DonationFund,
    method: 'mobile_money' as DonationMethod,
    is_recurring: false,
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const payload: Donation = { ...form, currency: 'XAF' };

    if (!isSupabaseConfigured) {
      setTimeout(() => setStatus('success'), 600);
      return;
    }

    const { error } = await supabase.from('donations').insert(payload);
    setStatus(error ? 'error' : 'success');
  }

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <Reveal>
          <HandHeart size={36} className="mx-auto text-gold" />
          <p className="eyebrow mt-4">Générosité</p>
          <h1 className="section-title mt-2">Soutenir l'œuvre de Dieu</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mist">
            Chaque don, petit ou grand, permet à notre église de poursuivre sa
            mission : annoncer l'Évangile, accompagner les familles et servir
            notre communauté avec amour. Nous croyons que donner est un acte
            de foi et de reconnaissance envers Dieu.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-24">
        <Reveal>
          <div className="card-panel p-6 sm:p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <CheckCircle2 size={44} className="text-gold" />
                <p className="font-display text-xl font-semibold text-paper">
                  Merci pour votre générosité !
                </p>
                <p className="max-w-sm text-sm text-mist">
                  Un reçu de don vous sera envoyé par email à {form.email || 'votre adresse'}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-mist">
                    Montant (XAF)
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setForm({ ...form, amount: amt })}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                          form.amount === amt
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/15 text-mist hover:border-white/30'
                        }`}
                      >
                        {amt.toLocaleString('fr-FR')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={500}
                    required
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: Number(e.target.value) })
                    }
                    className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-mist">Destination</label>
                  <select
                    value={form.fund}
                    onChange={(e) =>
                      setForm({ ...form, fund: e.target.value as DonationFund })
                    }
                    className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                  >
                    {funds.map((f) => (
                      <option key={f.value} value={f.value} className="bg-charcoal">
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-mist">
                    {funds.find((f) => f.value === form.fund)?.description}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-mist">
                    Mode de paiement
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {methods.map(({ value, label, icon: Icon }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setForm({ ...form, method: value })}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-[0.7rem] font-medium transition-colors ${
                          form.method === value
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/15 text-mist hover:border-white/30'
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-mist">Nom complet</label>
                    <input
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mist">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-mist">
                  <input
                    type="checkbox"
                    checked={form.is_recurring}
                    onChange={(e) =>
                      setForm({ ...form, is_recurring: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/30 bg-white/5 accent-[#D4AF37]"
                  />
                  Faire de ce don un don mensuel récurrent
                </label>

                {status === 'error' && (
                  <p className="text-xs text-red-400">
                    Une erreur est survenue. Merci de réessayer.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-gold w-full"
                >
                  {status === 'submitting' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    `Faire un don de ${form.amount.toLocaleString('fr-FR')} XAF`
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
