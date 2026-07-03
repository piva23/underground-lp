const WEAPONS = [
  { id: 'guitarra',  label: 'Guitarra',   emoji: '🎸' },
  { id: 'baixo',     label: 'Baixo',      emoji: '🎸' },
  { id: 'bateria',   label: 'Bateria',    emoji: '🥁' },
  { id: 'vocal',     label: 'Vocal',      emoji: '🎤' },
  { id: 'teclado',   label: 'Synth/Keys', emoji: '🎹' },
  { id: 'producao',  label: 'Produção',   emoji: '🎛️' },
  { id: 'dj',        label: 'DJ/Beats',   emoji: '🎧' },
  { id: 'sopro',     label: 'Sopros',     emoji: '🎷' },
  { id: 'cordas',    label: 'Cordas',     emoji: '🎻' },
  { id: 'percussao', label: 'Percussão',  emoji: '🪘' },
  { id: 'outro',     label: 'Outros',     emoji: '⚙️' },
];

const SOULS = [
  { id: 'hobby', label: 'Hobby',         desc: 'A música como válvula de escape.' },
  { id: 'serio', label: 'Projeto Sério', desc: 'Comprometimento total. Sem desculpas.' },
];

const WeaponCard = ({ weapon, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(weapon.id)}
    className={`
      crack-corner flex flex-col items-center justify-center p-4 border-2 transition-all duration-300
      ${isSelected
        ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
        : 'border-neutral-800 bg-[#0c0c0c] hover:border-neutral-600 hover:scale-[1.02]'
      }
    `}
  >
    <span className="text-2xl mb-2 select-none">{weapon.emoji}</span>
    <span className={`font-mono text-[9px] uppercase tracking-widest ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`}>
      {weapon.label}
    </span>
  </button>
);

const SoulCard = ({ soul, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(soul.id)}
    className={`
      crack-corner w-full p-6 border-2 text-left transition-all duration-300
      ${isSelected
        ? 'border-red-600 bg-red-900/10'
        : 'border-neutral-800 bg-[#0c0c0c] hover:border-neutral-600'
      }
    `}
  >
    <p className={`font-sans font-bold text-lg mb-1 ${isSelected ? 'text-red-500' : 'text-white'}`}>
      {soul.label}
    </p>
    <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
      {soul.desc}
    </p>
  </button>
);

const Step2Arsenal = ({ formData, onUpdate, onNext }) => {
  const isApoiador = formData.weapon === 'apoiador';
  const isMusicianSelected = formData.weapon && formData.weapon !== 'apoiador';
  const canAdvance = isApoiador || Boolean(isMusicianSelected && formData.soul);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="crack-line fixed inset-0 pointer-events-none z-0" />
      <div className="spray-cyan fixed bottom-0 right-0 w-1 h-1 z-0" />

      <div className="relative z-10 max-w-4xl w-full pichacao" data-tag="ARSENAL">

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h2 className="font-sans font-black text-white text-3xl uppercase tracking-widest">
            02. IDENTIFICAÇÃO{' '}
            <span className="text-red-600">DO COMBATENTE</span>
          </h2>
          <div className="stripe-obra w-24 mx-auto mt-4" />
        </div>

        {/* ── Grid de armas (músicos) ── */}
        <h3 className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.3em] mb-6 text-center">
          Escolha sua arma (Instrumento)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {WEAPONS.map(w => (
            <WeaponCard
              key={w.id}
              weapon={w}
              isSelected={formData.weapon === w.id}
              onSelect={id => onUpdate({ weapon: id, soul: formData.soul })}
            />
          ))}
        </div>

        {/* ── Alma — só aparece se for músico ── */}
        {isMusicianSelected && (
          <>
            <div className="stripe-obra mb-10" />
            <h3 className="font-mono text-[10px] text-neutral-600 uppercase tracking-[0.3em] mb-6 text-center">
              Qual a sua alma na cena?
            </h3>
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              {SOULS.map(s => (
                <SoulCard
                  key={s.id}
                  soul={s}
                  isSelected={formData.soul === s.id}
                  onSelect={id => onUpdate({ soul: id })}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Separador "porta dos fundos" ── */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-neutral-900" />
          <span className="font-mono text-[9px] text-neutral-700 tracking-[0.3em] uppercase">
            ou entre pela porta dos fundos
          </span>
          <div className="flex-1 h-px bg-neutral-900" />
        </div>

        {/* ── Card de Apoiador — separado, visual distinto ── */}
        <button
          onClick={() => onUpdate({ weapon: 'apoiador', soul: null })}
          className={`
            crack-corner w-full border-2 p-5 text-left transition-all duration-300
            ${isApoiador
              ? 'border-amber-600 bg-amber-900/10'
              : 'border-neutral-800 bg-[#0c0c0c] hover:border-neutral-700'
            }
          `}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl select-none">🍻</span>
            <div className="flex-1">
              <p className={`font-sans font-bold text-base mb-1 ${isApoiador ? 'text-amber-400' : 'text-neutral-400'}`}>
                Não sou músico — sou Apoiador
              </p>
              <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest leading-relaxed">
                Estúdio, selo, investidor, marca, casa de shows.
                Tem algo a oferecer pro ecossistema?
              </p>
            </div>
            {isApoiador && (
              <span className="font-mono text-[10px] text-amber-400 tracking-widest border border-amber-700 px-2 py-1 flex-shrink-0">
                SELECIONADO
              </span>
            )}
          </div>
        </button>

        {isApoiador && (
          <p className="font-mono text-[10px] text-amber-700 tracking-widest text-center mt-3">
            Você vai ser direcionado para o formulário de parceria.
          </p>
        )}

        {/* ── Botão avançar ── */}
        <div className="mt-10">
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className={`
              crack-corner w-full py-6 font-mono font-bold uppercase tracking-[0.2em] text-sm border-2 transition-all duration-300
              ${canAdvance
                ? isApoiador
                  ? 'border-amber-600 text-amber-400 hover:bg-amber-700 hover:text-black'
                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
              }
            `}
          >
            {!canAdvance
              ? 'SELECIONE SUA POSIÇÃO'
              : isApoiador
              ? '▶ ENTRAR PELA PORTA DOS FUNDOS'
              : '▶ INICIAR PROTOCOLO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Arsenal;
