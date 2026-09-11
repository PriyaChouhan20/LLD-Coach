import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { PracticePage } from './pages/PracticePage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { AttemptDetailPage } from './pages/AttemptDetailPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/problems/:slug" element={<ProblemDetailPage />} />
            <Route path="/practice/:slug" element={<PracticePage />} />
            <Route path="/results/:attemptId" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/attempts/:id" element={<AttemptDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
