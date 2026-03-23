import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GraphPage from './pages/GraphPage';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AdminPage from './pages/AdminPage';
import { ThemeProvider } from './context/ThemeContext';
import { dataService } from './services/dataService';

const App: React.FC = () => {
  useEffect(() => {
    // Track visit on app mount
    dataService.trackVisit().catch(err => console.error("[App] Visit tracking failed:", err));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="graph" element={<GraphPage />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="result" element={<Result />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
