import { Box, Typography, Grid, Button, TextField, Tabs, Tab, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, Autocomplete } from '@mui/material';
import { getAllProjects, getAssignments, getProperties, getStaff } from 'adapters/Axios/services/palowans';
import { getAllProfiles, getCountries } from 'adapters/Axios/services/project';
import CountrySelector from 'components/CountrySelector/CountrySelector';
import Loader from 'components/Loader/Loader';
import { ApiCountry } from 'models/Api';
import { ROUTES } from 'navigation/routes';
import { useState, useEffect, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { sortByName } from 'utils/utils';
import './ConsultPalowan.css';

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

function ConsultPalowan() {

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState(false);

  const [countryId, setCountryId] = useState<number>(1);

  const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [staffCatalogShow, setStaffCatalogShow] = useState<any[]>([]);
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  const [palowan, setPalowan] = useState('');
  const [consult, setConsult] = useState<boolean>(false);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [contries, setContries] = useState<ApiCountry[]>([]);

  const [formData, setFormData] = useState<any>({
    country: 0,
    name: '',
    role: '',
    level: '',
    contract: '',
    startDate: null,
    renewalDate: null,
    hive: '',
    salary: '',
    profileLevel: '',
    evaluation: ''
  });

  const { 
    name,
    role,
    level,
    contract,
    startDate,
    renewalDate,
    hive,
    salary,
    profileLevel,
    evaluation
  } = formData;

  const [allAssignments, setAllAssignments] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    getStaff().then((response: any) => setStaffCatalog(sortByName(response.data as any[]))).finally(() => setLoading(false));
    getProperties().then((response: any) => setPropertiesCatalog(sortByName(response.data as any[])));
    getAllProfiles().then((response: any) => setprofilesCatalog(sortByName(response.data as any[])));
    getAllProjects().then((response: any) => setAllProjects(sortByName(response.data as any[])));
    getCountries().then((response: any) => setContries(response.data as ApiCountry[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setStaffCatalogShow(
      staffCatalog.filter((staff) => staff.country_id === countryId && 
        staff.contrato_id !== 22 && staff.status_id === 1).sort((a, b) => {
        if (a.palowan < b.palowan) {
          return -1;
        }
        if (a.palowan > b.palowan) {
          return 1;
        }
        return 0;
      })
      );
  }, [staffCatalog, countryId])

  const handleOnChange = (e: any) => {
    setCountryId(e.selectedValue);
  }

  const handleOnChangePalowan = (e: any) => {
    setPalowan(staffCatalog.find((staff) => staff.palowan === e.target.value)?.id)
  }

  const consultPalowan = () => {
    setLoading(true);
    const palowanInfo = staffCatalog.find((staff) => staff.id === Number(palowan));
    getAssignments(palowanInfo.id).then((response: any) => {
      let aux = response.data.map((obj: any) => {
        obj.StartDate = (obj.StartDate.split("T")[0]).split("-");
        obj.EndDate = (obj.EndDate.split("T")[0]).split("-");
        return obj;
      }).filter((obj: any) => obj.status_id === 1);
      setAllAssignments(aux)
    }).finally(() => setLoading(false))

    setConsult(true);
    let startD = String(palowanInfo.StartDate).substring(0, 10).split("-");
    let revD = String(palowanInfo.ReV_Contrato).substring(0, 10).split("-");
    setFormData({
      ...formData,
      'name': palowanInfo.palowan,
      'role': profilesCatalog.find((profile) => profile.id === palowanInfo.rol_id)?.name,
      'level': propertiesCatalog.find((propertie) => propertie.id === palowanInfo.English_level)?.name,
      'contract': propertiesCatalog.find((propertie) => propertie.id === palowanInfo.contrato_id)?.name,
      'startDate': `${startD[1]}/${startD[2]}/${startD[0]}`,
      'renewalDate': `${revD[1]}/${revD[2]}/${revD[0]}`,
      'hive': propertiesCatalog.find((propertie) => propertie.id === palowanInfo.hive_id)?.name,
      'salary': palowanInfo.salary,
      'profileLevel': propertiesCatalog.find((propertie) => propertie.id === palowanInfo.profile_level_id)?.name,
      'evaluation': propertiesCatalog.find((propertie) => propertie.id === palowanInfo?.evaluation_id)?.name
    });
  }

  return (
    <div data-testid="ConsultPalowan">
      <h4 className='title'>Consulta De Palowans</h4>
      <span className='body1'>Selecciona el país al que pertenece el proyecto.</span>
      <CountrySelector onSelect={handleOnChange} countries={contries} name="country"></CountrySelector>
      <Grid container spacing={3} className="grid-space">
        {/* <Grid item xs={12} md={3}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="palowan-label">PALOWAN</InputLabel>
            <Select
              labelId="palowan-label"
              id="palowan"
              value={palowan}
              onChange={(e) => handleOnChangePalowan(e)}
              name="palowan"
            >
              {
                staffCatalogShow.map((palowan: any) => {
                  return (
                    <MenuItem value={palowan.id} key={`palowan${palowan.id}`}>{palowan.palowan}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} md={4}>
          <Autocomplete
            id="palowan-autocomplete"
            freeSolo
            options={staffCatalogShow.map((option) => option.palowan)}
            renderInput={(palowan: any) => {
              return (
                <TextField {...palowan} 
                  variant="filled" 
                  label="PALOWAN" 
                  helperText="Selecciona a un palowan" 
                  name="palowan"
                  value={role}
                  onChange={(e) => handleOnChangePalowan(e)} 
                  onSelect={(e) => handleOnChangePalowan(e)} />
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="contained" onClick={consultPalowan}>CONSULTAR</Button>
        </Grid>
      </Grid>
        {
          consult ? (
            <>
              <div className='proyect-info-container space-container-1'>
                <div className='flex-space space'>
                  <h6>Información del palowan</h6>
                  <Link to={ROUTES.editPalowan.replace(':id', `${palowan}`)}>
                    <Button variant="contained">EDITAR INFORMACIÓN</Button>
                  </Link>
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField value={name}
                      id="name"
                      name="name"
                      label="PALOWAN"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={role}
                      id="role"
                      name="role"
                      label="ROL"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={level}
                      id="level"
                      name="level"
                      label="NIVEL"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={contract}
                      id="contract"
                      name="contract"
                      label="CONTRATO"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={startDate}
                      id="startDate"
                      name="startDate"
                      label="FECHA DE INGRESO"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={renewalDate}
                      id="renewalDate"
                      name="renewalDate"
                      label="FECHA DE RENOVACIÓN DE CONTRATO"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={hive}
                      id="hive"
                      name="hive"
                      label="HIVE"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={formatter.format(salary)}
                      id="salary"
                      name="salary"
                      label="SALARIO"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={profileLevel}
                      id="profileLevel"
                      name="profileLevel"
                      label="SENIORITY"
                      disabled
                      fullWidth />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField value={evaluation}
                      id="evaluation"
                      name="evaluation"
                      label="EVALUACIÓN"
                      disabled
                      fullWidth />
                  </Grid>
                </Grid>
              </div>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Comentarios" />
                  <Tab label="Asignaciones a proyectos" />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableCell>Comentario</TableCell>
                      </TableHead>
                      <TableBody>
                        {allAssignments.map((row) => {
                          return (
                            <TableRow
                              key={`row_${row.id}`}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell>{row.notes_valuable}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </TabPanel>
              <TabPanel value={value} index={1}>
                {
                  allAssignments.length > 0 ? (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                      <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableCell>ROL DE VENTA</TableCell>
                            <TableCell>Porcentaje de asignación</TableCell>
                            <TableCell>Fecha de incio</TableCell>
                            <TableCell>Fecha de salida</TableCell>
                            <TableCell>Numero de proyecto</TableCell>
                            <TableCell></TableCell>
                          </TableHead>
                          <TableBody>
                          {allAssignments.map((row) => (
                            <TableRow
                              key={`row_${row.id}`}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {profilesCatalog.find((profile) => profile.id === row.rol_sell_id)?.name}
                              </TableCell>
                              <TableCell>{+row.bill_percentage*100}</TableCell>
                              <TableCell>{row.StartDate[1]+'/'+row.StartDate[2]+'/'+row.StartDate[0]}</TableCell>
                              <TableCell>{row.EndDate[1]+'/'+row.EndDate[2]+'/'+row.EndDate[0]}</TableCell>
                              <TableCell>{allProjects.find((project) => project.id === row.proyect_id)?.label}</TableCell>
                            </TableRow>
                          ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  ) : (
                    <div className='flex-center'>
                      <span className='body1'>No se ha agregado un perfil todavia.</span>
                    </div>
                  )
                }
              </TabPanel>
            </>) : null
          }

      {loading && <Loader/>}
    </div>
  );
}

export default ConsultPalowan;
