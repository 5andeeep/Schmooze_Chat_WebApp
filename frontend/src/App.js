import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/chat' Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;
