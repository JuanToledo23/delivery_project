import { Box, Grid, Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getEngagement, getCustomers, getStatus, getProjectTypes, getCountries } from 'adapters/Axios/services/project';
import ProjectDataContext from 'context/ProjectDataContext';
import CountrySelector from 'components/CountrySelector/CountrySelector';
import { ApiEngagement, ApiCustomers, ApiStatus, ApiProjectType, ApiCountry } from 'models/Api';
import { useContext, useState, useEffect } from 'react';
import 'dayjs/locale/es-mx';
import './ProjectInformation.css';
import { sortByName } from 'utils/utils';

function ProjectInformation() {

  const { setFormDataContext, setSecodSection, setShowHeader } = useContext(ProjectDataContext);

  const [engagementsCatalog, setEngagementsCatalog] = useState<ApiEngagement[]>([]);
  const [customerCatalog, setCustomerCatalog] = useState<ApiCustomers[]>([]);
  const [projectStatusCatalog, setProjectStatusCatalog] = useState<ApiStatus[]>([]);
  const [projectTypeCatalog, setProjectTypeCatalog] = useState<ApiProjectType[]>([]);
  const [contries, setContries] = useState<ApiCountry[]>([]);

  const [formData, setFormData] = useState<any>({
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

  const [formDataErrors, setFormDataErrors] = useState<any>({
    engagementError: false,
    customerError: false,
    projectNameError: false,
    projectTypeError: false,
    statusError: false,
    commentError: false,
    startDateError: false,
    endDateError: false
  });

  const { engagement, customer, projectName, projectType, startDate, endDate, status, comment } = formData;
  const { engagementError, customerError, projectNameError, projectTypeError, commentError, statusError, startDateError, endDateError } = formDataErrors;

  const handleOnChange = (e: any, start?: boolean) => {
    if(e) {
      if(e.type !== "mousedown") {
        if(e.name === 'country') {
          setFormData({ ...formData, 'country': e.selectedValue })
        } else if (e.$d) {
          if(start) {
            setFormData({ ...formData, 'startDate': e });
            setFormDataErrors({ ...formDataErrors, [`startDateError`]: false });
          } else {
            setFormData({ ...formData, 'endDate': e });
            setFormDataErrors({ ...formDataErrors, [`endDateError`]: false });
          }
        } else {
          if(e.target.name !== undefined) {
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          if(e.target.value === "") {
            setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: true })
          } else {
            setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: false })
          }
        }
      }
    }
  };

  useEffect(() => {
    setShowHeader(true);
    getEngagement().then((response: any) => setEngagementsCatalog(sortByName(response.data as ApiEngagement[])));
    getCustomers().then((response: any) => setCustomerCatalog(sortByName(response.data as ApiCustomers[])));
    getStatus().then((response: any) => setProjectStatusCatalog(sortByName(response.data as ApiStatus[])));
    getProjectTypes().then((response: any) => setProjectTypeCatalog(sortByName(response.data as ApiStatus[])));
    getCountries().then((response: any) => setContries(response.data as ApiCountry[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = () => {
    if(!engagement || !customer || !projectName || !comment || !projectType || !status || !startDate || !endDate) {
      let dataErr = {
        engagementError: false,
        customerError: false,
        projectNameError: false,
        projectTypeError: false,
        commentError: false,
        statusError: false,
        startDateError: false,
        endDateError: false
      };

      if(!engagement) dataErr.engagementError = true;
      if(!customer) dataErr.customerError = true;
      if(!projectName) dataErr.projectNameError = true;
      if(!comment) dataErr.commentError = true;
      if(!projectType) dataErr.projectTypeError = true;
      if(!status) dataErr.statusError = true;
      if(!startDate) dataErr.startDateError = true;
      if(!endDate) dataErr.endDateError = true;

      setFormDataErrors({
        ...formDataErrors, 
        engagementError: dataErr.engagementError,
        customerError: dataErr.customerError,
        projectNameError: dataErr.projectNameError,
        commentError: dataErr.commentError,
        projectTypeError: dataErr.projectTypeError,
        statusError: dataErr.statusError,
        startDateError: dataErr.startDateError,
        endDateError: dataErr.endDateError,
      })
    } else {
      setFormDataContext(formData);
      setSecodSection(true);
    }
  }

  return (
    <div data-testid="ProjectInformation">
      <h4 className='title'>Alta De Proyectos</h4>
      <span className='body1'>Selecciona el país al que pertenece el proyecto.</span>
      <CountrySelector onSelect={handleOnChange} countries={contries.slice(0, 4)} name="country"></CountrySelector>
      <div className='proyect-info-container'>
        <h6>Información del proyecto</h6>
        <span className='body1'>Registra la información solicitada para dar de alta el proyecto.</span>
        <div className="form-grid">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '100%' },
          }}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="engagement-autocomplete"
                freeSolo
                options={engagementsCatalog.map((option) => option.name)}
                renderInput={(params) => {
                  return (
                    <TextField {...params} 
                      variant="filled" 
                      label="ENGAGEMENT"
                      helperText="Ingresa el engagement"
                      name="engagement"
                      value={engagement}
                      onChange={(e) => handleOnChange(e)}
                      onSelect={(e) => handleOnChange(e)} 
                      error={engagementError} />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="client-autocomplete"
                freeSolo
                options={customerCatalog.map((option) => option.name)}
                renderInput={(params) => {
                  return (
                    <TextField {...params} 
                      variant="filled" 
                      label="CLIENTE" 
                      helperText="Ingresa el nombre del cliente" 
                      name="customer"
                      value={customer}
                      onChange={(e) => handleOnChange(e)} 
                      onSelect={(e) => handleOnChange(e)} 
                      error={customerError} />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField id="project" 
                label="PROYECTO" 
                variant="filled" 
                helperText="Ingresa el nombre del proyecto" 
                fullWidth
                name="projectName"
                value={projectName}
                onChange={(e) => handleOnChange(e)}
                onClick={(e) => handleOnChange(e)}
                error={projectNameError} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="project-types-select-label" error={projectTypeError}>TIPO DE PROYECTO</InputLabel>
                <Select
                  labelId="project-types-select-label"
                  id="project-types-select"
                  value={projectType}
                  onChange={(e) => handleOnChange(e)}
                  onOpen={(e) => handleOnChange(e)}
                  name="projectType"
                  error={projectTypeError}
                >
                  {
                    projectTypeCatalog.map((projectType: any) => {
                      return(
                        <MenuItem value={projectType.id} key={`projectType${projectType.id}`}>{projectType.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={projectTypeError}>Selecciona el tipo de proyecto</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                <DesktopDatePicker
                  label="Ingresa la fecha de inicio"
                  inputFormat="MM/DD/YYYY"
                  value={startDate}
                  onChange={(e) => handleOnChange(e, true)}
                  renderInput={(params) =>
                    <TextField {...params}
                      variant="filled"
                      label="MM/DD/AAAA"
                      helperText="Ingresa la fecha de inicio"
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
                  label="Ingresa la fecha de cierre"
                  inputFormat="MM/DD/YYYY"
                  value={endDate}
                  onChange={(e) => handleOnChange(e, false)}
                  renderInput={(params) =>
                    <TextField {...params}
                      variant="filled"
                      label="MM/DD/AAAA"
                      helperText="Ingresa la fecha de cierre"
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
                <InputLabel id="status-select-label" error={statusError}>ESTATUS</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={status}
                  name="status"
                  onChange={(e) => handleOnChange(e)}
                  error={statusError}
                >
                  {
                    projectStatusCatalog.map((status: any) => {
                      return(
                        <MenuItem value={status.id} key={`projectType${status.id}`}>{status.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText error={statusError}>Selecciona un estatus</FormHelperText>
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
            <Grid item xs={12} md={4}>
              <Button variant="contained" onClick={() => goNext()}>CONTINUAR</Button>
            </Grid>
          </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
}


export default ProjectInformation;
