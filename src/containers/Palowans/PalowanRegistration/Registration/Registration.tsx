import ProjectDataContext from 'context/ProjectDataContext';
import CountrySelector from 'components/CountrySelector/CountrySelector';
import { useContext, useState, useEffect } from 'react';
import 'dayjs/locale/es-mx';
import './Registration.css';
import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es-mx';
import { getAllProfiles, getCountries } from 'adapters/Axios/services/project';
import { getProperties } from 'adapters/Axios/services/palowans';
import { currencyMask } from 'utils/mask';
import { ApiCountry } from 'models/Api';
import { sortByName } from 'utils/utils';

function Registration() {

  const { setPalowanDataContext, setPalowanSecodSection, setShowHeader } = useContext(ProjectDataContext);

  const [englishLevels, setEnglishLevels] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [hives, setHives] = useState<any[]>([]);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [contries, setContries] = useState<ApiCountry[]>([]);

  useEffect(() => {
    setShowHeader(true);
    getAllProfiles().then((response: any) => setprofilesCatalog(sortByName(response.data as any[])));
    getProperties().then((response: any) => setPropertiesCatalog(sortByName(response.data as any[])));
    getCountries().then((response: any) => setContries(response.data as ApiCountry[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setEnglishLevels(propertiesCatalog.filter(prop => prop.descrip === 'ENGLISH LEVEL' && prop.id_padre === 1));
    setContracts(propertiesCatalog.filter(prop => prop.descrip === 'CONTRACT' && prop.id_padre === 2));
    setEvaluations(propertiesCatalog.filter(prop => prop.descrip === 'EVALUATION' && prop.id_padre === 7));
    setHives(propertiesCatalog.filter(prop => prop.descrip === 'HIVE' && prop.id_padre === 3));
    setLevels(propertiesCatalog.filter(prop => prop.id_padre === 5));
  }, [propertiesCatalog])

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

  const handleOnChange = (e: any, start?: boolean) => {
    if(e) {
      if(e.type !== "mousedown") {
        if(e.name === 'country') {
          setFormData({ ...formData, 'country': e.selectedValue })
        } else if (e.$d) {
          console.log(e);
          if(start) {
            setFormData({ ...formData, 'startDate': e });
            setFormDataErrors({ ...formDataErrors, [`startDateError`]: false });
          } else {
            setFormData({ ...formData, 'renewalDate': e });
            setFormDataErrors({ ...formDataErrors, [`renewalDateError`]: false });
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

  const goNext = () => {
    if(!name || !role || !level || !contract || !renewalDate || !startDate || !hive || !salary || !profileLevel || !evaluation) {
      let dataErr = {
        nameError: false,
        roleError: false,
        levelError: false,
        contractError: false,
        renewalDateError: false,
        startDateError: false,
        hiveError: false,
        salaryError: false,
        profileLevelError: false,
        evaluationError: false,
      };

      if(!name) dataErr.nameError = true;
      if(!role) dataErr.roleError = true;
      if(!level) dataErr.levelError = true;
      if(!contract) dataErr.contractError = true;
      if(!renewalDate) dataErr.renewalDateError = true;
      if(!startDate) dataErr.startDateError = true;
      if(!hive) dataErr.hiveError = true;
      if(!salary) dataErr.salaryError = true;
      if(!profileLevel) dataErr.profileLevelError = true;
      if(!evaluation) dataErr.evaluationError = true;

      setFormDataErrors({
        ...formDataErrors, 
        nameError: dataErr.nameError,
        roleError: dataErr.roleError,
        levelError: dataErr.levelError,
        contractError: dataErr.contractError,
        renewalDateError: dataErr.renewalDateError,
        startDateError: dataErr.startDateError,
        hiveError: dataErr.hiveError,
        salaryError: dataErr.salaryError,
        profileLevelError: dataErr.profileLevelError,
        evaluationError: dataErr.evaluationError,
      })
    } else {
      console.log(formData);
      setPalowanDataContext(formData);
      setPalowanSecodSection(true);
    }
  }

  return (
    <div data-testid="Registration">
      <h4 className='title'>Alta de Palowans</h4>
      <span className='body1'>Selecciona el país al que pertenece el palowan.</span>
      <CountrySelector onSelect={handleOnChange} countries={contries} name="country"></CountrySelector>
      <div className='proyect-info-container'>
        <h6>Información del palowan</h6>
        <span className='body1'>Registra la información solicitada para dar de alta al palowan.</span>
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

              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="client-autocomplete"
                  freeSolo
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
                        return(
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
                        return(
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
                        return(
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
              
              <Grid item xs={12} md={12}>
                <Button variant="contained" onClick={() => goNext()}>CONTINUAR</Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
}


export default Registration;
