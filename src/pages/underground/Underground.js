import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '../../firebase-config';
import Loading from '../../components/Loading';
import ManifestoModal from '../../components/ManifestoModal';
import Step1Login from './Step1Login';
import Step2Arsenal from './Step2Arsenal';
import Step3Radar from './Step3Radar';
import Step4Attributes from './Step4Attributes';
import AccessGranted from './AccessGranted';

const INITIAL_FORM = {
  weapon: null,
  soul: null,
  location: '',
  age: '',
  bandDna: '',
  firstSong: '',
  mission: '',
  supportType: '',
  supportProposal: '',
  humorAttrs: {},
  realAttrs: {},
};

// Indicador de progresso mobile — aparece nos steps 2, 3 e 4
const STEP_META = {
  arsenal: { index: 1, label: 'Identificação', total: 4 },
  radar: { index: 2, label: 'Dados Táticos', total: 4 },
  attributes: { index: 3, label: 'Ficha Técnica', total: 4 },
  granted: { index: 4, label: 'Acesso', total: 4 },
};

const StepProgress = ({ step, isApoiador }) => {
  const meta = STEP_META[step];
  if (!meta || step === 'login' || step === 'granted') return null;

  // Apoiador tem 3 steps no total (sem attributes)
  const total = isApoiador ? 3 : 4;
  const index = isApoiador && meta.index > 2 ? meta.index - 1 : meta.index;
  const pct = (index / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-30">
      {/* Barra de progresso */}
      <div className="h-0.5 bg-neutral-900">
        <div
          className="h-0.5 bg-red-600 transition-all duration-500"
          style={{ width: pct + '%' }}
        />
      </div>
      {/* Label — só mobile */}
      <div className="flex justify-between items-center px-4 py-1.5 bg-[#0c0c0c]/95 border-b border-neutral-900 md:hidden">
        <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-[0.2em]">
          {meta.label}
        </span>
        <span className="font-mono text-[9px] text-neutral-700 tracking-widest">
          {index}/{total}
        </span>
      </div>
    </div>
  );
};

const Underground = () => {
  const { user, status } = useSelector(state => state.auth);

  const [step, setStep] = useState('login');
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [savedProfile, setSavedProfile] = useState(null);

  const checkProfile = useCallback(async uid => {
    setCheckingProfile(true);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        setSavedProfile(snap.data());
        setStep('granted');
      } else {
        setStep('arsenal');
      }
    } catch (err) {
      console.error('[UNDERGROUND] Erro ao verificar perfil:', err);
      setStep('arsenal');
    } finally {
      setCheckingProfile(false);
    }
  }, []);

  const handleLoginSuccess = useCallback(
    uid => checkProfile(uid),
    [checkProfile]
  );

  useEffect(() => {
    if (status === 'success' && user && step === 'login') {
      checkProfile(user.uid);
    }
  }, [status, user, step, checkProfile]);

  const updateFormData = useCallback(patch => {
    setFormData(prev => ({ ...prev, ...patch }));
  }, []);

  const handleFinalSubmit = useCallback(async () => {
    if (!user) return;
    const profileData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ...formData,
      registeredAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', user.uid), profileData);
    setSavedProfile(profileData);
    setStep('granted');
  }, [user, formData]);

  const isApoiador = formData.weapon === 'apoiador';

  const isLoading =
    status === 'idle' || status === 'loading' || checkingProfile;

  const renderStep = () => {
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
            onSubmit={() =>
              isApoiador ? handleFinalSubmit() : setStep('attributes')
            }
          />
        );

      case 'attributes':
        return (
          <Step4Attributes
            formData={formData}
            onUpdate={updateFormData}
            onSubmit={handleFinalSubmit}
          />
        );

      case 'granted':
        return <AccessGranted user={user} profile={savedProfile} />;

      default:
        return <Step1Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      {/*
        ManifestoModal fica SEMPRE montado aqui em cima —
        nunca desmonta durante o loading, então o áudio não para.
      */}
      <ManifestoModal />

      {/* Indicador de progresso mobile — some durante loading e login */}
      {!isLoading && <StepProgress step={step} isApoiador={isApoiador} />}

      {/* Conteúdo principal */}
      {isLoading ? <Loading /> : renderStep()}
    </>
  );
};

export default Underground;
