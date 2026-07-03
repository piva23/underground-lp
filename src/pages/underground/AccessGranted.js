import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';

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
    <div className="spray-cyan fixed bottom-0 right-0 w-1 h-1 z-0" />
  </>
);

const buildMusicianLines = displayName => [
  '> ESTABELECENDO CONEXÃO SEGURA...',
  '> AUTENTICANDO CREDENCIAIS...',
  '> VERIFICANDO LISTA DE ACESSO...',
  '> OPERADOR IDENTIFICADO: ' + (displayName || 'MÚSICO').toUpperCase(),
  '> COMPILANDO FICHA TÉCNICA...',
  '> CALCULANDO OVERALL...',
  '> NÍVEL DE CLEARANCE: CONFIRMADO',
  '',
  '█  ACESSO CONCEDIDO.',
];

const buildApoiadorLines = displayName => [
  '> ESTABELECENDO CONEXÃO SEGURA...',
  '> VERIFICANDO CREDENCIAL DE PARCERIA...',
  '> OPERADOR IDENTIFICADO: ' + (displayName || 'APOIADOR').toUpperCase(),
  '> TIPO: STAKEHOLDER / PARCEIRO',
  '> PROPOSTA REGISTRADA NO SISTEMA...',
  '> NÍVEL DE CLEARANCE: PARCEIRO',
  '',
  '█  PROPOSTA RECEBIDA.',
];

const WEAPON_MAP = {
  guitarra: { emoji: '🎸', label: 'Guitarrista' },
  baixo: { emoji: '🎸', label: 'Baixista' },
  bateria: { emoji: '🥁', label: 'Baterista' },
  vocal: { emoji: '🎤', label: 'Vocalista' },
  teclado: { emoji: '🎹', label: 'Tecladista' },
  producao: { emoji: '🎛️', label: 'Produtor' },
  dj: { emoji: '🎧', label: 'DJ' },
  sopro: { emoji: '🎷', label: 'Sopros' },
  cordas: { emoji: '🎻', label: 'Cordas' },
  percussao: { emoji: '🪘', label: 'Percussão' },
  outro: { emoji: '⚙️', label: 'Multi-Instrumentista' },
  apoiador: { emoji: '🍻', label: 'Apoiador' },
};

const SUPPORT_TYPE_LABELS = {
  estudio: '🎙️ Estúdio / Sala de Ensaio',
  investidor: '💰 Investidor / Financiador',
  marca: '🏷️ Marca / Patrocinador',
  casaShows: '🎟️ Casa de Shows / Bar',
  outro: '⚙️ Outro',
};

const WEIGHTS = {
  appears: 2.0,
  cleanPlay: 1.5,
  ego: 1.5,
  learnsFast: 1.0,
  ownGear: 1.0,
  punctual: 1.0,
};

const calculateOVR = humorAttrs => {
  if (!humorAttrs) return 50;
  let totalWeight = 0,
    totalScore = 0;
  Object.entries(WEIGHTS).forEach(([key, weight]) => {
    const raw = humorAttrs[key];
    if (raw === undefined) return;
    totalScore += (key === 'ego' ? 10 - raw : raw) * weight;
    totalWeight += weight;
  });
  if (totalWeight === 0) return 50;
  return Math.round((totalScore / totalWeight / 10) * 99);
};

const ATTR_DISPLAY = [
  { key: 'appears', label: 'Aparece' },
  { key: 'cleanPlay', label: 'Toca Limpo' },
  { key: 'ego', label: 'Ego', inverted: true },
  { key: 'learnsFast', label: 'Aprende' },
  { key: 'ownGear', label: 'Equipamento' },
  { key: 'punctual', label: 'Pontual' },
];

const StatBar = ({ label, value, inverted }) => {
  const displayValue = inverted ? 10 - value : value;
  const isLow = displayValue <= 4;
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-wide w-20 md:w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-neutral-800">
        <div
          className={'h-1.5 ' + (isLow ? 'bg-orange-700' : 'bg-cyan-400')}
          style={{ width: (displayValue / 10) * 100 + '%' }}
        />
      </div>
      <span className="font-mono text-xs md:text-sm text-cyan-400 font-bold w-4 md:w-5 text-right">
        {displayValue}
      </span>
    </div>
  );
};

