import { useEffect }   from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';

import { auth }                                    from '../firebase-config';
import { authLoading, authSuccess, authLogout }    from '../store/authSlice';

// ─────────────────────────────────────────────────────────────────────────────
// Ouve o estado de autenticação do Firebase e sincroniza com o Redux.
// Padrão idêntico ao do projeto principal.
// ─────────────────────────────────────────────────────────────────────────────
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authLoading());

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Serializa apenas os dados necessários
        // (o objeto Firebase User não é serializável diretamente pelo Redux)
        dispatch(authSuccess({
          uid:         firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email:       firebaseUser.email,
          photoURL:    firebaseUser.photoURL,
        }));
      } else {
        dispatch(authLogout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
