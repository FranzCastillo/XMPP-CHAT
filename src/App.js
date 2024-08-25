import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login.jsx';
import Chat from "./pages/chat";
import Signup from "./pages/signup";

function App() {
    return (
        <Router>
            <main className={"flex min-h-screen flex-col bg-[#121212]"}>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                </Routes>
            </main>
        </Router>
    );
}

export default App;