// ─── Ficha do Músico ──────────────────────────────────────────────────────────
const MusicianCard = ({ user, profile }) => {
  const weapon = WEAPON_MAP[profile && profile.weapon] || {
    emoji: '🎵',
    label: 'Músico',
  };
  const ovr = calculateOVR(profile && profile.humorAttrs);
  const real = (profile && profile.realAttrs) || {};
  const serial =
    '#UG-' + ((user && user.uid) || '0000').slice(-4).toUpperCase();

  return (
    <div
      className="crack-corner w-full max-w-md mx-auto border border-cyan-400/30 overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, #161616 0%, #0c0c0c 60%, #050505 100%)',
        boxShadow: '0 0 40px rgba(34,211,238,0.12)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-5 py-3 bg-red-800/80">
        <span className="font-mono text-[10px] md:text-xs font-bold text-white tracking-[0.2em]">
          UNDERGROUND
        </span>
        <span className="font-mono text-[10px] md:text-xs text-neutral-300 tracking-wide">
          {weapon.emoji} {weapon.label.toUpperCase()}
        </span>
      </div>

      {/* Avatar quadrado + OVR */}
      <div className="flex items-start justify-between px-4 md:px-5 pt-5 pb-3 gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          <div
            className="flex-shrink-0 border border-neutral-700 bg-neutral-900 flex items-center justify-center overflow-hidden"
            style={{
              width: '72px',
              height: '72px',
              clipPath:
                'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
            }}
          >
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || ''}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{weapon.emoji}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-mono text-sm font-bold text-white uppercase tracking-wide truncate">
              {(user && user.displayName) || 'Operador'}
            </p>
            <p className="font-mono text-[10px] text-neutral-500 mt-0.5 truncate">
              {(profile && profile.bandDna) || '—'}
            </p>
            <p className="font-mono text-[9px] text-neutral-700 mt-0.5 uppercase tracking-wider">
              {(profile && profile.soul) === 'serio'
                ? 'Projeto Sério'
                : 'Hobby'}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div
            className="font-mono font-black text-cyan-400 leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
              textShadow: '0 0 20px rgba(34,211,238,0.5)',
            }}
          >
            {ovr}
          </div>
          <div className="font-mono text-[9px] text-neutral-600 tracking-[0.2em] mt-1">
            OVR
          </div>
        </div>
      </div>

      <div className="stripe-obra mx-4 md:mx-5" style={{ height: '3px' }} />

      {/* Atributos */}
      <div className="px-4 md:px-5 py-3 space-y-2 md:space-y-2.5">
        {ATTR_DISPLAY.map(attr => (
          <StatBar
            key={attr.key}
            label={attr.label}
            value={
              (profile && profile.humorAttrs && profile.humorAttrs[attr.key]) ||
              5
            }
            inverted={attr.inverted}
          />
        ))}
      </div>

      {/* Badges dados reais */}
      <div className="px-4 md:px-5 py-3 flex flex-wrap gap-1.5 border-t border-neutral-900 mt-1">
        {real.experienceYears && (
          <span className="font-mono text-[8px] border border-neutral-800 text-neutral-500 px-2 py-0.5">
            {real.experienceYears} anos
          </span>
        )}
        {real.skillLevel && (
          <span className="font-mono text-[8px] border border-neutral-800 text-neutral-500 px-2 py-0.5">
            {real.skillLevel}
          </span>
        )}
        {real.playedLive !== undefined && (
          <span className="font-mono text-[8px] border border-neutral-800 text-neutral-500 px-2 py-0.5">
            {real.playedLive ? '🎤 Ao vivo' : '🌱 Nunca ao vivo'}
          </span>
        )}
        {real.hasTransport !== undefined && (
          <span className="font-mono text-[8px] border border-neutral-800 text-neutral-500 px-2 py-0.5">
            {real.hasTransport ? '🚐 Tem transporte' : '🚶 Sem transporte'}
          </span>
        )}
        {real.availability && (
          <span className="font-mono text-[8px] border border-neutral-800 text-neutral-500 px-2 py-0.5">
            {real.availability}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 md:px-5 py-2.5 border-t border-neutral-900 bg-black/30">
        <span className="font-mono text-[8px] text-neutral-800 tracking-wider">
          {serial}
        </span>
        <span className="font-mono text-[8px] bg-red-900/60 text-red-400 px-2 py-0.5 uppercase tracking-wide">
          {(profile && profile.mission) || '—'}
        </span>
      </div>
    </div>
  );
};

