import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header/Header';

const Layout = ({ user, isLoading, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutWithRedirect = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <Header user={user} onLogout={handleLogoutWithRedirect} isLoading={isLoading} />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
