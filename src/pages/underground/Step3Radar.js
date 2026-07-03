import { useState } from 'react';

const CyberGrid = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.3]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }}
  />
);

const CRTScanlines = () => (
  <div
    className="fixed inset-0 z-0 pointer-events-none opacity-[0.07]"
    style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 50%, transparent 50%)',
      backgroundSize: '100% 4px',
    }}
  />
);

const BunkerAtmosphere = () => (
  <>
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
      style={{
        backgroundImage: 'radial-gradient(circle, #555 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
    <div className="fixed inset-4 border-2 border-neutral-800 pointer-events-none z-0 hidden md:block" />
    <div className="fixed top-0 left-6 h-full w-3 bg-neutral-900 border-x border-neutral-800 pointer-events-none z-0 hidden lg:block" />
    <div className="fixed top-0 right-6 h-full w-3 bg-neutral-900 border-x border-neutral-800 pointer-events-none z-0 hidden lg:block" />
    <div className="crack-line fixed inset-0 pointer-events-none z-0" />
    <div className="spray-red fixed top-0 right-0 w-1 h-1 z-0" />
  </>
);

const OptionCard = ({ label, isSelected, onSelect, amber }) => (
  <button
    onClick={onSelect}
    className={`
      crack-corner p-4 border-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300
      ${isSelected
        ? amber
          ? 'border-amber-500 bg-amber-900/20 text-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
          : 'border-cyan-400 bg-cyan-900/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
        : 'border-neutral-800 bg-[#0c0c0c] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
      }
    `}
  >
    {label}
  </button>
);

const Field = ({ label, children }) => (
  <div>
    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">
      ◈ {label}
    </label>
    {children}
  </div>
);

// ─── Formulário do Músico ─────────────────────────────────────────────────────
const MusicianForm = ({ formData, onUpdate }) => (
  <div className="space-y-8">
    <div>
      <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">◈ ZONA DE OPERAÇÃO</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['POA/Metropolitana', 'Restante do RS', 'Outros'].map(loc => (
          <OptionCard key={loc} label={loc} isSelected={formData.location === loc} onSelect={() => onUpdate({ location: loc })} />
        ))}
      </div>
    </div>
    <div>
      <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">◈ CICLO DE VIDA (IDADE)</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Até 20', '21 a 26', '27 a 34', '35+'].map(age => (
          <OptionCard key={age} label={age} isSelected={formData.age === age} onSelect={() => onUpdate({ age })} />
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="DNA Musical (Banda Referência)">
        <input
          className="crack-corner w-full bg-[#050505] border-2 border-neutral-800 p-4 font-mono text-white text-sm focus:border-red-600 outline-none transition-all"
          placeholder="Ex: Radiohead, RATM..."
          value={formData.bandDna || ''}
          onChange={e => onUpdate({ bandDna: e.target.value })}
        />
      </Field>
      <Field label="Teste de Fogo (1ª Música)">
        <input
          className="crack-corner w-full bg-[#050505] border-2 border-neutral-800 p-4 font-mono text-white text-sm focus:border-red-600 outline-none transition-all"
          placeholder="Ex: Roots, Paranoid..."
          value={formData.firstSong || ''}
          onChange={e => onUpdate({ firstSong: e.target.value })}
        />
      </Field>
    </div>
    <div>
      <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">◈ MISSÃO TÁTICA</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['Somente Autoral', 'Somente Cover', 'Ambos'].map(mission => (
          <OptionCard key={mission} label={mission} isSelected={formData.mission === mission} onSelect={() => onUpdate({ mission })} />
        ))}
      </div>
    </div>
  </div>
);

// ─── Formulário do Apoiador ───────────────────────────────────────────────────
const SUPPORT_TYPES = [
  { id: 'estudio',    label: '🎙️ Estúdio / Sala de Ensaio' },
  { id: 'investidor', label: '💰 Investidor / Financiador' },
  { id: 'marca',      label: '🏷️ Marca / Patrocinador' },
  { id: 'casaShows',  label: '🎟️ Casa de Shows / Bar' },
  { id: 'outro',      label: '⚙️ Outro' },
];

