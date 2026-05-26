// ─────────────────────────────────────────────────────────────────────────────
// Tela de loading com estética cyberpunk/terminal
// ─────────────────────────────────────────────────────────────────────────────
const Loading = () => (
  <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center">
    <div className="border border-cyan-400/40 p-10 text-center shadow-neon-cyan animate-fade-in">

      <p className="font-mono text-cyan-400 text-xs tracking-[0.4em] mb-6 animate-pulse uppercase">
        Inicializando sistema
      </p>

      {/* Barras de carregamento estilo VU meter */}
      <div className="flex gap-[3px] justify-center items-end h-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-2 bg-cyan-400 animate-pulse"
            style={{
              height:            `${8 + (i % 4) * 6}px`,
              animationDelay:    `${i * 0.07}s`,
              animationDuration: '0.9s',
            }}
          />
        ))}
      </div>

      <p className="font-mono text-neutral-600 text-xs mt-6 tracking-[0.3em]">
        UNDERGROUND v1.0
      </p>
    </div>
  </div>
);

export default Loading;
