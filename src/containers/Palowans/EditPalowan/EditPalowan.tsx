import { Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button, Tabs, Tab, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, IconButton, Dialog, DialogContent, DialogContentText, DialogActions, Autocomplete } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllProfiles, getCountries, getEngagement, getProjectTypes } from "adapters/Axios/services/project";
import CountrySelector from "components/CountrySelector/CountrySelector";
import Loader from "components/Loader/Loader";
import { useState, SyntheticEvent, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import 'dayjs/locale/es-mx';
import close from 'assets/img/close.svg';
import './EditPalowan.css';
import { deleteProjectStaff, getAllProjects, getAssignments, getProperties, getStaff, postProjectStaff, putStaff } from "adapters/Axios/services/palowans";
import { currencyMask } from "utils/mask";
import { ApiCountry } from "models/Api";
import { sortByName } from "utils/utils";

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

function EditPalowan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  // const [staffCatalog, setStaffCatalog] = useState<any[]>([]);
  const [englishLevels, setEnglishLevels] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [hives, setHives] = useState<any[]>([]);
  const [infoPalowan, setInfoPalowan] = useState<any>()
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  const [engagementCatalog, setEngagementCatalog] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [contries, setContries] = useState<ApiCountry[]>([]);
  const [formData, setFormData] = useState<any>({
    country: 1,
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

  const [formDataErrors, setFormDataErrors] = useState<any>({
    countryError: false,
    nameError: false,
    roleError: false,
    levelError: false,
    contractError: false,
    startDateError: false,
    renewalDateError: false,
    hiveError: false,
    salaryError: false,
    profileLevelError: false,
    evaluationError: false
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

  const {
    nameError,
    roleError,
    levelError,
    contractError,
    startDateError,
    renewalDateError,
    hiveError,
    salaryError,
    profileLevelError,
    evaluationError
  } = formDataErrors;

  
  const [assignment, setAssignment] = useState<any>({
    id: '',
    projectNumber: '',
    typeProject: '',
    allocationPercentage: '',
    asStartDate: null,
    endDate: null,
    asRole: '',
    futureProjects: '',
    comment: '',
    responsibleFollowUp: '',
    saleSeniority: ''
  });
  
  const [assignmentErrors, setAssignmentErrors] = useState<any>({
    projectNumberError: false,
    typeProjectError: false,
    allocationPercentageError: false,
    startDateError: false,
    endDateError: false,
    roleError: false,
    futureProjectsError: false,
    commentError: false,
    responsibleFollowUpError: false,
    saleSeniorityError: false
  });

  const { 
    projectNumber,
    typeProject,
    allocationPercentage,
    asStartDate,
    endDate,
    asRole,
    futureProjects,
    responsibleFollowUp,
    comment,
    saleSeniority
  } = assignment;

  const {
    projectNumberError,
    typeProjectError,
    allocationPercentageError,
    asStartDateError,
    endDateError,
    asRoleError,
    futureProjectsError,
    responsibleFollowUpError,
    commentError,
    saleSeniorityError
  } = assignmentErrors;

  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [allAssignmentsToDel, setAllAssignmentsToDel] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [typeProjectCatalog, settypeProjectCatalog] = useState<any[]>([]);
  const [futureProjectsCatalogs, setfutureProjectsCatalogs] = useState<any[]>([]);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);

  const [newAssignment, setNewAssignment] = useState<boolean>(false);
  const [addAssignments, setAddAssignments] = useState<boolean>(false);

  const tabHandleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  useEffect(() => {
    setLoading(true);
    getProperties().then((response: any) => setPropertiesCatalog(sortByName(response.data as any[])));
    getEngagement().then((response: any) => setEngagementCatalog(sortByName(response.data as any[])));
    getAllProjects().then((response: any) => setAllProjects(sortByName(response.data as any[])));
    getProjectTypes().then((response: any) => settypeProjectCatalog(sortByName(response.data as any[])));
    getAllProfiles().then((response: any) => setprofilesCatalog(sortByName(response.data as any[])));
    getCountries().then((response: any) => setContries(response.data as ApiCountry[]));
    getAssignments(id).then((response: any) => {
      let aux = response.data.map((obj: any) => {
        obj.StartDate = new Date(obj.StartDate);
        obj.EndDate = new Date(obj.EndDate);
        return obj;
      }).filter((obj: any) => obj.status_id === 1);
      setAllAssignments(aux)
      setAllAssignmentsToDel(aux)
    })
    setfutureProjectsCatalogs(
      [
        { id: 1, name: 'Si'},
        { id: 2, name: 'No'}
      ]
    );
    getStaff().then((response: any) => {
      setInfoPalowan(response.data.find((x: any) => '' + x.id === id))
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setEnglishLevels(propertiesCatalog.filter(prop => prop.descrip === 'ENGLISH LEVEL' && prop.id_padre === 1));
    setContracts(propertiesCatalog.filter(prop => prop.descrip === 'CONTRACT' && prop.id_padre === 2));
    setEvaluations(propertiesCatalog.filter(prop => prop.descrip === 'EVALUATION' && prop.id_padre === 7));
    setHives(propertiesCatalog.filter(prop => prop.descrip === 'HIVE' && prop.id_padre === 3));
    setLevels(propertiesCatalog.filter(prop => prop.id_padre === 5));
    document.getElementById(`rad_${infoPalowan?.country_id}`)?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoPalowan])

  useEffect(() => {
    let startD = String(infoPalowan?.StartDate).substring(0, 10).split("-");
    let revD = String(infoPalowan?.ReV_Contrato).substring(0, 10).split("-");
    setFormData({
      ...formData,
      'country': infoPalowan?.country_id,
      'name': infoPalowan?.palowan,
      'role': profilesCatalog.find((profile) => profile.id === infoPalowan?.rol_id)?.name,
      'level': propertiesCatalog.find((propertie) => propertie.id === infoPalowan?.English_level)?.id,
      'contract': propertiesCatalog.find((propertie) => propertie.id === infoPalowan?.contrato_id)?.id,
      'startDate': `${startD[1]}/${startD[2]}/${startD[0]}`,
      'renewalDate': `${revD[1]}/${revD[2]}/${revD[0]}`,
      'hive': propertiesCatalog.find((propertie) => propertie.id === infoPalowan?.hive_id)?.id,
      'salary': infoPalowan?.salary,
      'profileLevel': propertiesCatalog.find((propertie) => propertie.id === infoPalowan?.profile_level_id)?.id,
      'evaluation': propertiesCatalog.find((propertie) => propertie.id === infoPalowan?.evaluation_id)?.id
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesCatalog, infoPalowan])



  const handleOnChangeAssigment = (e: any, start?: boolean) => {
    if (e) {
      if (e.type !== "mousedown") {
        if (e.$d) {
          if (start) {
            setAssignment({ ...assignment, 'asStartDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`asStartDateError`]: false });
          } else {
            setAssignment({ ...assignment, 'endDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`endDateError`]: false });
          }
        } else {
          if(e.target) {
            if (e.target.name !== undefined) {
              setAssignment({ ...assignment, [e.target.name]: e.target.value })
            }
            if (e.target.value === "") {
              setAssignmentErrors({ ...assignmentErrors, [`${e.target.name}Error`]: true })
            } else {
              setAssignmentErrors({ ...assignmentErrors, [`${e.target.name}Error`]: false })
            }
          }
        }
      }
    }
  };

  const handleOnChange = (e: any, start?: boolean) => {
    if (e) {
      if (e.type !== "mousedown") {
        if (e.$d) {
          if (start) {
            setFormData({ ...formData, 'startDate': e });
            setFormDataErrors({ ...formDataErrors, [`startDateError`]: false });
          } else {
            setFormData({ ...formData, 'renewalDate': e });
            setFormDataErrors({ ...formDataErrors, [`endDateError`]: false });
          }
        } else {
          if(e.target) {
            if (e.target.name !== undefined) {
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            if (e.target.value === "") {
              setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: true })
            } else {
              setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: false })
            }
          }
        }
      }
    }
  };

  const [openEditAssignmentDialog, setopenEditAssignmentDialog] = useState(false);

  const handleCloseEditAssignmentDialog = () => {
    setopenEditAssignmentDialog(false);
    setAddAssignments(false);
  };

  const handleClickOpen = () => {
    setAssignment({
      projectNumber: '',
      typeProject: '',
      allocationPercentage: '',
      asStartDate: null,
      endDate: null,
      asRole: '',
      futureProjects: '',
      responsibleFollowUp: '',
      comment: ''
    })
    setAddAssignments(true);
    // if (comment === '') setCommentError(true);
    setNewAssignment(true);
    setopenEditAssignmentDialog(true);
    
  };


  const [open, setOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = (row: any) => {
    setRowToDelete(row);
    setOpen(true);
  };

  const deleteProfile = () => {
    setAllAssignments(prev => prev.filter(row => row !== rowToDelete));
    setOpen(false);
  };

  const validateFormAssignment = () => {
    if(!projectNumber || !allocationPercentage || !asStartDate || !endDate || !asRole || !typeProject || !futureProjects || !comment || !responsibleFollowUp) {
      let dataErr = {
        projectNumberError: false,
        allocationPercentageError: false,
        asStartDateError: false,
        endDateError: false,
        asRoleError: false,
        commentError: false,
        responsibleFollowUpError: false,
        futureProjectsError: false
      };

      if(!projectNumber) dataErr.projectNumberError = true;
      if(!allocationPercentage) dataErr.allocationPercentageError = true;
      if(!asStartDate) dataErr.asStartDateError = true;
      if(!endDate) dataErr.endDateError = true;
      if(!asRole) dataErr.asRoleError = true;
      if(!comment) dataErr.commentError = true;
      if(!responsibleFollowUp) dataErr.responsibleFollowUpError = true;
      if(!futureProjects) dataErr.futureProjectsError = true;

      setAssignmentErrors({ 
        ...assignmentErrors, 
        projectNumberError: dataErr.projectNumberError,
        allocationPercentageError: dataErr.allocationPercentageError,
        asStartDateError: dataErr.asStartDateError,
        endDateError: dataErr.endDateError,
        asRoleError: dataErr.asRoleError,
        commentError: dataErr.commentError,
        responsibleFollowUpError: dataErr.responsibleFollowUpError,
        futureProjectsError: dataErr.futureProjectsError,
      })
      return false;
    } else return true;
  }

  const addAssignment = () => {
    if(validateFormAssignment()) {
      // let sd = new Date(asStartDate);
      // let ed = new Date(endDate);
      console.log(assignment);
      setAllAssignments([...allAssignments, {
        id: allAssignments.length + 1,
        proyect_id: assignment.projectNumber,
        bill_percentage: assignment.allocationPercentage/100,
        StartDate: new Date(assignment.asStartDate),
        EndDate: new Date(assignment.endDate),
        rol_sell_id: assignment.asRole,
        typeProject: assignment.typeProject,
        Proyect_next: assignment.futureProjects,
        notes_valuable: assignment.comment,
        responsible_follow_up: assignment.responsibleFollowUp,
        staff_id: id,
        sale_seniority_level_id: assignment.saleSeniority
      }])
      handleCloseEditAssignmentDialog();
      setAssignment({
        id: allAssignments.length + 1,
        projectNumber: '',
        typeProject: '',
        allocationPercentage: '',
        asStartDate: null,
        endDate: null,
        asRole: '',
        futureProjects: '',
        saleSeniority: ''
      })
    }
  }

  const editAssignment = (row: any) => {
    console.log(row);
    setNewAssignment(false);
    setAssignment({
      id: row.id,
      projectNumber: allProjects.find((project) => project.id === row.proyect_id)?.id,
      typeProject: typeProjectCatalog.find((type) => type.id === allProjects.find((project) => project.id === row.proyect_id).proyect_type_id)?.id,
      allocationPercentage: row.bill_percentage * 100,
      asStartDate: row.StartDate,
      endDate: row.EndDate,
      asRole: profilesCatalog.find((profile) => profile.id === row.rol_sell_id)?.id,
      futureProjects: row.Proyect_next ? 1 : 2,
      responsibleFollowUp: engagementCatalog.find((engagement) => engagement.id === row.responsible_follow_up)?.id,
      comment: row.notes_valuable,
      saleSeniority: propertiesCatalog.find((propertie) => propertie.id === row?.sale_seniority_level_id)?.id
    })
    setopenEditAssignmentDialog(true);;
  }

  const saveAssignment = () => {
    if(validateFormAssignment()) {
      const newState = allAssignments.map(obj => {
        if (obj.id === assignment.id) {
          return {
            ...obj,
            proyect_id: assignment.projectNumber,
            typeProject: assignment.typeProject,
            bill_percentage: assignment.allocationPercentage / 100,
            StartDate: new Date(assignment.asStartDate),
            EndDate: new Date(assignment.endDate),
            rol_sell_id: assignment.asRole,
            Proyect_next: assignment.futureProjects === 1 ? true : false,
            responsible_follow_up: engagementCatalog.find((engagement) => engagement.id === assignment.responsibleFollowUp)?.id,
            notes_valuable: assignment.comment,
            sale_seniority_level_id: assignment.saleSeniority,
          };
        }
        return obj;
      });
      setAllAssignments(newState);
      handleCloseEditAssignmentDialog();
    }
  }

  const saveAll = () => {
    setLoading(true);
    putStaff({
      id: id,
      palowan: formData.name,
      country_id: formData.country,
      rol_id: profilesCatalog.find((profile) => profile.name === formData.role).id,
      English_level: formData.level,
      contrato_id: formData.contract,
      StartDate: new Date(formData.startDate).toISOString(),
      ReV_Contrato: new Date(formData.renewalDate).toISOString(),
      hive_id: formData.hive,
      salary: formData.salary,
      profile_level: formData.profileLevel,
      evaluation_id: formData.evaluation
    }).then(() => {
      allAssignmentsToDel.forEach((assignment) => {
        deleteProjectStaff(assignment.id);
      })

      const assNumber = allAssignments.length;
  
      allAssignments.forEach((assignment, index) => {
        postProjectStaff({
            proyect_id: assignment.proyect_id,
            staff_id: assignment.staff_id,
            StartDate: assignment.StartDate,
            EndDate: assignment.EndDate,
            bill_percentage: assignment.bill_percentage,
            proyect_next_id: 1,
            rol_sell_id: assignment.rol_sell_id,
            notes_valuable: assignment.notes_valuable.length !== 0 ? assignment.notes_valuable : "_",
            responsible_follow_up: assignment.responsible_follow_up === null ? 25 : assignment.responsible_follow_up,
            Proyect_next: assignment.Proyect_next ? 1 : 0,
            sale_seniority_level_id: assignment.sale_seniority_level_id,
        })
        if(assNumber === index+1) {
          setLoading(false);
          navigate('/palowans');
        }
      })
    })

  }

  return (
    <div className='main-content-container' data-testid="EditPalowan">
      <h4 className='title space-span-sub'>Editar Palowan</h4>
      <span className='body1'>Selecciona el país al que pertenece el palowan.</span>
      <CountrySelector onSelect={handleOnChange} countries={contries} name="country"></CountrySelector>
      <div className='proyect-info-container space-container-1'>
        <div className='flex-space space'>
          <h6>Información del proyecto</h6>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField value={name}
              name="name"
              onChange={(e) => handleOnChange(e)}
              id="name"
              label="PALOWAN"
              variant="filled"
              helperText="Ingresa el nombre completo"
              fullWidth
              error={nameError} />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <TextField value={role}
              name="role"
              onChange={(e) => handleOnChange(e)}
              id="role"
              label="ROL"
              variant="filled"
              helperText="Ingresa el rol de contratación"
              fullWidth
              error={roleError} />
          </Grid> */}
          <Grid item xs={12} md={4}>
            <Autocomplete
              id="role-autocomplete"
              freeSolo
              value={role}
              options={profilesCatalog.map((option) => option.name)}
              renderInput={(params) => {
                return (
                  <TextField {...params} 
                    variant="filled" 
                    label="ROL" 
                    helperText="Ingresa el rol de contratación" 
                    name="role"
                    value={role}
                    onChange={(e) => handleOnChange(e)} 
                    onSelect={(e) => handleOnChange(e)} 
                    error={roleError} />
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="level-select-label" error={levelError}>NIVEL</InputLabel>
              <Select
                labelId="level-select-label"
                id="level-select"
                value={level}
                name="level"
                onChange={(e) => handleOnChange(e)}
                error={levelError}
              >
                {
                  englishLevels.map((englishLevel: any) => {
                    return (
                      <MenuItem value={englishLevel.id} key={`projectType${englishLevel.id}`}>{englishLevel.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={levelError}>Selecciona el nivel de inglés</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="contract-select-label" error={contractError}>CONTRATO</InputLabel>
              <Select
                labelId="contract-select-label"
                id="contract-select"
                value={contract}
                name="contract"
                onChange={(e) => handleOnChange(e)}
                error={contractError}
              >
                {
                  contracts.map((contract: any) => {
                    return (
                      <MenuItem value={contract.id} key={`projectType${contract.id}`}>{contract.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={contractError}>Selecciona el tipo de contrato</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
              <DesktopDatePicker
                label="Fecha de ingreso"
                inputFormat="MM/DD/YYYY"
                value={startDate}
                onChange={(e) => handleOnChange(e, true)}
                renderInput={(params) =>
                  <TextField {...params}
                    variant="filled"
                    label="MM/DD/AAAA"
                    helperText="Fecha de ingreso"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      placeholder: ""
                    }}
                    error={startDateError}
                  />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
              <DesktopDatePicker
                label="Fecha de renovación de contrato"
                inputFormat="MM/DD/YYYY"
                value={renewalDate}
                onChange={(e) => handleOnChange(e, false)}
                renderInput={(params) =>
                  <TextField {...params}
                    variant="filled"
                    label="MM/DD/AAAA"
                    helperText="Fecha de renovación de contrato"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                      placeholder: ""
                    }}
                    error={renewalDateError}
                  />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="hive-select-label" error={hiveError}>HIVE</InputLabel>
              <Select
                labelId="hive-select-label"
                id="hive-select"
                value={hive}
                name="hive"
                onChange={(e) => handleOnChange(e)}
                error={hiveError}
              >
                {
                  hives.map((hive: any) => {
                    return (
                      <MenuItem value={hive.id} key={`projectType${hive.id}`}>{hive.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={hiveError}>Selecciona un el hive al que pertenece</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              id="salary" 
              type="text"
              label="$ 0.00" 
              variant="filled" 
              helperText="Ingresa el salario"
              name="salary" 
              onChange={(e) => handleOnChange(currencyMask(e))}
              error={salaryError}
              value={salary}
              fullWidth/>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="profileLevel-label" error={profileLevelError}>NIVEL DE SENIORITY</InputLabel>
              <Select
                labelId="profileLevel-label"
                id="profileLevel"
                value={profileLevel}
                name="profileLevel"
                onChange={(e) => handleOnChange(e)}
                error={profileLevelError}
              >
                {
                  levels.map((level: any) => {
                    return(
                      <MenuItem value={level.id} key={`projectType${level.id}`}>{level.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={profileLevelError}>Selecciona el nivel de seniority</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="evaluation-label" error={evaluationError}>EVALUACIÓN</InputLabel>
              <Select
                labelId="evaluation-label"
                id="evaluation"
                value={evaluation}
                name="evaluation"
                onChange={(e) => handleOnChange(e)}
                error={evaluationError}
              >
                {
                  evaluations.map((contract: any) => {
                    return(
                      <MenuItem value={contract.id} key={`projectType${contract.id}`}>{contract.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={profileLevelError}>Selecciona evaluación</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4} className="flex-align-center">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Link to={'/palowans'}>
                  <Button variant="outlined" fullWidth>CANCELAR</Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained" onClick={() => saveAll()} fullWidth>GUARDAR</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={tabHandleChange} aria-label="basic tabs example">
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
          <div className='flex-space sp-16'>
            <h6>Asignaciones</h6>
            <Button variant="contained" onClick={() => handleClickOpen()}>AGREGAR ASIGNACIÓN</Button>
          </div>
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
                          <TableCell>{row.bill_percentage*100}</TableCell>
                          <TableCell>{`${row.StartDate.getMonth()+1}/${row.StartDate.getDate()}/${row.StartDate.getFullYear()}`}</TableCell>
                          <TableCell>{`${row.EndDate.getMonth()+1}/${row.EndDate.getDate()}/${row.EndDate.getFullYear()}`}</TableCell>
                          {/* <TableCell>{row.StartDate}</TableCell>
                          <TableCell>{row.EndDate}</TableCell> */}
                          {/* {
                            row.StartDate.length && row.StartDate.length === 3 ? (<TableCell>{row.StartDate[1]+'/'+row.StartDate[2]+'/'+row.StartDate[0]}</TableCell>) :
                            (<TableCell>{row.StartDate}</TableCell>)
                          }

                          {
                            row.EndDate.length && row.EndDate.length === 3 ? (<TableCell>{row.EndDate[1]+'/'+row.EndDate[2]+'/'+row.EndDate[0]}</TableCell>) :
                            (<TableCell>{row.EndDate}</TableCell>)
                          } */}
                          
                          <TableCell>{allProjects.find((project) => project.id === row.proyect_id)?.label}</TableCell>
                          {/* <TableCell>
                            <IconButton color="primary" aria-label="delete" component="label" >
                              <DeleteIcon sx={{ color: "#757575" }} />
                            </IconButton>
                          </TableCell> */}
                          <TableCell className='flexi'>
                            <IconButton color="primary" aria-label="edit" component="label" onClick={() => editAssignment(row)}>
                              <EditIcon sx={{ color: "#757575" }} />
                            </IconButton>
                            {
                              allAssignments.length > 1 ? (
                                <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleClickOpen2(row)} >
                                  <DeleteIcon sx={{ color: "#757575" }} />
                                </IconButton>
                              ) : null
                            }
                          </TableCell>
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
      </div>
      <Dialog
        open={openEditAssignmentDialog}
        keepMounted
        onClose={handleCloseEditAssignmentDialog}
        aria-describedby="edit-profile-dialog"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogContent>
          <DialogContentText id="edit-profile-dialog">
            <div className='flex-space sp-16'>
              <h6>Editar información del perfil</h6>
              <img src={close} alt="close" className='close' onClick={handleCloseEditAssignmentDialog} />
            </div>
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="projectNumber-label" error={projectNumberError}>NUMERO DE PROYECTO</InputLabel>
                <Select
                  labelId="projectNumber-label"
                  id="projectNumber"
                  value={projectNumber}
                  onChange={(e) => handleOnChangeAssigment(e)}
                  onOpen={(e) => handleOnChangeAssigment(e)}
                  name="projectNumber"
                  error={projectNumberError}
                  disabled={!addAssignments}
                >
                  {
                    allProjects.map((project: any) => {
                      return (
                        <MenuItem value={project.id} key={project.id}>{project.label}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>Selecciona el proyecto</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="project-types-select-label" error={typeProjectError}>TIPO DE PROYECTO</InputLabel>
                <Select
                  labelId="project-types-select-label"
                  id="project-types-select"
                  value={typeProject}
                  onChange={(e) => handleOnChangeAssigment(e)}
                  onOpen={(e) => handleOnChangeAssigment(e)}
                  name="typeProject"
                  error={typeProjectError}
                  disabled={!addAssignments}
                >
                  {
                    typeProjectCatalog.map((typeProject: any) => {
                      return (
                        <MenuItem value={typeProject.id} key={`typeProject${typeProject.id}`}>{typeProject.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={typeProjectError}>Selecciona el tipo de proyecto</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField value={allocationPercentage} 
                name="allocationPercentage" 
                onChange={(e) => handleOnChangeAssigment(e)} 
                id="allocationPercentage" 
                label="ASIGNACIÓN" 
                variant="filled" 
                helperText="Selecciona el porcentaje de asignación" 
                fullWidth
                error={allocationPercentageError} />
              </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                <DesktopDatePicker
                  label="Fecha de inicio"
                  inputFormat="MM/DD/YYYY"
                  value={asStartDate}
                  onChange={(e) => handleOnChangeAssigment(e, true)}
                  renderInput={(params) =>
                    <TextField {...params}
                      variant="filled"
                      label="MM/DD/AAAA"
                      helperText="Fecha de inicio"
                      fullWidth
                      inputProps={{
                        ...params.inputProps,
                        placeholder: ""
                      }}
                      error={asStartDateError}
                    />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                <DesktopDatePicker
                  label="Fecha de salida"
                  inputFormat="MM/DD/YYYY"
                  value={endDate}
                  onChange={(e) => handleOnChangeAssigment(e, false)}
                  renderInput={(params) =>
                    <TextField {...params}
                      variant="filled"
                      label="MM/DD/AAAA"
                      helperText="Fecha de salida"
                      fullWidth
                      inputProps={{
                        ...params.inputProps,
                        placeholder: ""
                      }}
                      error={endDateError}
                    />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="asRole-label" error={asRoleError}>ROL</InputLabel>
                <Select
                  labelId="asRole-label"
                  id="asRole"
                  value={asRole}
                  onChange={(e) => handleOnChangeAssigment(e)}
                  onOpen={(e) => handleOnChangeAssigment(e)}
                  name="asRole"
                  error={asRoleError}
                >
                  {
                    profilesCatalog.map((group: any) => {
                      return (
                        <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={roleError}>Selecciona el rol de venta</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="futureProjects-label" error={futureProjectsError}>PROYECTOS FUTUROS</InputLabel>
                <Select
                  labelId="futureProjects-label"
                  id="futureProjects"
                  value={futureProjects}
                  onChange={(e) => handleOnChangeAssigment(e)}
                  onOpen={(e) => handleOnChangeAssigment(e)}
                  name="futureProjects"
                  error={futureProjectsError}
                >
                  {
                    futureProjectsCatalogs.map((group: any) => {
                      return (
                        <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={futureProjectsError}>Selecciona el tipo de contrato</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="responresponsibleFollowUpsible-label" error={responsibleFollowUpError}>RESPONSABLE</InputLabel>
                <Select
                  labelId="responsibleFollowUp-label"
                  id="responsibleFollowUp"
                  value={responsibleFollowUp}
                  name="responsibleFollowUp"
                  onChange={(e) => handleOnChangeAssigment(e)}
                  error={responsibleFollowUpError}
                >
                  {
                    engagementCatalog.map((engagement: any) => {
                      return(
                        <MenuItem value={engagement.id} key={`projectType${engagement.id}`}>{engagement.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={responsibleFollowUpError}>Selecciona el responsable de la asignación</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="saleSeniority-label" error={saleSeniorityError}>NIVEL DE VENTA</InputLabel>
                <Select
                  labelId="saleSeniority-label"
                  id="saleSeniority"
                  value={saleSeniority}
                  name="saleSeniority"
                  onChange={(e) => handleOnChangeAssigment(e)}
                  error={saleSeniorityError}
                >
                  {
                    levels.map((level: any) => {
                      return(
                        <MenuItem value={level.id} key={`projectType${level.id}`}>{level.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={saleSeniorityError}>Selecciona el nivel de venta</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                id="filled-multiline-flexible"
                label="ESCRIBE UN COMENTARIO"
                multiline
                maxRows={6}
                variant="filled"
                fullWidth
                value={comment}
                name="comment"
                onChange={(e) => handleOnChangeAssigment(e)}
                onClick={(e) => handleOnChangeAssigment(e)}
                error={commentError}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <hr />
        <DialogActions className='add-comment-actions-container'>
          <Button variant="outlined" onClick={handleCloseEditAssignmentDialog}>CANCELAR</Button>
          {
            newAssignment ? ( <Button variant="contained" onClick={() => addAssignment()}>AGREGAR ASIGNACIÓN</Button> ) :
            ( <Button variant="contained" onClick={() => saveAssignment()}>GUARDAR ASIGNACIÓN</Button> )
          }
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className='profiles-dialog'>
          <DialogContentText id="alert-dialog-slide-description">
            <h6>¿Estás seguro que deseas eliminar esta asignación?</h6>
          </DialogContentText>
        </DialogContent>
        <hr/>
        <DialogActions className='actions-container'>
          <Button variant="outlined" onClick={handleClose}>CANCELAR</Button>
          <Button variant="contained" onClick={() => deleteProfile()}>ELIMINAR</Button>
        </DialogActions>
      </Dialog>
      {loading && <Loader />}
    </div>
  );
}

export default EditPalowan;
