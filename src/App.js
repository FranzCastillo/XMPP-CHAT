import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login.jsx';
// import Dashboard from './components/Dashboard';

function App() {
  return (
      <Router>
        <main className={"flex min-h-screen flex-col bg-[#121212]"}>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            {/*<Route path="/signup" element={<Signup/>}/>*/}
            {/*<Route path="/home" element={<Home/>}/>*/}
          </Routes>
        </main>
      </Router>
  );
}

export default App;
