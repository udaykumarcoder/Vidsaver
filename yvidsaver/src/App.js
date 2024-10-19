import './App.css';

import { Route, Routes } from 'react-router-dom';
import FAQ from './Components/FAQ/FAQ';
import Home from './Components/Home';
function App() {
  return (
    <>
      <Routes>
        {/* <Route path='/' element={<Home/>} /> */}
        <Route path='/' element={<Home/>} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/faq' element={<FAQ />} />
      </Routes>
    </>
  );
}

export default App;
