import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase-config';

// ─── Componentes de Atmosfera (Mantidos) ─────────────────────────────────────
const CyberGrid = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.3]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
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
  ></div>
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
    <div className="fixed inset-4 border-2 border-neutral-800 pointer-events-none z-0 hidden md:block"></div>
    <div className="fixed top-0 left-6 h-full w-3 bg-neutral-900 border-x border-neutral-800 pointer-events-none z-0 hidden lg:block"></div>
    <div className="fixed top-0 right-6 h-full w-3 bg-neutral-900 border-x border-neutral-800 pointer-events-none z-0 hidden lg:block"></div>
  </>
);

// ─── Componente de Seleção Industrial ────────────────────────────────────────
const OptionCard = ({ label, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`
      p-4 border-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300
      ${
        isSelected
          ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
          : 'border-neutral-800 bg-[#0c0c0c] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
      }
    `}
  >
    {label}
  </button>
);

const Step3Radar = ({ formData, onUpdate, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(
    formData.location &&
    formData.age &&
    formData.bandDna &&
    formData.firstSong &&
    formData.mission
  );

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />
      <CRTScanlines />

      <div className="relative z-10 max-w-3xl w-full animate-fade-in-up bg-[#0c0c0c] border border-neutral-800 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
            03. CALIBRAGEM <span className="text-cyan-400">DO RADAR</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
        </div>

        <div className="space-y-8">
          {/* Localização */}
          <div>
            <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">
              ◈ ZONA DE OPERAÇÃO
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['POA/Metropolitana', 'Restante do RS', 'Outros'].map(loc => (
                <OptionCard
                  key={loc}
                  label={loc}
                  isSelected={formData.location === loc}
                  onSelect={() => onUpdate({ location: loc })}
                />
              ))}
            </div>
          </div>

          {/* Faixa Etária */}
          <div>
            <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">
              ◈ CICLO DE VIDA (IDADE)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Até 20', '21 a 26', '27 a 34', '35+'].map(age => (
                <OptionCard
                  key={age}
                  label={age}
                  isSelected={formData.age === age}
                  onSelect={() => onUpdate({ age })}
                />
              ))}
            </div>
          </div>

          {/* DNA e Primeiro Ensaio (Inputs Estilizados) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="DNA Musical (Banda Referência)">
              <input
                className="w-full bg-[#050505] border-2 border-neutral-800 p-4 font-mono text-white text-sm focus:border-red-600 outline-none transition-all"
                placeholder="Ex: Radiohead, RATM..."
                value={formData.bandDna || ''}
                onChange={e => onUpdate({ bandDna: e.target.value })}
              />
            </Field>
            <Field label="Teste de Fogo (1ª Música)">
              <input
                className="w-full bg-[#050505] border-2 border-neutral-800 p-4 font-mono text-white text-sm focus:border-red-600 outline-none transition-all"
                placeholder="Ex: Roots, Paranoid..."
                value={formData.firstSong || ''}
                onChange={e => onUpdate({ firstSong: e.target.value })}
              />
            </Field>
          </div>

          {/* Missão */}
          <div>
            <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">
              ◈ MISSÃO TÁTICA
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Somente Autoral', 'Somente Cover', 'Ambos'].map(mission => (
                <OptionCard
                  key={mission}
                  label={mission}
                  isSelected={formData.mission === mission}
                  onSelect={() => onUpdate({ mission })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botão de confirmação */}
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={`w-full mt-12 border-2 py-5 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300
            ${
              canSubmit
                ? 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
            }`}
        >
          {submitting ? 'TRANSMITINDO...' : '⬛ CONFIRMAR ENTRADA'}
        </button>
      </div>
    </div>
  );
};

// Helper simples para o layout
const Field = ({ label, children }) => (
  <div>
    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 block">
      ◈ {label}
    </label>
    {children}
  </div>
);

export default Step3Radar;
