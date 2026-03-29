import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TemplateView from './pages/TemplateView';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/template/:id" element={<TemplateView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
