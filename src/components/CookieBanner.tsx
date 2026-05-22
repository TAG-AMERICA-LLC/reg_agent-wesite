import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('__cookie_choice');
    if (!stored) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (v: 'all' | 'reject') => {
    window.localStorage.setItem('__cookie_choice', v);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 right-5 md:left-auto md:right-6 md:bottom-6 md:max-w-[460px] z-[80] rounded-2xl p-6"
          style={{
            background: 'rgb(var(--paper))',
            boxShadow: '0 30px 80px rgb(var(--ink) / 0.16), inset 0 0 0 1px rgb(var(--hairline))',
          }}
          role="dialog"
          aria-label="Preferenze cookie"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div
              className="font-serif text-xl"
              style={{ color: 'rgb(var(--ink))', fontVariationSettings: "'SOFT' 35, 'opsz' 48" }}
            >
              Cookie
            </div>
            <span className="chip chip-clay">GDPR</span>
          </div>
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgb(var(--ink-soft))' }}>
            Utilizziamo cookie tecnici e, previo consenso, cookie analitici e di profilazione.
            Puoi accettare tutti, rifiutare i non necessari o consultare la{' '}
            <a href="/cookie-policy/" className="link-line" style={{ color: 'rgb(var(--ink))' }}>Cookie Policy</a>.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => choose('all')} className="btn btn-primary text-[13px] py-2.5 px-4">Accetta tutti</button>
            <button onClick={() => choose('reject')} className="btn btn-outline text-[13px] py-2.5 px-4">Solo necessari</button>
            <a href="/cookie-policy/" className="btn btn-ghost text-[13px] py-2.5 px-3">Preferenze</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
