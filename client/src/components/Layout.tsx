import React, { useEffect, useState } from 'react';
import {
    DashboardCustomizeOutlined as DashboardIcon,
    DashboardCustomize as FDashboardIcon,
    LibraryAddOutlined as LibraryAddIcon,
    LibraryAdd as FLibraryAddIcon,
    PeopleOutline as PeopleIcon,
    People as FPeopleIcon,
    ArticleOutlined as ArticleIcon,
    Article as FArticleIcon,
    SettingsOutlined as SettingsIcon,
    Settings as FSettingsIcon,
    ManageAccountsOutlined as ManageAccountsIcon,
    ManageAccounts as FManageAccountsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useSWR from 'swr';
import AccessToken from 'services/AccessToken';
import { Outlet, Link } from 'react-router-dom';

interface NavigationItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ to, icon, label, isSelected, onSelect }) => {
    return (
        <li className={isSelected ? 'selected' : ''} onClick={onSelect}>
            <Link to={to} className="nav-link">
                <div className="nav-container">
                    <div className="icon-container">{icon}</div>
                    <span className="link-name">{label}</span>
                </div>
            </Link>
        </li>
    );
};

const Layout: React.FC = () => {
    const accessToken = AccessToken.get();
    const [selectedItem, setSelectedItem] = useState<string>('/'); // Track the selected item using its key (e.g., path)
    const handleItemClick = (to: string) => {
        setSelectedItem(to);
    };

    const { data, mutate } = useSWR(accessToken ? '/profile' : null, {
        onError: () => (window.location.href = '/login'),
        revalidateOnfocus: false
    });

    const logout = async () => {
        AccessToken.remove();
        window.location.href = '/login';
        await mutate();
    };
    return (
        <>
            <nav className="sidebar">
                <header>
                    <div className={'image-text'}>
                        <div className={'logo-detail'}>
                            <span className={'logo-name'}>Company Manager</span>
                        </div>
                    </div>
                </header>
                <ul className="nav-links">
                    <span className="title">Tableau de bord</span>
                    <NavigationItem
                        to="/"
                        icon={
                            selectedItem === '/' ? (
                                <FDashboardIcon className="icon" />
                            ) : (
                                <DashboardIcon className="icon" />
                            )
                        }
                        label="Bilan"
                        isSelected={selectedItem === '/'}
                        onSelect={() => handleItemClick('/')}
                    />
                    <NavigationItem
                        to="/generer"
                        icon={
                            selectedItem === '/generer' ? (
                                <FLibraryAddIcon className="icon" />
                            ) : (
                                <LibraryAddIcon className="icon" />
                            )
                        }
                        label="Générer"
                        isSelected={selectedItem === '/generer'}
                        onSelect={() => handleItemClick('/generer')}
                    />
                    <NavigationItem
                        to="/clients"
                        icon={
                            selectedItem === '/clients' ? (
                                <FPeopleIcon className="icon" />
                            ) : (
                                <PeopleIcon className="icon" />
                            )
                        }
                        label="Clients"
                        isSelected={selectedItem === '/clients'}
                        onSelect={() => handleItemClick('/clients')}
                    />
                    <NavigationItem
                        to="/facture"
                        icon={
                            selectedItem === '/facture' ? (
                                <FArticleIcon className="icon" />
                            ) : (
                                <ArticleIcon className="icon" />
                            )
                        }
                        label="Facture"
                        isSelected={selectedItem === '/facture'}
                        onSelect={() => handleItemClick('/facture')}
                    />
                    <NavigationItem
                        to="/reglage"
                        icon={
                            selectedItem === '/reglage' ? (
                                <FSettingsIcon className="icon" />
                            ) : (
                                <SettingsIcon className="icon" />
                            )
                        }
                        label="Réglages"
                        isSelected={selectedItem === '/reglage'}
                        onSelect={() => handleItemClick('/reglage')}
                    />
                    <NavigationItem
                        to="/user"
                        icon={
                            selectedItem === '/user' ? (
                                <FManageAccountsIcon className="icon" />
                            ) : (
                                <ManageAccountsIcon className="icon" />
                            )
                        }
                        label="Utilisateur"
                        isSelected={selectedItem === '/user'}
                        onSelect={() => handleItemClick('/user')}
                    />
                </ul>
                <IconButton className="logout-container" onClick={logout}>
                    {/*<span style={{ color: 'black' }}>{data.data.name}</span>*/}
                    {!data ? <span>Loading...</span> : <span>{data.data.name}</span>}

                    <LogoutIcon className="icon"></LogoutIcon>
                </IconButton>
            </nav>
            <section id="container">
                <Outlet />
            </section>
        </>
    );
};

export default Layout;
