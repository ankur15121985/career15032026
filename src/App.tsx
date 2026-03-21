import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GraphPage from './pages/GraphPage';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AdminPage from './pages/AdminPage';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
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
