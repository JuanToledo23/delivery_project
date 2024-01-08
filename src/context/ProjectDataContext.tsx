import { PalowanDataContextType, ProjectContextType } from "models/ContextType";
import { createContext, useState } from "react";


const ProjectDataContext = createContext<any>({})

export default ProjectDataContext;

export const ProjectDataProvider = ({children}: {children: any}) => {
  
  const [formDataContext, setFormDataContext] = useState<ProjectContextType>({
    country: 0,
    engagement: '',
    customer: '',
    projectName: '',
    projectType: '',
    startDate: null,
    endDate: null,
    status: '',
    comment: ''
  });

  const [secodSection, setSecodSection] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const [palowanDataContext, setPalowanDataContext] = useState<PalowanDataContextType>({
    country: 0,
    name: '',
    role: '',
    level: '',
    contract: '',
    startDate: null,
    renewalDate: null,
    hive: '',
    comment: ''
  });

  const [ palowanSecodSection, setPalowanSecodSection] = useState(false);

  let contextData = {
    formDataContext, 
    setFormDataContext, 
    secodSection, 
    setSecodSection, 
    showHeader, 
    setShowHeader,
    palowanDataContext, 
    setPalowanDataContext,
    palowanSecodSection, 
    setPalowanSecodSection
  };

  return(
    <ProjectDataContext.Provider value={contextData}>
      {children}
    </ProjectDataContext.Provider>
  )
}