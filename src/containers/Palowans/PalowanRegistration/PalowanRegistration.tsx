
import ProjectDataContext from 'context/ProjectDataContext';
import { useContext } from 'react';
import Assignment from './Assignment/Assignment';
import './PalowanRegistration.css';
import Registration from './Registration/Registration';

function PalowanRegistration() {

  const { palowanSecodSection } = useContext(ProjectDataContext);

  return (
    <div data-testid="PalowanRegistration">
      {
        !palowanSecodSection ? (
          <Registration/>
        ) : (
          <Assignment/>
        )
      }
    </div>
  );
}

export default PalowanRegistration;
