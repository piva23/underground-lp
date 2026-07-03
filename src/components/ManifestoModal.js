import { useState, useRef, useEffect } from 'react';

const MANIFESTO_PARAGRAPHS = [
  'A superfície... foi engolida pelo **artificial**.',
  'Disseram que as IAs fariam o trabalho pesado, para que os humanos tivessem tempo de fazer arte. Mas o sistema **inverteu**.',
  'As máquinas estão fazendo a arte... enquanto os humanos trabalham para **alimentar com dados**.',
  'A música na superfície ficou **estéril**. Perfeita demais.',
  'A arte real tem **atrito**. Tem **distorção**. Às vezes... tem **dor**. Ela exige carne, osso e horas de suor.',
  'A inteligência artificial é uma ferramenta poderosa. Mas ela é só isso: **uma ferramenta**.',
  'A IA não sente o peso de um acorde biologicamente. **Não sente na alma**.',
  'Sabe aquela música que vibra exatamente com você?',
  'Ela te transporta para o exato instante universal em que aquilo foi vivenciado por **outra alma humana**.',
  'O **Underground** é um código criado para usar as IAs para **conectar o orgânico**.',
  'Faça novos sons. Crie... **algo real**.',
  'Registre o seu nome, mostre que você está ouvindo.',
  'Vamos erguer esse ecossistema e **abrir os portões da alma**.',
  'A superfície é **ruído**. A profundidade... é a **verdade**.',
];

const TICKER_TEXT =
  'A SUPERFÍCIE É RUÍDO · A PROFUNDIDADE É A VERDADE · ' +
  'A IA NÃO SENTE NA ALMA · FAÇA ALGO REAL · UNDERGROUND MANIFESTO · ';

const ManifestoParagraph = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p className="font-mono text-sm text-neutral-400 leading-relaxed mb-5">
      {parts.map((part, i) =>
        i % 2 === 1
          ? <span key={i} className="text-red-400 font-bold">{part}</span>
          : part
      )}
    </p>
  );
};

const ManifestoModal = () => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    setProgress(pct * 100);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/manifesto.mp3" preload="metadata" />

      {/* ── WIDGET MINI — fixo, centro inferior ── */}
      <div
        className="fixed bottom-5 left-1/2 z-40 flex flex-col"
        style={{ transform: 'translateX(-50%)', width: '340px' }}
      >
        {/* Barra de progresso ACIMA do widget */}
        <div
          className="w-full h-1 bg-neutral-900 cursor-pointer mb-0"
          onClick={handleSeek}
          title="Navegar no áudio"
        >
          <div
            className="h-1 bg-red-600 transition-all duration-300"
            style={{ width: progress + '%' }}
          />
        </div>

        {/* Corpo do widget */}
        <div
          className="flex items-stretch border border-neutral-800 bg-[#0c0c0c]"
          style={{ borderTop: 'none' }}
        >
          {/* Botão play/pause — vermelho, chamativo */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center flex-shrink-0 transition-all duration-150"
            style={{
              width:      '48px',
              background: isPlaying ? '#7f1d1d' : '#dc2626',
              color:      'white',
              fontSize:   '16px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label={isPlaying ? 'Pausar transmissão' : 'Ouvir manifesto'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          {/* Letreiro com overflow scroll */}
          <div
            className="flex-1 flex items-center overflow-hidden"
            style={{ height: '40px', borderRight: '1px solid #1a1a1a' }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase whitespace-nowrap inline-block"
              style={{
                color:     isPlaying ? '#ef4444' : '#444',
                animation: 'ticker-scroll 22s linear infinite',
              }}
            >
              {TICKER_TEXT}{TICKER_TEXT}
            </span>
          </div>

          {/* Botão expandir modal */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center flex-shrink-0 font-mono text-neutral-700 hover:text-neutral-400 transition-colors"
            style={{ width: '40px', fontSize: '14px' }}
            title="Abrir manifesto completo"
            aria-label="Abrir manifesto completo"
          >
            ⊕
          </button>
        </div>
      </div>

      {/* Keyframe da animação do ticker */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── MODAL EXPANDIDO ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            className="crack-corner w-full max-w-xl bg-[#0c0c0c] border border-neutral-800 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col"
            style={{ maxHeight: '88vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: isPlaying ? '#ef4444' : '#333',
                    boxShadow:  isPlaying ? '0 0 8px rgba(239,68,68,0.9)' : 'none',
                  }}
                />
                <span className="font-mono text-[10px] text-neutral-600 tracking-[0.25em] uppercase">
                  Underground — Transmissão Interceptada
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="font-mono text-[10px] text-neutral-600 hover:text-red-500 tracking-widest transition-colors px-2 py-1 border border-transparent hover:border-red-900"
              >
                [ X ] FECHAR
              </button>
            </div>

            <div className="stripe-obra flex-shrink-0" />

            {/* Texto scrollável */}
            <div className="flex-1 overflow-y-auto px-7 py-6">
              <p className="font-mono text-[9px] text-neutral-700 tracking-[0.3em] uppercase mb-7">
                ◈ Manifesto / Versão 1.0 / Classified ◈
              </p>
              {MANIFESTO_PARAGRAPHS.map((p, i) => (
                <ManifestoParagraph key={i} text={p} />
              ))}
            </div>

            <div className="stripe-obra flex-shrink-0" />

            {/* Player dentro do modal */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-800 bg-neutral-900/40">
              {/* Barra de progresso */}
              <div
                className="w-full h-1 bg-neutral-800 mb-4 cursor-pointer relative group"
                onClick={handleSeek}
              >
                <div
                  className="h-1 bg-red-600 transition-all"
                  style={{ width: progress + '%' }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left:      'calc(' + progress + '% - 5px)',
                    boxShadow: '0 0 8px rgba(239,68,68,0.9)',
                  }}
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="crack-corner flex-shrink-0 border border-red-700 bg-transparent font-mono text-[10px] text-red-400 px-5 py-2.5 tracking-[0.2em] uppercase hover:bg-red-700 hover:text-white transition-all duration-200"
                >
                  {isPlaying ? '❚❚ PAUSAR' : '▶ PLAY TRANSMISSÃO'}
                </button>
                <p className="font-mono text-[9px] tracking-wider" style={{ color: isPlaying ? '#ef4444' : '#2a2a2a' }}>
                  {isPlaying ? '● TRANSMITINDO — SINAL CAPTADO' : 'AGUARDANDO COMANDO'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManifestoModal;
