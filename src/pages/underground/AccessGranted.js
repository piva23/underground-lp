import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';

// ─── Componentes de Ambiente (Preservados para manter o estilo) ──────────────
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

// ─── Gera as linhas do terminal ──────────────────────────────────────────────
const buildTerminalLines = displayName => [
  '> ESTABELECENDO CONEXÃO SEGURA...',
  '> AUTENTICANDO CREDENCIAIS...',
  '> VERIFICANDO LISTA DE ACESSO...',
  `> OPERADOR IDENTIFICADO: ${(displayName || 'MÚSICO').toUpperCase()}`,
  '> NÍVEL DE CLEARANCE: BUNKER',
  '> STATUS DA FICHA: CONFIRMADA',
  '',
  '█  ACESSO CONCEDIDO.',
];

const AccessGranted = ({ user }) => {
  const lines = buildTerminalLines(user?.displayName);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= lines.length) return;
    const delay = visibleCount === 0 ? 500 : 300;
    const timer = setTimeout(() => setVisibleCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleCount, lines.length]);

  const isFinished = visibleCount >= lines.length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error('Falha ao encerrar acesso:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />

      <div className="relative z-10 max-w-lg w-full animate-fade-in">
        {/* Janela de terminal */}
        <div className="border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-[#0c0c0c]">
          {/* Barra de título com botão de saída */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="font-mono text-[10px] text-neutral-600 ml-2 tracking-widest flex-1">
              UNDERGROUND_TERMINAL — ACESSO
            </span>
            {/* Botão de Saída */}
            <button
              onClick={handleLogout}
              className="text-neutral-500 hover:text-red-500 font-mono text-sm px-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Conteúdo do terminal */}
          <div className="p-8 space-y-1 min-h-[300px]">
            {lines.slice(0, visibleCount).map((line, i) => {
              const isGrantedLine = line.includes('ACESSO CONCEDIDO');
              const isBlankLine = line === '';
              const isCurrentLine = i === visibleCount - 1 && !isFinished;

              if (isBlankLine) return <div key={i} className="h-3" />;

              return (
                <p
                  key={i}
                  className={`font-mono leading-relaxed transition-all ${
                    isGrantedLine
                      ? 'text-cyan-400 text-xl font-bold mt-2'
                      : isCurrentLine
                        ? 'text-green-400 text-sm'
                        : 'text-neutral-500 text-sm'
                  }`}
                  style={
                    isGrantedLine
                      ? { textShadow: '0 0 20px rgba(34,211,238,0.9)' }
                      : undefined
                  }
                >
                  {line}
                  {isCurrentLine && (
                    <span className="animate-pulse text-cyan-400 ml-1">█</span>
                  )}
                </p>
              );
            })}
          </div>

          {/* Rodapé pós-terminal */}
          {isFinished && (
            <div className="border-t border-neutral-800 px-8 py-6 animate-fade-in-up">
              <p className="font-mono text-neutral-400 text-sm">
                Seu nome está na lista.
                <br />
                <span className="text-red-400 font-bold">
                  Aguarde a convocação oficial.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessGranted;
