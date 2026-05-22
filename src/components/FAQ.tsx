import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItemData {
  q: string;
  a: string;
}

interface Props { items: FAQItemData[]; }

export default function FAQ({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i;
        const num = String(i + 1).padStart(2, '0');
        return (
          <div key={i} style={{ borderTop: '1px solid rgb(var(--hairline))' }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-baseline gap-6 py-7 text-left transition-colors"
            >
              <span
                className="chapter"
                style={{ minWidth: '2.5rem', color: isOpen ? 'rgb(var(--clay-deep))' : undefined }}
              >
                — {num}
              </span>
              <span
                className="flex-1 font-serif text-[22px] md:text-[26px] leading-tight transition-colors"
                style={{
                  color: 'rgb(var(--ink))',
                  fontVariationSettings: "'SOFT' 35, 'opsz' 72",
                }}
              >
                {it.q}
              </span>
              <span
                className="flex-shrink-0 inline-flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: '36px',
                  height: '36px',
                  background: isOpen ? 'rgb(var(--ink))' : 'transparent',
                  color: isOpen ? 'rgb(var(--paper))' : 'rgb(var(--ink))',
                  boxShadow: 'inset 0 0 0 1px rgb(var(--hairline-hard))',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="grid grid-cols-12 gap-6 pb-7"
                    style={{ color: 'rgb(var(--ink-soft))' }}
                  >
                    <div className="col-span-12 md:col-span-2"></div>
                    <div className="col-span-12 md:col-span-9 text-[16px] leading-[1.75] max-w-3xl">
                      {it.a}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <div style={{ borderTop: '1px solid rgb(var(--hairline))' }}></div>
    </div>
  );
}
