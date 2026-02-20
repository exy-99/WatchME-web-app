import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MediaDetails from './pages/MovieDetails';
import Saved from './pages/Saved';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="saved" element={<Saved />} />
          <Route path="saved/collection/:id" element={<div className="p-8 text-center text-gray-400">Collection Details feature coming soon...</div>} />
          <Route path="details/movie/:id" element={<MediaDetails />} />
          {/* Fallback */}
          <Route path="*" element={<div className="p-8 text-center text-gray-500">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
