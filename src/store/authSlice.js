import { createSlice } from '@reduxjs/toolkit';

// Espelho do padrão que você já usa no projeto principal
const initialState = {
  user:            null,    // { uid, displayName, email, photoURL }
  isAuthenticated: false,
  status:          'idle',  // 'idle' | 'loading' | 'success' | 'error'
  error:           null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.status = 'loading';
    },

    authSuccess(state, action) {
      state.user            = action.payload;
      state.isAuthenticated = true;
      state.status          = 'success';
      state.error           = null;
    },

    authLogout(state) {
      state.user            = null;
      state.isAuthenticated = false;
      state.status          = 'success';
      state.error           = null;
    },

    authError(state, action) {
      state.error  = action.payload;
      state.status = 'error';
    },
  },
});

export const { authLoading, authSuccess, authLogout, authError } = authSlice.actions;
export default authSlice.reducer;
