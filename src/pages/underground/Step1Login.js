import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase-config';

const CyberGrid = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }}
  />
);

const CRTScanlines = () => (
  <div
    className="fixed inset-0 z-0 pointer-events-none opacity-[0.1]"
    style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 50%, transparent 50%)',
      backgroundSize: '100% 4px',
    }}
  />
);

const BunkerAtmosphere = () => (
  <>
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]"
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
    <div className="spray-cyan fixed bottom-0 right-0 w-1 h-1 z-0" />
  </>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Step1Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await onLoginSuccess(result.user.uid);
    } catch (err) {
      console.error('[UNDERGROUND] Falha no login:', err);
      setError(
        'FALHA NA AUTENTICAÇÃO. VERIFIQUE SUA CONEXÃO E TENTE NOVAMENTE.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <CyberGrid />
      <BunkerAtmosphere />
      <CRTScanlines />

      <div
        className="relative z-10 max-w-3xl w-full text-center bg-[#0c0c0c]/90 p-6 md:p-12 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pichacao"
        data-tag="DIG DEEPER"
      >
        {/* Status bar */}
        <div className="mb-6 md:mb-8 flex justify-between items-center px-2">
          <span className="font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase">
            Sector: BR_01
          </span>
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        </div>

        {/* Título */}
        <div className="mb-4 mt-2 md:mt-4 w-full">
          <div className="crack-corner relative px-4 md:px-6 py-4 border-2 border-neutral-800 bg-neutral-900/20 w-full">
            <h2
              className="font-sans font-black tracking-tighter leading-[0.85] text-white text-center"
              style={{ fontSize: 'clamp(2.2rem, 10vw, 5.5rem)' }}
            >
              UNDER<span className="text-red-600">GROUND</span>
            </h2>
            <div className="flex items-center gap-4 mt-5 mx-auto w-full max-w-[180px]">
              <div className="h-0.5 flex-1 bg-neutral-800" />
              <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest whitespace-nowrap">
                EST. 2026
              </span>
              <div className="h-0.5 flex-1 bg-neutral-800" />
            </div>
          </div>
        </div>

        <div className="stripe-obra my-5 md:my-6" />

        {/* Manifesto — seus textos originais */}
        <div className="border-t border-b border-neutral-800 py-5 md:py-6 mb-6 bg-neutral-900/30">
          <p className="font-mono text-neutral-300 text-sm leading-relaxed tracking-wide px-4">
            A superfície é ruído. <br />
            <span className="text-red-400 font-bold">
              A profundidade é a verdade.
            </span>
          </p>
          <p className="font-mono text-neutral-600 text-[10px] mt-3 tracking-[0.25em] uppercase">
            Construindo o ecossistema de quem cria e toca por instinto.
          </p>
        </div>

        {error && (
          <div className="border border-red-500/50 bg-red-500/10 p-3 mb-6">
            <p className="font-mono text-red-400 text-xs tracking-wider">
              ⚠ {error}
            </p>
          </div>
        )}

        {/* Botão */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="
            crack-corner
            w-full border-2 border-red-600 bg-transparent text-white
            font-mono font-bold py-5 px-8 text-sm tracking-[0.18em]
            rounded-none uppercase transition-all duration-200
            hover:bg-red-600 hover:shadow-neon-red
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <span className="animate-pulse tracking-[0.3em]">
              INICIALIZANDO...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <GoogleIcon />
              CONECTAR AO UNDERGROUND
            </span>
          )}
        </button>

        <p className="font-mono text-neutral-700 text-[10px] mt-6 tracking-[0.3em] uppercase">
          Acesso restrito.
        </p>
      </div>
    </div>
  );
};

export default Step1Login;
