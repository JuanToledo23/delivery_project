
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ConsultPalowan from 'containers/Palowans/ConsultPalowan/ConsultPalowan';
import PalowanRegistration from 'containers/Palowans/PalowanRegistration/PalowanRegistration';
import { SyntheticEvent, useState } from 'react';
import './PalowansContainer.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

function PalowansContainer() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  return (
    <div className='main-content-container' data-testid="PalowansContainer">
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={<span className="text-tab">Alta</span>} />
          <Tab label={<span className="text-tab">Consulta</span>} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PalowanRegistration />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ConsultPalowan />
      </TabPanel>
    </div>
  );
}

export default PalowansContainer;
