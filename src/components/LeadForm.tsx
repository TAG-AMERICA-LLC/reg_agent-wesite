import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function LeadForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!data.get('privacy')) {
      setStatus('error');
      setMsg('Devi accettare la Privacy Policy per inviare la richiesta.');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setMsg('Richiesta ricevuta. Ti rispondiamo entro [N] giorni lavorativi.');
      form.reset();
    }, 700);
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl p-10 text-center"
        style={{
          background: 'rgb(var(--paper-soft))',
          boxShadow: 'inset 0 0 0 1px rgb(var(--hairline))',
        }}
      >
        <div
          className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgb(var(--clay-wash))', color: 'rgb(var(--clay-deep))' }}
        >
          <Check size={28} strokeWidth={1.75} />
        </div>
        <h3 className="font-serif text-3xl mt-6" style={{ color: 'rgb(var(--ink))' }}>
          Richiesta <em style={{ fontStyle: 'italic', color: 'rgb(var(--clay-deep))' }}>ricevuta</em>.
        </h3>
        <p className="mt-3 text-[15.5px]" style={{ color: 'rgb(var(--ink-soft))' }}>{msg}</p>
        <a href="/business-in-florida/" className="btn btn-outline mt-8 px-6 py-3 inline-flex">
          Leggi gli articoli
          <ArrowRight size={14} />
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="field-label">Nome e cognome <span style={{ color: 'rgb(var(--clay-deep))' }}>*</span></label>
          <input id="name" name="name" type="text" required className="field-input" placeholder="Mario Rossi" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email <span style={{ color: 'rgb(var(--clay-deep))' }}>*</span></label>
          <input id="email" name="email" type="email" required className="field-input" placeholder="nome@azienda.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="field-label">Telefono <span style={{ color: 'rgb(var(--ink-faint))', fontWeight: 400 }}>(opzionale)</span></label>
          <input id="phone" name="phone" type="tel" className="field-input" placeholder="+39 ..." />
        </div>
        <div>
          <label htmlFor="type" className="field-label">Tipo di richiesta <span style={{ color: 'rgb(var(--clay-deep))' }}>*</span></label>
          <select id="type" name="type" required className="field-select">
            <option value="">Seleziona...</option>
            <option>Informazioni generali</option>
            <option>LLC in Florida</option>
            <option>Corporation in Florida</option>
            <option>Registered Agent</option>
            <option>Altro</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">Messaggio <span style={{ color: 'rgb(var(--clay-deep))' }}>*</span></label>
        <textarea id="message" name="message" required className="field-textarea" placeholder="Raccontaci brevemente il tuo progetto: attività, obiettivo, tempi." />
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex gap-3 text-[13px] leading-relaxed cursor-pointer" style={{ color: 'rgb(var(--ink-soft))' }}>
          <input name="privacy" type="checkbox" required className="mt-0.5 accent-current" style={{ accentColor: 'rgb(var(--ink))' }} />
          <span>
            Ho letto la <a href="/privacy-policy/" className="link-line" style={{ color: 'rgb(var(--ink))' }}>Privacy Policy</a> e acconsento al trattamento dei dati. <span style={{ color: 'rgb(var(--clay-deep))' }}>*</span>
          </span>
        </label>
        <label className="flex gap-3 text-[13px] leading-relaxed cursor-pointer" style={{ color: 'rgb(var(--ink-soft))' }}>
          <input name="marketing" type="checkbox" className="mt-0.5" style={{ accentColor: 'rgb(var(--ink))' }} />
          <span>Acconsento a ricevere comunicazioni commerciali da [NOME BRAND]. <span style={{ color: 'rgb(var(--ink-faint))' }}>(opzionale)</span></span>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full justify-center py-4 text-[14.5px] btn-arrow"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Invio in corso…' : (<>Invia richiesta <ArrowRight size={15} /></>)}
      </button>

      {status === 'error' && (
        <p className="text-[13px]" style={{ color: 'rgb(var(--clay-deep))' }}>{msg}</p>
      )}

      <p className="text-[12px] leading-relaxed" style={{ color: 'rgb(var(--ink-faint))' }}>
        Inviando il form accetti il <a href="/disclaimer/" className="link-line" style={{ color: 'rgb(var(--ink-soft))' }}>Disclaimer</a>.
        L'invio non crea un rapporto professionale con [NOME BRAND] o con il partner Florida.
      </p>
    </form>
  );
}
