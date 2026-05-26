import { useState } from 'react';

// ─── Arsenal Completo ────────────────────────────────────────────────────────
const WEAPONS = [
  { id: 'guitarra', label: 'Guitarra', emoji: '🎸' },
  { id: 'baixo', label: 'Baixo', emoji: '🎸' },
  { id: 'bateria', label: 'Bateria', emoji: '🥁' },
  { id: 'vocal', label: 'Vocal', emoji: '🎤' },
  { id: 'teclado', label: 'Synth/Keys', emoji: '🎹' },
  { id: 'producao', label: 'Produção', emoji: '🎛️' },
  { id: 'dj', label: 'DJ/Beats', emoji: '🎧' },
  { id: 'sopro', label: 'Sopros', emoji: '🎷' },
  { id: 'cordas', label: 'Cordas', emoji: '🎻' },
  { id: 'percussao', label: 'Percussão', emoji: '🪘' },
  { id: 'outro', label: 'Outros', emoji: '⚙️' },
];

const SOULS = [
  { id: 'hobby', label: 'Hobby', desc: 'A música como válvula de escape.' },
  {
    id: 'serio',
    label: 'Projeto Sério',
    desc: 'Comprometimento total. Sem desculpas.',
  },
];

// ─── Componentes Visuais ─────────────────────────────────────────────────────
const WeaponCard = ({ weapon, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(weapon.id)}
    className={`
      flex flex-col items-center justify-center p-4 border-2 transition-all duration-300 
      ${
        isSelected
          ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
          : 'border-neutral-800 bg-[#0c0c0c] hover:border-neutral-600 hover:scale-[1.02]'
      }
    `}
  >
    <span className="text-2xl mb-2 select-none">{weapon.emoji}</span>
    <span
      className={`font-mono text-[9px] uppercase tracking-widest ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`}
    >
      {weapon.label}
    </span>
  </button>
);

const SoulCard = ({ soul, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(soul.id)}
    className={`
      w-full p-6 border-2 text-left transition-all duration-300
      ${
        isSelected
          ? 'border-red-600 bg-red-900/10'
          : 'border-neutral-800 bg-[#0c0c0c] hover:border-neutral-600'
      }
    `}
  >
    <p
      className={`font-sans font-bold text-lg mb-1 ${isSelected ? 'text-red-500' : 'text-white'}`}
    >
      {soul.label}
    </p>
    <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
      {soul.desc}
    </p>
  </button>
);

// ─── Componente Principal ────────────────────────────────────────────────────
const Step2Arsenal = ({ formData, onUpdate, onNext }) => {
  const canAdvance = Boolean(formData.weapon && formData.soul);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12">
      {/* Container Principal (Aumentado para max-w-4xl para comportar o grid) */}
      <div className="relative z-10 max-w-4xl w-full">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
            02. IDENTIFICAÇÃO{' '}
            <span className="text-red-600">DO COMBATENTE</span>
          </h2>
          <div className="w-24 h-1 bg-neutral-800 mx-auto mt-4"></div>
        </div>

        {/* Arsenal Grid - Ajustado para 4 colunas em desktop */}
        <h3 className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.3em] mb-6 text-center">
          Escolha sua arma (Instrumento)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-16">
          {WEAPONS.map(w => (
            <WeaponCard
              key={w.id}
              weapon={w}
              isSelected={formData.weapon === w.id}
              onSelect={id => onUpdate({ weapon: id })}
            />
          ))}
        </div>

        {/* Alma/Missão */}
        <h3 className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.3em] mb-6 text-center">
          Qual a sua alma na cena?
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-16">
          {SOULS.map(s => (
            <SoulCard
              key={s.id}
              soul={s}
              isSelected={formData.soul === s.id}
              onSelect={id => onUpdate({ soul: id })}
            />
          ))}
        </div>

        {/* Botão de Ação */}
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={`w-full py-6 font-mono font-bold uppercase tracking-[0.2em] text-sm border-2 transition-all duration-300
            ${
              canAdvance
                ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
            }`}
        >
          {canAdvance ? '▶ INICIAR PROTOCOLO' : 'SELECIONE ARMA E ALMA'}
        </button>
      </div>
    </div>
  );
};

export default Step2Arsenal;
