import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import JobApplicationPage from './pages/JobApplicationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:jobId" element={<JobApplicationPage />} />
        <Route path="/" element={<Navigate to="/404" replace />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600">Job not found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
