import './Header.css';
import Logo from 'assets/img/PALOIT.svg'
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from 'navigation/routes';
import { Login } from '@microsoft/mgt-react';

function Header() {
  
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("fullAccess");
    navigate('/');
  }

  return (
    <header className='header'>
      <div className='title-container'>
        <div className='decorative-bar'></div>
        <div className='login-header'>
          <Login logoutInitiated={() => logOut()} />
        </div>
        <Link to={ROUTES.home} className='homelogo'>
          <img src={Logo} alt='PALO IT Logo' data-testid="go_home" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
