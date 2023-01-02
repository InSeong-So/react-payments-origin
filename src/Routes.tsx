import { HomePage, CardAddPage, CardConfirmPage } from '@/pages';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';

export default function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add-card" element={<CardAddPage />} />
      <Route path="/confirmation" element={<CardConfirmPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
}