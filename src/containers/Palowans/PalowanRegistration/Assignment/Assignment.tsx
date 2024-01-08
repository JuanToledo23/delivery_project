
import { Grid, TextField, FormControl, InputLabel, FormHelperText, Select, MenuItem, Button, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, IconButton, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { getAllProfiles, getProjectTypes, getEngagement } from "adapters/Axios/services/project";
import ProjectDataContext from 'context/ProjectDataContext';
import Loader from "components/Loader/Loader";
import { useState, useContext, useEffect } from "react";
import arrow from 'assets/img/arrow.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es-mx';
import { getAllProjects, getProperties, postProjectStaff, postStaff } from "adapters/Axios/services/palowans";
import { sortByName } from "utils/utils";

// const formatter = new Intl.NumberFormat('es-MX', {
//   style: 'currency',
//   currency: 'MXN'
// });

function Assignment() {

  const [loading, setLoading] = useState(false);

  const { palowanDataContext, setPalowanDataContext, setPalowanSecodSection } = useContext(ProjectDataContext);

  const [assignment, setAssignment] = useState<any>({
    projectNumber: '',
    typeProject: '',
    allocationPercentage: '',
    startDate: null,
    endDate: null,
    role: '',
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
    startDate,
    endDate,
    role,
    futureProjects,
    comment,
    responsibleFollowUp,
    saleSeniority
  } = assignment;
  const {
    projectNumberError,
    typeProjectError,
    allocationPercentageError,
    startDateError,
    endDateError,
    roleError,
    futureProjectsError,
    commentError,
    responsibleFollowUpError,
    saleSeniorityError
  } = assignmentErrors;


  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [typeProjectCatalog, settypeProjectCatalog] = useState<any[]>([]);
  const [futureProjectsCatalogs, setfutureProjectsCatalogs] = useState<any[]>([]);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);
  const [engagementCatalog, setEngagementCatalog] = useState<any[]>([]);
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  // const [proyectNextCatalog, setProyectNextCatalog] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  
  useEffect(() => {
    getProperties().then((response: any) => setPropertiesCatalog(sortByName(response.data as any[])));
    getAllProjects().then((response: any) => setAllProjects(sortByName(response.data as any[])));
    getProjectTypes().then((response: any) => settypeProjectCatalog(sortByName(response.data as any[])));
    getAllProfiles().then((response: any) => setprofilesCatalog(sortByName(response.data as any[])));
    getEngagement().then((response: any) => setEngagementCatalog(sortByName(response.data as any[])));
    setfutureProjectsCatalogs(
      [
        { id: 1, name: 'Si'},
        { id: 2, name: 'No'}
      ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    // setProyectNextCatalog(propertiesCatalog.filter(prop => prop.id_padre === 6));
    setLevels(propertiesCatalog.filter(prop => prop.id_padre === 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesCatalog])

  const handleOnChange = (e: any, start?: boolean) => {
    if (e) {
      if (e.type !== "mousedown") {
        if (e.$d) {
          if (start) {
            setAssignment({ ...assignment, 'startDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`startDateError`]: false });
          } else {
            setAssignment({ ...assignment, 'endDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`endDateError`]: false });
          }
        } else {
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
  };

  const addAssignment = () => {
    if(!projectNumber || !typeProject || !allocationPercentage || !startDate || !endDate 
      || !role || !futureProjects || !responsibleFollowUp || !comment || !saleSeniority) {
      let dataErr = {
        projectNumberError: false,
        typeProjectError: false,
        allocationPercentageError: false,
        startDateError: false,
        endDateError: false,
        roleError: false,
        discountError: false,
        futureProjectsError: false,
        responsibleFollowUpError: false,
        levelError: false,
        commentError: false,
        saleSeniorityError: false,
      };

      if(!projectNumber) dataErr.projectNumberError = true;
      if(!allocationPercentage) dataErr.allocationPercentageError = true;
      if(!startDate) dataErr.startDateError = true;
      if(!endDate) dataErr.endDateError = true;
      if(!role) dataErr.roleError = true;
      if(!typeProject) dataErr.typeProjectError = true;
      if(!futureProjects) dataErr.futureProjectsError = true;
      if(!responsibleFollowUp) dataErr.responsibleFollowUpError = true;
      if(!comment) dataErr.commentError = true;
      if(!saleSeniority) dataErr.saleSeniorityError = true;

      setAssignmentErrors({ 
        ...assignmentErrors, 
        projectNumberError: dataErr.projectNumberError,
        allocationPercentageError: dataErr.allocationPercentageError,
        startDateError: dataErr.startDateError,
        endDateError: dataErr.endDateError,
        roleError: dataErr.roleError,
        typeProjectError: dataErr.typeProjectError,
        futureProjectsError: dataErr.futureProjectsError,
        responsibleFollowUpError: dataErr.responsibleFollowUpError,
        commentError: dataErr.commentError,
        saleSeniorityError: dataErr.saleSeniorityError
      }) 
    } else {
      setAllAssignments([...allAssignments, {
        id: allAssignments.length + 1,
        projectNumber: allProjects.find((project) => project.id === assignment.projectNumber)?.label,
        allocationPercentage: assignment.allocationPercentage,
        startDate: startDate ? startDate.$d : '',
        endDate: endDate ? endDate.$d : '',
        role: profilesCatalog.find((profile) => profile.id === assignment.role)?.name,
        futureProjects: assignment.futureProjects,
        comment: assignment.comment,
        responsibleFollowUp: assignment.responsibleFollowUp,
        saleSeniority: assignment.saleSeniority
      }])
    }
  }

  const [open, setOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (row: any) => {
    setRowToDelete(row);
    setOpen(true);
  };

  const deleteProfile = () => {
    setAllAssignments(prev => prev.filter(row => row !== rowToDelete));
    setOpen(false);
  };
  
  const savePalowan = () => {
    setLoading(true);
    const dataPalowan = {
      palowan: palowanDataContext.name.toUpperCase(),
      country_id: palowanDataContext.country,
      rol_id: profilesCatalog.find((profile) => profile.name === palowanDataContext.role)?.id,
      English_level: palowanDataContext.level,
      contrato_id: palowanDataContext.contract,
      StartDate: palowanDataContext.startDate,
      ReV_Contrato: palowanDataContext.renewalDate,
      hive_id: palowanDataContext.hive,
      salary: +palowanDataContext.salary.replace(",",""),
      profile_level: palowanDataContext.profileLevel,
      evaluation_id: palowanDataContext.evaluation
    }

    postStaff(dataPalowan).then((response: any) => {
      allAssignments.forEach((assignment) => {
        postProjectStaff(
          {
            proyect_id: allProjects.find((project) => project.label === assignment.projectNumber)?.id,
            staff_id: response.data.id,
            StartDate: assignment.startDate,
            EndDate: assignment.endDate,
            bill_percentage: assignment.allocationPercentage * 0.01,
            proyect_next_id: 1,
            rol_sell_id: profilesCatalog.find((profile) => profile.name === assignment.role)?.id,
            notes_valuable: assignment.comment,
            responsible_follow_up: assignment.responsibleFollowUp,
            Proyect_next: assignment.futureProjects,
            sale_seniority_level_id: assignment.saleSeniority,
          }
        ).then((response: any) => {
          console.log(response)
        })
      })
    }).finally(() => {
      setPalowanDataContext({
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
      setAllAssignments([]);
      setAssignment({
        projectNumber: '',
        typeProject: '',
        allocationPercentage: '',
        startDate: null,
        endDate: null,
        role: '',
        futureProjects: '',
        comment: '',
        responsibleFollowUp: '',
      });
      setLoading(false);
      setPalowanSecodSection(false);
    });

  }

  return (
    <div data-testid="Assignment">
      <div className='flex'>
        <img src={arrow} alt="Regresar" className='back' onClick={() => setPalowanSecodSection(false)} />
        <h4>Asignación De Proyecto</h4>
      </div>
      <span className='body1'>Selecciona el proyecto</span>
      <div className='proyect-info-container space-container-2'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="projectNumber-label" error={projectNumberError}>NUMERO DE PROYECTO</InputLabel>
              <Select
                labelId="projectNumber-label"
                id="projectNumber"
                value={projectNumber}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="projectNumber"
                error={projectNumberError}
              >
                {
                  allProjects.map((project: any) => {
                    return (
                      <MenuItem value={project.id} key={project.id}>{project.label}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={allocationPercentageError}>Selecciona el proyecto</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="project-types-select-label" error={typeProjectError}>TIPO DE PROYECTO</InputLabel>
              <Select
                labelId="project-types-select-label"
                id="project-types-select"
                value={typeProject}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="typeProject"
                error={typeProjectError}
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
              onChange={(e) => handleOnChange(e)}
              id="allocationPercentage"
              label="ASIGNACIÓN"
              variant="filled"
              helperText="Selecciona el porcentaje de asignación"
              fullWidth
              inputProps={{ maxLength: 3 }}
              type="number"
              error={allocationPercentageError} />
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
              <DesktopDatePicker
                label="Fecha de inicio"
                inputFormat="MM/DD/YYYY"
                value={startDate}
                onChange={(e) => handleOnChange(e, true)}
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
                    error={startDateError}
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
                onChange={(e) => handleOnChange(e, false)}
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
              <InputLabel id="role-label" error={roleError}>ROL</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="role"
                error={roleError}
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
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
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
              <InputLabel id="responsible-label" error={responsibleFollowUpError}>RESPONSABLE</InputLabel>
              <Select
                labelId="responsible-label"
                id="responsible"
                value={responsibleFollowUp}
                name="responsibleFollowUp"
                onChange={(e) => handleOnChange(e)}
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
                onChange={(e) => handleOnChange(e)}
                error={saleSeniorityError}
              >
                {
                  levels.map((level: any) => {
                    if(level.name !== "SSR") {
                      return(
                        <MenuItem value={level.id} key={`projectType${level.id}`}>{level.name}</MenuItem>
                      )
                    } else {
                      return null
                    }
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
              onChange={(e) => handleOnChange(e)}
              onClick={(e) => handleOnChange(e)}
              error={commentError}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Button variant="contained" onClick={() => addAssignment()}>AGREGAR A PROYECTO</Button>
          </Grid>
        </Grid>
      </div>
      <div className='profile-table-container'>
        <h6>Información del proyecto</h6>
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
                          {row.role}
                        </TableCell>
                        <TableCell>{row.allocationPercentage}</TableCell>
                        <TableCell>{row.startDate.getMonth()+1+'/'+row.startDate.getDate()+'/'+row.startDate.getFullYear()}</TableCell>
                        <TableCell>{row.endDate.getMonth()+1+'/'+row.endDate.getDate()+'/'+row.endDate.getFullYear()}</TableCell>
                        <TableCell>{row.projectNumber}</TableCell>
                        <TableCell>
                          <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleClickOpen(row)} >
                            <DeleteIcon sx={{ color: "#757575" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <div className='flex-center'>
              <span className='body1'>No se ha asignado ningun proyecto todavia.</span>
            </div>
          )
        }
        <br />
        <Button variant="contained" onClick={() => savePalowan()}>GUARDAR PALOWAN</Button>
      </div>
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

export default Assignment;
