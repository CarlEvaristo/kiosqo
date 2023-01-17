import './App.css';
import Header from './components/Header';
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Detail from './pages/Detail';

function App() {

  return (
    <>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/news/:id" element={<Detail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
