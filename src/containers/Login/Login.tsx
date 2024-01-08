import './Login.css';
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Login, Providers } from '@microsoft/mgt-react';
import ProjectDataContext from 'context/ProjectDataContext';
import { useIsSignedIn } from 'hooks/microsoft';
import { LocalizationHelper } from "@microsoft/mgt-react";
import { getStaffAccess } from 'adapters/Axios/services/palowans';
import { ApiUser } from 'models/Api';
import Loader from 'components/Loader/Loader';

LocalizationHelper.strings = {
  _components: {
    "login": {
      signInLinkSubtitle: "Iniciar sesión con Microsoft",
      signOutLinkSubtitle: "Cerrar sesión",
    }
  },
};

function LoginHome() {
  const { setShowHeader } = useContext(ProjectDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSignedIn] = useIsSignedIn();
  const [accessUser, setAccessUser] = useState<boolean>(true);
  const provider = Providers.globalProvider;

  const singIn = () => {
    console.log("sing in");
    if(isSignedIn) {
      localStorage.setItem("login", "true");
      setLoading(true);
      getStaffAccess().then(async (response: any) => {
        const dataUser = response.data;
        if (provider) {
          let graphClient = provider.graph.client;
          let userDetails = await graphClient.api('me').get();
          if (isSignedIn && dataUser.some((user: ApiUser) => user.email === userDetails.mail)) {
            if (dataUser.find((user: ApiUser) => user.email === userDetails.mail).all_access === 1) {
              localStorage.setItem("fullAccess", "true");
            } else {
              localStorage.setItem("fullAccess", "false");
            }
            setAccessUser(true);
            if (location.state?.from) {
              navigate(location.state.from);
            } else {
              navigate('/home');
            }
          } else {
            setAccessUser(false);
          }
        }
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    setShowHeader(false);
    if(localStorage.getItem("login") === "false") {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  return (
    <div className="login-container" data-testid="Login">
      <div className="container-center">
        <h2>¡Bienvenido!</h2>
        <p className="body1">El inicio de sesión es a través de su cuenta de PALO IT.</p>
        {/* <Button className="microsoft-login sp-top-32" startIcon={<img src={microsoft} alt="microsoft" className="microsoft-logo"/>} onClick={() => check()} >
          Iniciar sesión con Microsoft
        </Button> */}
        {accessUser ? (<Login loginCompleted={() => singIn()}/>) : (
          <h3>Se necesita la aprobación del administrador.</h3>
        )}
        
        {/* <Login loginCompleted={() => singUpMicrosoft()} logoutCompleted={() => logOut()}/> */}
      </div>
      <div className="decorative-banner"></div>
      {loading && <Loader/>}
    </div>
  );
}

export default LoginHome;

