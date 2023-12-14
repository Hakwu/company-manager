import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";

import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Backend from "./services/Backend";


function App() {
    return (
        <SWRConfig
            value={{
                fetcher: Backend.fetcher
            }}
        >
            <Router>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </SWRConfig>
    );
}

export default App;