// ─── Ficha do Apoiador ────────────────────────────────────────────────────────
const ApoiadorCard = ({ user, profile }) => {
  const serial =
    '#UG-AP-' + ((user && user.uid) || '0000').slice(-4).toUpperCase();
  const supType =
    SUPPORT_TYPE_LABELS[profile && profile.supportType] || '⚙️ Parceiro';
  const proposal = (profile && profile.supportProposal) || '';
  const email = 'contato@underground.com.br';
  const subject = encodeURIComponent(
    'Proposta de Parceria - Underground - ' + supType
  );
  const body = encodeURIComponent(
    'Olá Underground,\n\nSou ' +
      ((user && user.displayName) || 'Parceiro') +
      ' e tenho interesse em apoiar o ecossistema como: ' +
      supType +
      '.\n\n' +
      (proposal ? 'Proposta: ' + proposal + '\n\n' : '') +
      'Região: ' +
      ((profile && profile.location) || '—') +
      '\n\nAguardo retorno.'
  );

  return (
    <div
      className="crack-corner w-full max-w-md mx-auto border border-amber-700/30 overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, #1a1200 0%, #0c0c0c 60%, #050505 100%)',
        boxShadow: '0 0 40px rgba(180,83,9,0.1)',
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 md:px-5 py-3"
        style={{ background: 'rgba(120,53,15,0.8)' }}
      >
        <span className="font-mono text-[10px] md:text-xs font-bold text-white tracking-[0.2em]">
          UNDERGROUND
        </span>
        <span className="font-mono text-[10px] md:text-xs text-amber-300 tracking-wide">
          🍻 APOIADOR
        </span>
      </div>

      {/* Avatar + info */}
      <div className="flex items-start gap-3 md:gap-4 px-4 md:px-5 pt-5 pb-4">
        <div
          className="flex-shrink-0 border border-amber-900/50 bg-neutral-900 flex items-center justify-center overflow-hidden"
          style={{
            width: '64px',
            height: '64px',
            clipPath:
              'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
          }}
        >
          {user && user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || ''}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🍻</span>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-mono text-sm font-bold text-white uppercase tracking-wide truncate">
            {(user && user.displayName) || 'Parceiro'}
          </p>
          <p className="font-mono text-[10px] text-amber-600 mt-1">{supType}</p>
          {proposal && (
            <p className="font-mono text-[9px] text-neutral-600 mt-1 leading-relaxed line-clamp-2">
              {proposal}
            </p>
          )}
        </div>
      </div>

      <div
        className="mx-4 md:mx-5 mb-4"
        style={{ height: '1px', background: 'rgba(120,53,15,0.4)' }}
      />

      <div className="px-4 md:px-5 pb-4 space-y-2">
        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-neutral-600 uppercase tracking-wider">
            Região
          </span>
          <span className="text-neutral-400">
            {(profile && profile.location) || '—'}
          </span>
        </div>
        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-neutral-600 uppercase tracking-wider">
            Status
          </span>
          <span className="text-amber-600">Em análise</span>
        </div>
      </div>

      {/* Botão mailto */}
      <div className="px-4 md:px-5 pb-5">
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`}
          className="crack-corner flex items-center justify-center gap-2 w-full border border-amber-700 text-amber-500 font-mono text-[10px] py-4 tracking-[0.2em] uppercase hover:bg-amber-800 hover:text-white transition-all duration-200"
        >
          📨 ENVIAR PROPOSTA DE APOIO
        </a>
      </div>

      <div className="flex justify-between items-center px-4 md:px-5 py-2.5 border-t border-neutral-900 bg-black/30">
        <span className="font-mono text-[8px] text-neutral-800 tracking-wider">
          {serial}
        </span>
        <span
          className="font-mono text-[8px] px-2 py-0.5 uppercase tracking-wide"
          style={{ background: 'rgba(120,53,15,0.5)', color: '#d97706' }}
        >
          Parceiro
        </span>
      </div>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const AccessGranted = ({ user, profile }) => {
  const isApoiador = (profile && profile.weapon) === 'apoiador';
  const lines = isApoiador
    ? buildApoiadorLines(user && user.displayName)
    : buildMusicianLines(user && user.displayName);

  const [visibleCount, setVisibleCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (visibleCount >= lines.length) return;
    const delay = visibleCount === 0 ? 400 : 220;
    const timer = setTimeout(() => setVisibleCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleCount, lines.length]);

  const isFinished = visibleCount >= lines.length;

  useEffect(() => {
    if (!isFinished) return;
    const t1 = setTimeout(() => setCollapsed(true), 900);
    const t2 = setTimeout(() => setShowCard(true), 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFinished]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const accentColor = isApoiador
    ? 'rgba(180,83,9,0.3)'
    : 'rgba(34,211,238,0.3)';
  const glowColor = isApoiador
    ? 'rgba(180,83,9,0.15)'
    : 'rgba(34,211,238,0.15)';
  const textColor = isApoiador ? 'text-amber-400' : 'text-cyan-400';
  const grantedGlow = isApoiador
    ? '0 0 20px rgba(180,83,9,0.9)'
    : '0 0 20px rgba(34,211,238,0.9)';

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />

      <div className="relative z-10 max-w-md w-full">
        <div className="stripe-obra mb-4" />

        {/* FASE 1: Terminal */}
        {!collapsed && (
          <div
            className="crack-corner border bg-[#0c0c0c] animate-fade-in"
            style={{
              borderColor: accentColor,
              boxShadow: '0 0 30px ' + glowColor,
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900 bg-neutral-950/60">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="font-mono text-[9px] text-neutral-700 ml-2 tracking-widest flex-1">
                UNDERGROUND — {isApoiador ? 'PARCERIA' : 'ACESSO'}
              </span>
            </div>
            <div className="p-6 md:p-8 space-y-1 min-h-[220px]">
              {lines.slice(0, visibleCount).map((line, i) => {
                const isLastLine =
                  line.includes('ACESSO CONCEDIDO') ||
                  line.includes('PROPOSTA RECEBIDA');
                const isBlankLine = line === '';
                const isCurrentLine = i === visibleCount - 1 && !isFinished;
                if (isBlankLine) return <div key={i} className="h-3" />;
                return (
                  <p
                    key={i}
                    className={
                      'font-mono leading-relaxed ' +
                      (isLastLine
                        ? textColor + ' text-lg md:text-xl font-bold mt-2'
                        : isCurrentLine
                          ? 'text-green-400 text-xs md:text-sm'
                          : 'text-neutral-600 text-xs md:text-sm')
                    }
                    style={isLastLine ? { textShadow: grantedGlow } : undefined}
                  >
                    {line}
                    {isCurrentLine && (
                      <span className={'animate-pulse ml-1 ' + textColor}>
                        █
                      </span>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* FASE 2: Barra fina */}
        {collapsed && (
          <div
            className="crack-corner flex items-center justify-between gap-2 px-4 py-2.5 mb-5 border bg-[#0c0c0c] animate-fade-in"
            style={{ borderColor: accentColor }}
          >
            <div className="flex items-center gap-2">
              <span
                className={
                  'w-1.5 h-1.5 rounded-full animate-pulse ' +
                  (isApoiador ? 'bg-amber-500' : 'bg-cyan-400')
                }
              />
              <span
                className={
                  'font-mono text-[9px] tracking-[0.2em] uppercase ' + textColor
                }
              >
                {isApoiador ? 'Proposta Recebida' : 'Acesso Concedido'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-neutral-700 hover:text-red-500 font-mono text-[10px] transition-colors"
            >
              Sair ✕
            </button>
          </div>
        )}

        {/* FASE 3: Ficha */}
        {showCard && (
          <div className="animate-fade-in-up">
            <p className="font-mono text-[9px] text-neutral-700 uppercase tracking-[0.3em] text-center mb-4">
              {isApoiador ? '◈ Ficha de Parceiro ◈' : '◈ Ficha de Operador ◈'}
            </p>

            {isApoiador ? (
              <ApoiadorCard user={user} profile={profile} />
            ) : (
              <MusicianCard user={user} profile={profile} />
            )}

            <p className="font-mono text-[9px] text-neutral-700 text-center mt-5 leading-relaxed">
              {isApoiador ? (
                <span>
                  <span className="text-amber-700">
                    Entraremos em contato em breve.
                  </span>
                  <br />O ecossistema agradece.
                </span>
              ) : (
                <span>
                  Seu nome está na lista.
                  <br />
                  <span className="text-red-500">Aguarde a convocação.</span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessGranted;
