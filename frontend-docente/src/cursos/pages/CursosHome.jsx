import React, { useState } from 'react'
import { CursosLayout } from '../layout';
import { CursosResumen, CursosCopiar } from '../views';

export const CursosHome = ( {vista} ) => {
    
    let contenido;

    if (vista === 'resumen') {
        contenido = <CursosResumen />;
    } else if (vista === 'copiar') {
        contenido = <CursosCopiar />;
    } else {
        contenido = <br></br>;
    }

    return (
        <CursosLayout>
            { contenido }
        </CursosLayout>
    )
}
