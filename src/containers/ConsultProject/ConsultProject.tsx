import { Box, Typography, Grid, Button, TextField, Tabs, Tab, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';
import { getAllProfiles, getComments, getProfiles } from 'adapters/Axios/services/project';
import Loader from 'components/Loader/Loader';
import { ApiCustomers } from 'models/Api';
import { ROUTES } from 'navigation/routes';
import { useState, useEffect, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { sortByName } from 'utils/utils';
import './ConsultProject.css';
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter';

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

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

function ConsultProject() {

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    getAllProfiles()
      .then((response: any) => setAllProfiles(sortByName(response.data as ApiCustomers[])))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (projectData?.id) {
      getComments(projectData?.id).then((response: any) => {
        setComments(response.data);
      });
      getProfiles(projectData?.id).then((response: any) => {
        let aux: any[] = [];
        response.data.forEach((profile: any) => {
          const profType: any = allProfiles.find((profileType) => profile.profile_id === profileType.id);
          let group: string = '';
          switch (profType.group_id) {
            case 1:
              group = "MANAGEMENT";
              break;
            case 2:
              group = "BIG DATA";
              break;
            case 3:
              group = "DEV";
              break;
          }
          aux.push({ ...profile, name: profType.name, group: group });
        });
        setProfiles(aux);
        setLoading(false);
      });
    }
  }, [projectData]);

  const {
    projectNumber,
    projectType,
    startDate,
    endDate,
    status,
    url,
    margin,
    discount
  } = projectData;

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div data-testid="ConsultProject">
      <h4 className='title'>Consulta de Proyectos</h4>
      <span className='body1'>Selecciona el país al que pertenece el proyecto.</span>
      <ProjectFilter onChange={setProjectData} />
      {
        !!projectData?.id ? (
          <>
            <div className='proyect-info-container space-container-1'>
              <div className='flex-space space'>
                <h6>Información del proyecto</h6>
                <Link to={ROUTES.edit.replace(':id', `${projectNumber}`)}>
                  <Button variant="contained">EDITAR INFORMACIÓN</Button>
                </Link>
              </div>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField value={projectType}
                    id="projectType"
                    name="projectType"
                    label="TIPO DE PROYECTO"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={startDate}
                    id="startDate"
                    name="startDate"
                    label="FECHA DE INICIO"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={endDate}
                    id="endDate"
                    name="endDate"
                    label="FECHA DE CIERRE"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={status}
                    id="status"
                    name="status"
                    label="ESTATUS"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={projectNumber}
                    id="projectNumber"
                    name="projectNumber"
                    label="NUMERO DE PROYECTO"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <div className='url-input'>
                      <div className='over-text'>
                        <a href={url} target="_blank" rel="noreferrer">{url}</a>
                      </div>
                      <div className='title-box'>URL COTIZADOR</div>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={margin}
                    id="margin"
                    name="margin"
                    label="MARGEN"
                    disabled
                    fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField value={discount}
                    id="discount"
                    name="discount"
                    label="DESCUENTO"
                    disabled
                    fullWidth />
                </Grid>
              </Grid>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Comentarios" />
                <Tab label="Perfiles precio inicial" />
                <Tab label="Perfiles precio final" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Comentario</TableCell>
                    </TableHead>
                    <TableBody>
                      {comments.map((row) => {
                        let date = String(row.StartDate).substring(0, 10).split("-");
                        return (
                          <TableRow
                            key={`row_${row.id}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {`${date[1]}/${date[2]}/${date[0]}`}
                            </TableCell>
                            <TableCell>{row.descrip}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableCell>Grupo</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell>Precio por hora</TableCell>
                      <TableCell>Precio por día</TableCell>
                      <TableCell>Precio por mes</TableCell>
                    </TableHead>
                    <TableBody>
                      {profiles.map((profile) => {
                        return (
                          <TableRow
                            key={`profile_${profile.id}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">{profile.group}</TableCell>
                            <TableCell>{profile.name}</TableCell>
                            <TableCell>{formatter.format(profile.price_hour)}</TableCell>
                            <TableCell>{formatter.format(profile.price_day)}</TableCell>
                            <TableCell>{formatter.format(profile.price_month)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableCell>Grupo</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell>Precio por hora</TableCell>
                      <TableCell>Precio por día</TableCell>
                      <TableCell>Precio por mes</TableCell>
                    </TableHead>
                    <TableBody>
                      {profiles.map((profile) => {
                        return (
                          <TableRow
                            key={`profile_${profile.id}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">{profile.group}</TableCell>
                            <TableCell>{profile.name}</TableCell>
                            <TableCell>{formatter.format(profile.price_hour_final)}</TableCell>
                            <TableCell>{formatter.format(profile.price_day_final)}</TableCell>
                            <TableCell>{formatter.format(profile.price_month_final)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
          </>) : null
      }
      {loading && <Loader/>}
    </div>
  );
}

export default ConsultProject;