const ApoiadorForm = ({ formData, onUpdate }) => (
  <div className="space-y-8">
    <div>
      <label className="font-mono text-[10px] text-amber-700 uppercase tracking-[0.2em] mb-4 block">◈ COMO VOCÊ QUER FORTALECER O BUNKER?</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SUPPORT_TYPES.map(t => (
          <OptionCard key={t.id} label={t.label} isSelected={formData.supportType === t.id} onSelect={() => onUpdate({ supportType: t.id })} amber />
        ))}
      </div>
    </div>
    <div>
      <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">◈ ZONA DE OPERAÇÃO</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['POA/Metropolitana', 'Restante do RS', 'Outros'].map(loc => (
          <OptionCard key={loc} label={loc} isSelected={formData.location === loc} onSelect={() => onUpdate({ location: loc })} amber />
        ))}
      </div>
    </div>
    <div>
      <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">◈ CICLO DE VIDA (IDADE)</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Até 20', '21 a 26', '27 a 34', '35+'].map(age => (
          <OptionCard key={age} label={age} isSelected={formData.age === age} onSelect={() => onUpdate({ age })} amber />
        ))}
      </div>
    </div>
    <Field label="Descreva sua proposta em uma linha">
      <input
        className="crack-corner w-full bg-[#050505] border-2 border-amber-900/40 p-4 font-mono text-white text-sm focus:border-amber-500 outline-none transition-all"
        placeholder="Ex: Tenho sala de ensaio equipada disponível em POA..."
        value={formData.supportProposal || ''}
        maxLength={120}
        onChange={e => onUpdate({ supportProposal: e.target.value })}
      />
    </Field>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Step3Radar = ({ formData, onUpdate, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const isApoiador = formData.weapon === 'apoiador';

  const canSubmitMusician = Boolean(
    formData.location && formData.age && formData.bandDna && formData.firstSong && formData.mission
  );
  const canSubmitApoiador = Boolean(
    formData.supportType && formData.location && formData.age
  );
  const canSubmit = isApoiador ? canSubmitApoiador : canSubmitMusician;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try { await onSubmit(); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />
      <CRTScanlines />

      <div
        className="relative z-10 max-w-3xl w-full animate-fade-in-up bg-[#0c0c0c] border p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pichacao"
        style={{ borderColor: isApoiador ? 'rgba(180,83,9,0.3)' : '#262626' }}
        data-tag={isApoiador ? 'APOIO' : 'RADAR'}
      >
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          {isApoiador ? (
            <>
              <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
                03. PROPOSTA DE{' '}
                <span className="text-amber-400">PARCERIA</span>
              </h2>
              <p className="font-mono text-[10px] text-amber-800 uppercase tracking-[0.25em] mt-3">
                Porta dos fundos — área restrita a apoiadores
              </p>
            </>
          ) : (
            <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
              03. CALIBRAGEM <span className="text-cyan-400">DO RADAR</span>
            </h2>
          )}
          <div className="stripe-obra w-24 mx-auto mt-4" />
        </div>

        <div className="mt-10">
          {isApoiador
            ? <ApoiadorForm formData={formData} onUpdate={onUpdate} />
            : <MusicianForm formData={formData} onUpdate={onUpdate} />
          }
        </div>

        <div className="stripe-obra mt-10 mb-6" />

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`
            crack-corner w-full border-2 py-5 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300
            ${canSubmit && !submitting
              ? isApoiador
                ? 'border-amber-600 text-amber-400 hover:bg-amber-700 hover:text-black'
                : 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
              : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
            }
          `}
        >
          {submitting
            ? <span className="animate-pulse">TRANSMITINDO...</span>
            : isApoiador
            ? '🍻 ENVIAR PROPOSTA'
            : '⬛ CONFIRMAR ENTRADA'}
        </button>
      </div>
    </div>
  );
};

export default Step3Radar;
