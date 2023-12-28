import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { SWRConfig } from 'swr';

import Layout from 'components/Layout';
import Home from 'pages/Home';
import Reglage from './pages/Reglage';
import Clients from './pages/Clients';
import Generer from 'pages/Generer';
import Facture from 'pages/Facture';
import User from 'pages/User';
import Login from 'pages/Login';
import Backend from 'services/Backend';

function App() {
    return (
        <SWRConfig
            value={{
                fetcher: Backend.fetcher
            }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/generer" element={<Generer />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/facture" element={<Facture />} />
                        <Route path="/reglage" element={<Reglage />} />
                        <Route path="/user" element={<User />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </SWRConfig>
    );
}

export default App;
