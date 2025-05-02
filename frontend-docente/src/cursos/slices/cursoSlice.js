import { createSlice } from '@reduxjs/toolkit'

export const cursoSlice = createSlice({
    name: "curso",
    initialState: {
        status: '',
        cursoidActivo: null,
        cursos: [],
        estaCargandoCursos: false,
    },
    reducers: {
        iniciaCargaCursos: (state) => {
            state.estaCargandoCursos = true;
        },
        cargaCursos: ( state, action ) => {
            state.cursos = action.payload.cursos;
            state.estaCargandoCursos = false;
        },
        cargaCursoIdActivo: ( state, action ) => {
            state.cursoidActivo = action.payload.cursoidActivo;
        },
    }
});

export const { iniciaCargaCursos, cargaCursos, cargaCursoIdActivo } = cursoSlice.actions;