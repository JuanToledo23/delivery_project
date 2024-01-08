
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ConsultProject from 'containers/ConsultProject/ConsultProject';
import ProjectRegistraton from 'containers/ProjectRegistration/ProjectRegistration';
import ProjectAssignments from 'containers/ProjectAssignments/ProjectAssignments';
import { SyntheticEvent, useState } from 'react';
import './MainContainer.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function MainContainer() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className='main-content-container' data-testid="MainContainer-test">
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" data-testid="tab-test">
          <Tab label={<span className="text-tab">Alta</span>} />
          <Tab label={<span className="text-tab">Consulta</span>} />
          <Tab label={<span className="text-tab">Asignaciones</span>} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ProjectRegistraton />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ConsultProject />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProjectAssignments />
      </TabPanel>
    </div>
  );
}

export default MainContainer;
