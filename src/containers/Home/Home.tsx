import './Home.css';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import ProjectDataContext from 'context/ProjectDataContext';

function Home() {
  const { setShowHeader } = useContext(ProjectDataContext);

  const navigate = useNavigate();

  const goProjects = () => {
    navigate('/register');
  }

  const goPalowans = () => {
    navigate('/palowans');
  }

  useEffect(() => {
    setShowHeader(false);
    if (localStorage.getItem("fullAccess") === "false") navigate('/register');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className='home-container' data-testid="Home">
      <div className='projects' onClick={() => goProjects()}>
        <h4>Proyectos</h4>
      </div>
      <div className='palowans' onClick={() => goPalowans()}> 
        <h4>Palowans</h4>
      </div>
      <div className="decorative-banner"></div>
    </div>
  );
}

export default Home;
