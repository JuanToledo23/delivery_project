
import ProjectDataContext from 'context/ProjectDataContext';
import { useContext } from 'react';
import ProjectInformation from './ProjectInformation/ProjectInformation';
import Quoter from './Quoter/Quoter';
import './ProjectRegistration.css';

function ProjectRegistraton() {

  const { secodSection } = useContext(ProjectDataContext);

  return (
    <div data-testid="ProjectRegistration">
      {
        !secodSection ? (
          <ProjectInformation/>
        ) : (
          <Quoter/>
        )
      }
    </div>
  );
}

export default ProjectRegistraton;
