import { Navigate, Route, Routes } from 'react-router-dom';
import { CursosHome } from '../pages';
import { CursosResumen, CursosCopiar } from '../views';
import { DashboardDocente } from '../../principal/pages/DashboardDocente'; // Importar el dashboard

export const CursosRoutes = () => {
  return (
    <Routes>
        {
          //< Route path="/" element={ <Navigate to="/auth/login" />}  />
        }
        < Route path="dashboard" element={ <DashboardDocente />} />
        < Route path="resumen" element={ <CursosHome vista="resumen" />} />
        < Route path="copiar" element={ <CursosHome vista="copiar" />} />
    </Routes>
  )
}