import { useState } from 'react';

// ─── Atmosfera (mesmo padrão dos outros steps) ────────────────────────────────
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
    <div className="spray-red fixed top-0 left-0 w-1 h-1 z-0" />
  </>
);

// ─── Definição dos atributos de humor (sliders 1-10) ──────────────────────────
const HUMOR_ATTRS = [
  {
    key: 'appears',
    emoji: '📅',
    label: 'Aparece nos Ensaios',
    hint: '"Ou vou em tudo ou sumo sem avisar"',
  },
  {
    key: 'cleanPlay',
    emoji: '🎯',
    label: 'Toca Limpo / Timing',
    hint: '"Fico na grade ou arraso o compasso"',
  },
  {
    key: 'learnsFast',
    emoji: '🧠',
    label: 'Aprende Rápido',
    hint: '"Decorei a cifra ou vou pedalando"',
  },
  {
    key: 'ego',
    emoji: '👑',
    label: 'Ego',
    hint: '1 = monge zen / 10 = acha que é o Dave Grohl',
    inverted: true, // quanto menor, melhor pro OVR
  },
  {
    key: 'ownGear',
    emoji: '🔊',
    label: 'Tem Equipamento Próprio',
    hint: '"Peço emprestado ou tenho o setup na van"',
  },
  {
    key: 'punctual',
    emoji: '⏰',
    label: 'Pontualidade',
    hint: '"Chego antes ou apareço na hora do buteco"',
  },
];

// ─── Opções dos campos reais ───────────────────────────────────────────────────
const SKILL_LEVELS = ['Iniciante', 'Intermediário', 'Avançado', 'Profissional'];
const AVAILABILITY_OPTIONS = [
  '1x por semana',
  '2-3x por semana',
  'Só fins de semana',
  'Flexível / Combinamos',
];

// ─── Slider de humor ────────────────────────────────────────────────────────────
const HumorSlider = ({ attr, value, onChange }) => (
  <div className="crack-corner border-2 border-neutral-800 bg-[#0c0c0c] p-4">
    <div className="flex items-start gap-3 mb-3">
      <span className="text-xl select-none flex-shrink-0">{attr.emoji}</span>
      <div className="flex-1">
        <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
          {attr.label}
        </p>
        <p className="font-mono text-[10px] text-neutral-600 italic mt-0.5">
          {attr.hint}
        </p>
      </div>
      <span className="font-mono text-lg text-red-500 font-bold w-8 text-right">
        {value}
      </span>
    </div>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) => onChange(attr.key, Number(e.target.value))}
      className="w-full accent-cyan-400 cursor-pointer"
    />
  </div>
);

// ─── Toggle sim/não ─────────────────────────────────────────────────────────────
const ToggleField = ({ label, value, onChange }) => (
  <div>
    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3 block">
      ◈ {label}
    </label>
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={`
            crack-corner p-3 border-2 font-mono text-xs uppercase tracking-widest transition-all
            ${value === opt
              ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400'
              : 'border-neutral-800 bg-[#0c0c0c] text-neutral-500 hover:border-neutral-600'
            }
          `}
        >
          {opt ? 'Sim' : 'Não'}
        </button>
      ))}
    </div>
  </div>
);

// ─── Select reutilizável ────────────────────────────────────────────────────────
const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3 block">
      ◈ {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="crack-corner w-full bg-[#050505] border-2 border-neutral-800 p-3 font-mono text-white text-sm focus:border-cyan-400 outline-none transition-all cursor-pointer"
    >
      <option value="" disabled>Selecione...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Step4Attributes = ({ formData, onUpdate, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const humor = formData.humorAttrs || {};
  const real  = formData.realAttrs  || {};

  const updateHumor = (key, value) => {
    onUpdate({ humorAttrs: { ...humor, [key]: value } });
  };

  const updateReal = (key, value) => {
    onUpdate({ realAttrs: { ...real, [key]: value } });
  };

  // Todos os 6 sliders precisam ter valor + os 5 campos reais preenchidos
  const allHumorFilled = HUMOR_ATTRS.every((a) => humor[a.key] !== undefined);
  const allRealFilled = Boolean(
    real.experienceYears !== undefined && real.experienceYears !== '' &&
    real.skillLevel &&
    real.availability &&
    real.playedLive !== undefined &&
    real.hasTransport !== undefined
  );

  const canSubmit = allHumorFilled && allRealFilled;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />
      <CRTScanlines />

      <div
        className="relative z-10 max-w-3xl w-full animate-fade-in-up bg-[#0c0c0c] border border-neutral-800 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pichacao"
        data-tag="ATRIBUTOS"
      >
        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
            04. FICHA <span className="text-cyan-400">TÉCNICA</span>
          </h2>
          <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.25em] mt-3">
            O que você é de verdade — e o que acha que é
          </p>
          <div className="stripe-obra w-24 mx-auto mt-4" />
        </div>

        {/* ── Bloco 1: Atributos de humor ── */}
        <div className="mt-10 mb-10">
          <h3 className="font-mono text-[10px] text-red-500 uppercase tracking-[0.3em] mb-1">
            ◈ Autoavaliação (sem julgamento)
          </h3>
          <p className="font-mono text-[10px] text-neutral-700 mb-6">
            Sê sincero. O grupo vai descobrir de qualquer jeito.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HUMOR_ATTRS.map((attr) => (
              <HumorSlider
                key={attr.key}
                attr={attr}
                value={humor[attr.key] ?? 5}
                onChange={updateHumor}
              />
            ))}
          </div>
        </div>

        {/* [TEXTURA] Faixa de obra entre blocos */}
        <div className="stripe-obra mb-10" />

        {/* ── Bloco 2: Atributos reais ── */}
        <div>
          <h3 className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] mb-1">
            ◈ Dados Objetivos
          </h3>
          <p className="font-mono text-[10px] text-neutral-700 mb-6">
            Isso aqui entra direto na ficha — sem firula.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3 block">
                ◈ Anos de Experiência
              </label>
              <input
                type="number"
                min="0"
                max="80"
                value={real.experienceYears ?? ''}
                onChange={(e) => updateReal('experienceYears', e.target.value)}
                placeholder="Ex: 5"
                className="crack-corner w-full bg-[#050505] border-2 border-neutral-800 p-3 font-mono text-white text-sm focus:border-cyan-400 outline-none transition-all"
              />
            </div>

            <SelectField
              label="Nível Técnico"
              value={real.skillLevel || ''}
              options={SKILL_LEVELS}
              onChange={(v) => updateReal('skillLevel', v)}
            />

            <SelectField
              label="Disponibilidade Semanal"
              value={real.availability || ''}
              options={AVAILABILITY_OPTIONS}
              onChange={(v) => updateReal('availability', v)}
            />

            <ToggleField
              label="Já Tocou ao Vivo?"
              value={real.playedLive}
              onChange={(v) => updateReal('playedLive', v)}
            />

            <ToggleField
              label="Tem Transporte p/ Equipamento?"
              value={real.hasTransport}
              onChange={(v) => updateReal('hasTransport', v)}
            />

          </div>
        </div>

        {/* [TEXTURA] Faixa de obra antes do botão */}
        <div className="stripe-obra mt-10 mb-6" />

        {/* Botão final */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`
            crack-corner
            w-full border-2 py-5 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300
            ${canSubmit && !submitting
              ? 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
              : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
            }
          `}
        >
          {submitting ? (
            <span className="animate-pulse">GERANDO FICHA...</span>
          ) : (
            '⬛ GERAR MINHA FIGURINHA'
          )}
        </button>
      </div>
    </div>
  );
};

export default Step4Attributes;
