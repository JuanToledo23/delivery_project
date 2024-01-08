import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getAllProfiles, getEngagement, getProjectTypes } from "adapters/Axios/services/project";
import { useState, useEffect, FC } from "react";
import { useParams } from "react-router-dom";
import 'dayjs/locale/es-mx';
import { getAllProjects, getAssignments, getProperties, getStaff } from "adapters/Axios/services/palowans";
import { sortByName } from "utils/utils";
import Loader from "components/Loader/Loader";
import { useForm } from 'react-hook-form';
import './AssignmentForm.css';

interface Props {
  onChange: any;
  value: any;
};

const AssignmentForm: FC<Props>  = (props) => {
  const {
    onChange,
    value
  } = props;

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [infoPalowan, setInfoPalowan] = useState<any>()
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  const [engagementCatalog, setEngagementCatalog] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [forceComment, setForceComment] = useState(false);
  const [commentString, setCommentString] = useState('');

  const [assignment, setAssignment] = useState<any>(value || { });
  
  const [assignmentErrors, setAssignmentErrors] = useState<any>({
    proyect_idError: false,
    project_type_idError: false,
    bill_percentageError: false,
    StartDateError: false,
    EndDateError: false,
    rol_sell_idError: false,
    Proyect_nextError: false,
    notes_valuableError: false,
    responsible_follow_upError: false,
    sale_seniority_level_idError: false
  });

  const { 
    proyect_id,
    project_type_id,
    bill_percentage,
    StartDate,
    EndDate,
    rol_sell_id,
    Proyect_next,
    responsible_follow_up,
    comment,
    sale_seniority_level_id,
    palowan_name
  } = assignment;

  const {
    proyect_idError,
    project_type_idError,
    bill_percentageError,
    StartDateError,
    EndDateError,
    rol_sell_idError,
    responsible_follow_upError,
    commentError,
    sale_seniority_level_idError
  } = assignmentErrors;

  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [typeProjectCatalog, settypeProjectCatalog] = useState<any[]>([]);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);

  const handleOnChangeAssigment = (e: any, start?: boolean) => {
    if (e) {
      if (e.type !== "mousedown") {
        if (e.$d) {
          if (start) {
            setAssignment({ ...assignment, 'StartDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`StartDateError`]: false });
          } else {
            setAssignment({ ...assignment, 'EndDate': e });
            setAssignmentErrors({ ...assignmentErrors, [`EndDateError`]: false });
          }
          setForceComment(true);
        } else {
          if(e.target) {
            if (e.target.name !== undefined) {
              if(e.target.name === "proyect_id") {
                setAssignment({ ...assignment, "proyect_id": e.target.value,
                  "responsible_follow_up": engagementCatalog.find((x) => x.id === allProjects.find((x) => x.id === e.target.value).engagement_id).id,
                  "project_type_id": typeProjectCatalog.find((x) => x.id === allProjects.find((x) => x.id === e.target.value).proyect_type_id).id
                });
              } else if (e.target.name === "comment") {
                setCommentString(e.target.value);
              } else {
                setAssignment({ ...assignment, [e.target.name]: e.target.value });
              }
              setForceComment(true);
            }
            if (e.target.value === "") {
              setAssignmentErrors({ ...assignmentErrors, [`${e.target.name}Error`]: true });
            } else {
              setAssignmentErrors({ ...assignmentErrors, [`${e.target.name}Error`]: false });
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if(commentString.length === 0 && forceComment) {
      setAssignment({ ...assignment, "comment": commentString, validateComment: false });
    } else if(commentString.length > 0 && forceComment) {
      setAssignment({ ...assignment, "comment": commentString, validateComment: true });
    } else if(!forceComment) {
      setAssignment({ ...assignment, "comment": commentString, validateComment: true });
    }
  }, [commentString, forceComment]);
  
  useEffect(() => {
    onChange(assignment);
  }, [assignment]);
  
  const {
    register,
    formState: { errors }
  } = useForm();
  
  useEffect(() => {
    setLoading(true);
    const promises = [
      getProperties(),
      getEngagement(),
      getAllProjects(),
      getProjectTypes(),
      getAllProfiles(),
      getStaff(),
    ];
    if (id) {
      promises.push(getAssignments(id));
    }
    Promise.all(promises).then(responses => {
      setPropertiesCatalog(sortByName(responses[0].data as any[]));
      setEngagementCatalog(sortByName(responses[1].data as any[]));
      setAllProjects(sortByName(responses[2].data as any[]));
      settypeProjectCatalog(sortByName(responses[3].data as any[]));
      setprofilesCatalog(sortByName(responses[4].data as any[]));
      setInfoPalowan(responses[5].data.find((x: any) => '' + x.id === id));
      responses[6]?.data.map((obj: any) => {
        obj.StartDate = new Date(obj.StartDate);
        obj.EndDate = new Date(obj.EndDate);

        return obj;
      }).filter((obj: any) => obj.status_id === 1);

      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.getElementById(`rad_${infoPalowan?.country_id}`)?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoPalowan]);
  
  useEffect(() => {
    setLevels(propertiesCatalog.filter(prop => prop.id_padre === 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesCatalog, infoPalowan]);

  return (
    <div className='AssignmentForm' data-testid="AssignmentForm">
      <Typography variant="h5">{palowan_name}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="proyect_id-label" error={proyect_idError}>NUMERO DE PROYECTO</InputLabel>
            <Select
              labelId="proyect_id-label"
              id="proyect_id-select"
              value={proyect_id}
              onChange={(e) => handleOnChangeAssigment(e)}
              onOpen={(e) => handleOnChangeAssigment(e)}
              inputProps={register('proyect_id')}
              error={proyect_idError}
            >
              {
                allProjects.map((project: any) => {
                  return (
                    <MenuItem value={project.id} key={`projects${project.id}`}>{project.label}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText>Selecciona el proyecto</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="project-types-select-label" error={project_type_idError}>TIPO DE PROYECTO</InputLabel>
            <Select
              labelId="project-types-select-label"
              id="project-types-select"
              value={project_type_id}
              onChange={(e) => handleOnChangeAssigment(e)}
              onOpen={(e) => handleOnChangeAssigment(e)}
              inputProps={register('project_type_id')}
              error={project_type_idError}
              disabled
            >
              {
                typeProjectCatalog.map((typeProject: any) => {
                  return (
                    <MenuItem value={typeProject.id} key={`typeProject${typeProject.id}`}>{typeProject.name}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText error={project_type_idError}>Selecciona el tipo de proyecto</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="responsible_follow_up-label" error={responsible_follow_upError}>RESPONSABLE</InputLabel>
            <Select
              labelId="responsible_follow_up-label"
              id="responsible_follow_up"
              value={responsible_follow_up}
              inputProps={register('responsible_follow_up')}
              onChange={(e) => handleOnChangeAssigment(e)}
              error={responsible_follow_upError}
              disabled
            >
              {
                engagementCatalog.map((engagement: any) => {
                  return(
                    <MenuItem value={engagement.id} key={`projectType${engagement.id}`}>{engagement.name}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText error={responsible_follow_upError}>Selecciona el responsable de la asignación</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
            <DesktopDatePicker
              label="Fecha de inicio"
              inputFormat="MM/DD/YYYY"
              value={typeof StartDate === "string" ? StartDate.replace('Z', '') : StartDate}
              onChange={(e) => handleOnChangeAssigment(e, true)}
              renderInput={(params) =>
                <TextField {...params}
                  variant="filled"
                  label="MM/DD/AAAA"
                  helperText="Fecha de inicio"
                  fullWidth
                  inputProps={{
                    ...params.inputProps,
                    ...register('StartDate'),
                    placeholder: ""
                  }}
                  error={StartDateError}
                />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
            <DesktopDatePicker
              label="Fecha de salida"
              inputFormat="MM/DD/YYYY"
              value={typeof EndDate === "string" ? EndDate.replace('Z', '') : EndDate}
              onChange={(e) => handleOnChangeAssigment(e, false)}
              renderInput={(params) =>
                <TextField {...params}
                  variant="filled"
                  label="MM/DD/AAAA"
                  helperText="Fecha de salida"
                  fullWidth
                  inputProps={{
                    ...params.inputProps,
                    ...register('EndDate'),
                    placeholder: ""
                  }}
                  error={EndDateError}
                />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="rol_sell_id-label" error={rol_sell_idError}>ROL</InputLabel>
            <Select
              labelId="rol_sell_id-label"
              id="rol_sell_id"
              value={rol_sell_id}
              onChange={(e) => handleOnChangeAssigment(e)}
              onOpen={(e) => handleOnChangeAssigment(e)}
              inputProps={register('rol_sell_id')}
              error={rol_sell_idError}
            >
              {
                profilesCatalog.map((group: any) => {
                  return (
                    <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
            <TextField value={bill_percentage} 
            inputProps={register('bill_percentage')}
            id="bill_percentage" 
            label="ASIGNACIÓN" 
            variant="filled" 
            helperText="Selecciona el porcentaje de asignación" 
            fullWidth
            onChange={(e) => handleOnChangeAssigment(e)}
            error={bill_percentageError} />
          </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="sale_seniority_level_id-label" error={sale_seniority_level_idError}>NIVEL DE VENTA</InputLabel>
            <Select
              labelId="sale_seniority_level_id-label"
              id="sale_seniority_level_id"
              value={sale_seniority_level_id}
              inputProps={register('sale_seniority_level_id')}
              onChange={(e) => handleOnChangeAssigment(e)}
              error={sale_seniority_level_idError}
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
            <FormHelperText error={sale_seniority_level_idError}>Selecciona el nivel de venta</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
        <FormControl>
          <FormLabel id="Proyect_next-label">PROYECTOS FUTUROS</FormLabel>
          <RadioGroup
            aria-labelledby="Proyect_next-label"
            defaultValue={Proyect_next ? 1 : 0}
            name="radio-buttons-group-Proyect-next"
            row
          >
            <FormControlLabel value={1} control={<Radio name="Proyect_next" onChange={(e) => handleOnChangeAssigment(e)} />} label="Si" />
            <FormControlLabel value={0} control={<Radio name="Proyect_next" onChange={(e) => handleOnChangeAssigment(e)} />} label="No" />
          </RadioGroup>
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
            inputProps={register('comment')}
            onChange={(e) => handleOnChangeAssigment(e)}
            onClick={(e) => handleOnChangeAssigment(e)}
            error={commentError}
            disabled={!forceComment}
            name="comment"
          />
        </Grid>
      </Grid>
      {loading && <Loader />}
    </div>
  );
}

export default AssignmentForm;
