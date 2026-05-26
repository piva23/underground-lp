import { useState, useCallback, useEffect } from 'react';
import { useSelector }                       from 'react-redux';
import { doc, getDoc, setDoc }               from 'firebase/firestore';

import { db }        from '../../firebase-config';
import Loading       from '../../components/Loading';
import Step1Login    from './Step1Login';
import Step2Arsenal  from './Step2Arsenal';
import Step3Radar    from './Step3Radar';
import AccessGranted from './AccessGranted';

// ─────────────────────────────────────────────────────────────────────────────
// Etapas do fluxo:
//   'login'   → O Portão   (Step1Login)
//   'arsenal' → O Arsenal  (Step2Arsenal)
//   'radar'   → O Radar    (Step3Radar)
//   'granted' → Acesso concedido (AccessGranted)
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  weapon:    null,  // id selecionado em Step2
  soul:      null,  // 'hobby' | 'serio'
  location:  '',
  age:       '',
  bandDna:   '',
  firstSong: '',
  mission:   '',
};

const Underground = () => {
  const { user, status } = useSelector((state) => state.auth);

  const [step,            setStep]            = useState('login');
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [formData,        setFormData]        = useState(INITIAL_FORM);

  // ── Verifica se o usuário já tem perfil no Firestore ─────────────────────
  const checkProfile = useCallback(async (uid) => {
    setCheckingProfile(true);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      setStep(snap.exists() ? 'granted' : 'arsenal');
    } catch (err) {
      console.error('[UNDERGROUND] Erro ao verificar perfil:', err);
      setStep('arsenal'); // fallback: deixa prosseguir
    } finally {
      setCheckingProfile(false);
    }
  }, []);

  // ── Callback para o Step1 após login bem-sucedido no Firebase ────────────
  const handleLoginSuccess = useCallback(
    (uid) => checkProfile(uid),
    [checkProfile],
  );

  // ── Se o usuário já estava autenticado (sessão anterior) ─────────────────
  useEffect(() => {
    if (status === 'success' && user && step === 'login') {
      checkProfile(user.uid);
    }
  }, [status, user, step, checkProfile]);

  // ── Atualiza campos do formulário (patch parcial) ─────────────────────────
  const updateFormData = useCallback((patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  // ── Salva no Firestore e avança para a tela de sucesso ───────────────────
  const handleFinalSubmit = useCallback(async () => {
    if (!user) return;

    await setDoc(doc(db, 'users', user.uid), {
      uid:          user.uid,
      displayName:  user.displayName,
      email:        user.email,
      photoURL:     user.photoURL,
      ...formData,
      registeredAt: new Date().toISOString(),
    });

    setStep('granted');
  }, [user, formData]);

  // ── Aguarda o Firebase resolver o estado de autenticação ─────────────────
  // (mesmo padrão do PrivateRoute do projeto principal)
  if (status === 'idle' || status === 'loading' || checkingProfile) {
    return <Loading />;
  }

  // ── Roteamento interno por etapa ─────────────────────────────────────────
  switch (step) {
    case 'login':
      return <Step1Login onLoginSuccess={handleLoginSuccess} />;

    case 'arsenal':
      return (
        <Step2Arsenal
          formData={formData}
          onUpdate={updateFormData}
          onNext={() => setStep('radar')}
        />
      );

    case 'radar':
      return (
        <Step3Radar
          formData={formData}
          onUpdate={updateFormData}
          onSubmit={handleFinalSubmit}
        />
      );

    case 'granted':
      return <AccessGranted user={user} />;

    default:
      return <Step1Login onLoginSuccess={handleLoginSuccess} />;
  }
};

export default Underground;
