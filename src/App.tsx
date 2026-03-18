/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import GraphPage from './pages/GraphPage';
import AdminPage from './pages/AdminPage';
import ThemeSwitcher from './components/ThemeSwitcher';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSwitcher />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="career-map" element={<Navigate to="/graph" replace />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="result" element={<Result />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
