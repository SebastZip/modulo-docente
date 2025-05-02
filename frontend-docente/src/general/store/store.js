import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../../seguridad/slices';
import { cursoSlice } from '../../cursos/slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    curso: cursoSlice.reducer,
  },
});
