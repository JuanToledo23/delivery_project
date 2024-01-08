import { Box, Typography, Grid, Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, FilledInput, InputAdornment, Button, Tabs, Tab, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, IconButton, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getEngagementForCountry, getGroupProfiles, getAllProfiles, getEngagement, getCustomers, getProjectTypes, getStatus, getGroups, getProject, getComments, getProfiles, postEngagement, postCustomers, getEngagementLike, getCustomersLike, putProject, postComment, deleteProfiles, putProfiles, postProfiles, getCountries } from "adapters/Axios/services/project";
import CountrySelector from "components/CountrySelector/CountrySelector";
import Loader from "components/Loader/Loader";
import { ApiEngagement, ApiCustomers, ApiProjectType, ApiStatus, ApiGroups, ApiProfile, ApiCountry } from "models/Api";
import { useState, SyntheticEvent, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import 'dayjs/locale/es-mx';
import close from 'assets/img/close.svg';
import './EditProject.css';
import ProjectDataContext from 'context/ProjectDataContext';
import { sortByName } from "utils/utils";
import { currencyMask } from "utils/mask";

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

function EditProject() {
  const { setShowHeader } = useContext(ProjectDataContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [engagementsCatalog, setEngagementsCatalog] = useState<ApiEngagement[]>([]);
  const [customerCatalog, setCustomerCatalog] = useState<ApiCustomers[]>([]);
  const [projectTypeCatalog, setProjectTypeCatalog] = useState<ApiProjectType[]>([]);
  const [projectStatusCatalog, setProjectStatusCatalog] = useState<ApiStatus[]>([]);
  const [groupsCatalog, setGroupsCatalog] = useState<ApiGroups[]>([]);
  const [profileCatalog, setProfileCatalog] = useState<any[]>([]);
  const [commentsDisplayed, setCommentsDisplayed] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>('');
  const [commentError, setCommentError] = useState<boolean>(true);

  const [profilesDisplayed, setProfilesDisplayed] = useState<any[]>([]);
  const [deletedProfiles, setDeletedProfiles] = useState<any[]>([]);
  const [addProfileFlag, setAddProfileFlag] = useState(true);

  const [engagementId, setEngagementId] = useState<number>();
  const [customerId, setCustomerId] = useState<number>();

  const [countryId, setCountryId] = useState<any>();
  const [customerName, setCustomerName] = useState<string | undefined>('');
  const [engagementName, setEngagementName] = useState<string | undefined>('');
  const [contries, setContries] = useState<ApiCountry[]>([]);

  const [information, setInformation] = useState<any>({
    engagement: '',
    customer: '',
    projectName: '',
    projectType: '',
    startDate: null,
    endDate: null,
    status: '',
    label: '',
    url: '',
    margin: null,
    discount: null
  });

  const {
    engagement,
    customer,
    projectName,
    projectType,
    startDate,
    endDate,
    status,
    label,
    url,
    margin,
    discount
  } = information;

  const [projectInformation, setProjectInformation] = useState<any>({});

  const [formDataErrors] = useState<any>({
    engagementError: false,
    customerError: false,
    projectNameError: false,
    projectTypeError: false,
  });

  const { engagementError, customerError, projectNameError } = formDataErrors;

  const [profileInfo, setProfileInfo] = useState<any>({
    group: '',
    profile: '',
    price: null
  });

  const { group, profile, price } = profileInfo;

  const [value, setValue] = useState(0);

  const tabHandleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOnChange = (e: any, start?: boolean) => {
    if (e) {
      if (e.type !== "mousedown") {
        if (e.name === 'country') {
          setCountryId(e.selectedValue);
        } else if (e.$d) {
          start ? setInformation({ ...information, 'startDate': e }) : setInformation({ ...information, 'endDate': e })
        } else {
          if (e.target.name !== undefined) {
            setInformation({ ...information, [e.target.name]: e.target.value })
          }
          // if(e.target.value === "") {
          //   setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: true })
          // } else {
          //   setFormDataErrors({ ...formDataErrors, [`${e.target.name}Error`]: false })
          // }
        }
      }
    }
  };

  useEffect(() => {
    console.log(countryId);
    getEngagementForCountry(countryId).then((response: any) => {
      console.log(response);
      setEngagementsCatalog(sortByName(response.data as ApiEngagement[]));
    });
  }, [countryId]);

  useEffect(() => {
    getGroupProfiles(+group).then((response: any) => setProfileCatalog(sortByName(response.data as ApiProfile[])));
  }, [group]);

  useEffect(() => {
    setShowHeader(true);
    setLoading(true);
    getAllProfiles().then((response: any) => setProfileCatalog(sortByName(response.data as ApiCustomers[])));
    getEngagement().then((response: any) => setEngagementsCatalog(sortByName(response.data as ApiEngagement[])));
    getCustomers().then((response: any) => setCustomerCatalog(sortByName(response.data as ApiCustomers[])));
    getProjectTypes().then((response: any) => setProjectTypeCatalog(sortByName(response.data as ApiProjectType[])));
    getStatus().then((response: any) => setProjectStatusCatalog(sortByName(response.data as ApiStatus[])));
    getGroups().then((response: any) => setGroupsCatalog(sortByName(response.data as ApiGroups[])));
    if (id) {
      getProject(+id).then((response: any) => {
        setProjectInformation(response.data[0]);
      });
    }
    getCountries().then((response: any) => setContries(response.data as ApiCountry[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCustomerName(customerCatalog.find((x: any) => x.id === projectInformation.customer_id)?.name);
    setEngagementName(engagementsCatalog.find((x: any) => x.id === projectInformation.engagement_id)?.name);
    setCountryId(projectInformation.country_id);
    document.getElementById(`rad_${projectInformation?.country_id}`)?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInformation]);

  useEffect(() => {
      setInformation({
        ...information,
        'engagement': engagementName,
        'customer': customerName,
        'projectName': projectInformation.name,
        'projectType': projectInformation.proyect_type_id,
        'startDate': projectInformation.StartDate?.split('T')[0],
        'endDate': projectInformation.EndDate?.split('T')[0],
        'status': projectInformation.status_id,
        'label': `${projectInformation.id} ${customerName} ${projectInformation.name}`,
        'url': projectInformation.url_quotation,
        'margin': projectInformation.BusinessMargin * 100,
        'discount': projectInformation.Discount * 100
      });
      if (projectInformation.id) {
        getComments(projectInformation.id).then((response: any) => setCommentsDisplayed(response.data as [])).then(() => setLoading(false));
  
        getProfiles(projectInformation.id).then((response: any) => {
          let aux: any[] = [];
          response.data.forEach((profile: any) => {
            const profType: any = profileCatalog.find((profileType) => profile.profile_id === profileType.id);
            let group: string = '';
            switch (profType?.group_id) {
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
            aux.push({ ...profile, name: profType?.name, group: group, from: 'db', edited: false });
          });
          setProfilesDisplayed(aux);
        });
      }
      createEngagementId();
      createCustomerId();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectInformation, customerName, engagementName]);

  const commentHandleOnChange = (e: any) => {
    if (e.target.value === '') {
      setCommentError(true);
    } else {
      setCommentError(false);
      setComment(e.target.value);
    }

    setComment(e.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (comment === '') setCommentError(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);

  const handleClickOpenEditProfileDialog = (add: boolean, infoProf?: any) => {
    setOpenEditProfileDialog(true);
    if (add) {
      setAddProfileFlag(true);
      setProfileInfo({
        'from': '',
        'profileID': '',
        'group': '',
        'profile': '',
        'price': ''
      });
    } else {
      setAddProfileFlag(false);
      const groupID: any = groupsCatalog.find((x: any) => x.name === infoProf.group)?.id;
      // getGroupProfiles(+groupID).then((response: any) => setProfileCatalog(response.data as ApiProfile[]));
      setProfileInfo({
        'from': infoProf.from,
        'profileID': infoProf.id,
        'group': groupID,
        'profile': infoProf.profile_id,
        'price': infoProf.price_hour
      })
      // setProfileInfo({ 'profile': profileID })
    }
  };

  const handleOnChangeProfile = (e: any) => {
    if (e) {
      if (e.target.name !== undefined) {
        setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value })
      }
    }
  };

  const handleCloseEditProfileDialog = () => {
    setOpenEditProfileDialog(false);
  };

  const saveComment = () => {
    setCommentsDisplayed([...commentsDisplayed, {
      StartDate: new Date().toISOString(),
      descrip: comment,
      id: commentsDisplayed.length + 1
    }]);
    setComment('');
    setNewComments([...newComments, {
      StartDate: new Date().toISOString(),
      descrip: comment
    }]);
    setOpen(false);
  }

  const saveProfile = () => {
    let initial_price = +profileInfo.price.replace(/,/g,"");
    const hour_final: number = initial_price + ((initial_price / (1 - (margin / 100))) - initial_price) - ((initial_price + ((initial_price / (1 - (margin / 100))) - initial_price)) * (discount / 100));
    const day_final: number = initial_price * 8 + ((initial_price * 8 / (1 - (margin / 100))) - initial_price * 8) - ((initial_price * 8 + ((initial_price * 8 / (1 - (margin / 100))) - initial_price * 8)) * (discount / 100));
    const month_final: number = initial_price * 160 + ((initial_price * 160 / (1 - (margin / 100))) - initial_price * 160) - ((initial_price * 160 + ((initial_price * 160 / (1 - (margin / 100))) - initial_price * 160)) * (discount / 100));
    if (addProfileFlag) {
      setProfilesDisplayed([...profilesDisplayed, {
        id: profilesDisplayed.length + 1,
        group: groupsCatalog.find((group) => group.id === profileInfo.group)?.name,
        name: profileCatalog.find((profile) => profile.id === profileInfo.profile)?.name,
        price_hour: +initial_price,
        price_day: +initial_price * 8,
        price_month: +initial_price * 160,
        profile_id: profileInfo.profile,
        price_hour_final: hour_final,
        price_day_final: day_final,
        price_month_final: month_final,
        edited: false,
        from: 'front'
      }])
    } else {
      const newState = profilesDisplayed.map(obj => {
        if (obj.id === profileInfo.profileID) {
          return {
            ...obj,
            group: groupsCatalog.find((x: any) => x.id === profileInfo.group)?.name,
            name: profileCatalog.find((x: any) => x.id === profileInfo.profile)?.name,
            price_hour: +profileInfo.price,
            price_day: +profileInfo.price * 8,
            price_month: +profileInfo.price * 160,
            price_hour_final: hour_final,
            price_day_final: day_final,
            price_month_final: month_final,
            profile_id: profileInfo.profile,
            edited: true
          };
        }
        return obj;
      });
      setProfilesDisplayed(newState);
    }
    setOpenEditProfileDialog(false);
  }

  const [rowToDelete, setRowToDelete] = useState<any>();

  const deleteProfile = () => {
    if (rowToDelete.from === 'db') {
      setDeletedProfiles([...deletedProfiles, rowToDelete]);
    }
    setProfilesDisplayed(prev => prev.filter(row => row !== rowToDelete));
    setOpenDeleteProfile(false);
  }

  const [openDeleteProfile, setOpenDeleteProfile] = useState(false);

  const handleClickOpenDeleteProfile = (row: any) => {
    setRowToDelete(row);
    setOpenDeleteProfile(true);
  };

  const handleCloseDeleteProfile = () => {
    setOpenDeleteProfile(false);
  };

  const getEngagementId = async () => {
    return (await postEngagement({ name: engagement.toUpperCase() })).data.id
  }

  const getCustomerId = async () => {
    return (await postCustomers({ name: customer.toUpperCase() })).data.id
  }

  const createEngagementId = () => {
    if (engagement) {
      let txt = '';
      if (engagement.includes('\'')) {
        console.log(engagement.split('\''));
        txt = engagement.split('\'')[0];
      } else {
        txt = engagement;
      }
      getEngagementLike(txt).then((response: any) => {
        if (response.data.length > 0) {
          setEngagementId(response.data[0].id);
        } else {
          setEngagementId(undefined);
        }
      });
    }
  }

  const createCustomerId = () => {
    if (customer) {
      getCustomersLike(customer).then((response: any) => {
        console.log(response);
        if (response.data.length > 0) {
          setCustomerId(response.data.filter((obj: any) => obj.name === customer)[0].id);
          // setCustomerId(response.data[0].id);
        } else {
          setCustomerId(undefined);
        }
      });
    }
  }

  useEffect(() => {
    createEngagementId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagement]);

  useEffect(() => {
    createCustomerId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);


  const saveEdit = async () => {
    setLoading(true);
    let postEngagementId: any = null;
    let postCustomerId: any = null;
    console.log(engagementId);
    console.log(customerId);
    if (!engagementId) {
      postEngagementId = await getEngagementId();
    }

    if (!customerId) {
      postCustomerId = await getCustomerId();
    }

    const dataProject = {
      id: projectInformation.id,
      name: projectName.toUpperCase(),
      StartDate: typeof startDate === "string" ? startDate : startDate.toISOString(),
      EndDate: typeof endDate === "string" ? endDate : endDate.toISOString(),
      country_id: countryId,
      engagement_id: engagementId ? engagementId : postEngagementId,
      customer_id: customerId ? customerId : postCustomerId,
      status_id: status,
      proyect_type_id: projectType,
      url_quotation: url.toUpperCase(),
      BusinessMargin: (margin * 0.01),
      Discount: (discount * 0.01)
    }

    putProject(dataProject).then(() => {
      if (newComments.length > 0) {
        setLoading(true);
        newComments.forEach(comment => {
          postComment(
            {
              descrip: comment.descrip.toUpperCase(),
              proyect_id: projectInformation.id
            }
          );
        });
      } else {
        setLoading(false);
      }

      if (deletedProfiles.length > 0) {
        setLoading(true);
        deletedProfiles.forEach(profile => {
          deleteProfiles(profile.id);
        });
      } else {
        setLoading(false);
      }

      if (profilesDisplayed) {
        profilesDisplayed.forEach(profile => {
          if (profile.from === 'db' && profile.edited) {
            // setLoading(true);
            profilesDisplayed.forEach(profile => {
              putProfiles({
                id: profile.id,
                profile_id: profile.profile_id,
                proyect_id: projectInformation.id,
                price_hour: profile.price_hour,
                price_day: profile.price_day,
                price_month: profile.price_month,
                price_hour_final: profile.price_hour_final,
                price_day_final: profile.price_day_final,
                price_month_final: profile.price_month_final
              });
            });
          } else if ((profile.from === 'front')) {
            setLoading(true);
            postProfiles({
              profile_id: profile.profile_id,
              proyect_id: projectInformation.id,
              price_hour: +profile.price_hour,
              price_day: +profile.price_day,
              price_month: +profile.price_month,
            });
          } else {
            setLoading(false);
          }
        })
      }
    }).finally(() => {
      setLoading(false);
      navigate('/register');
    });
  }

  return (
    <div className='main-content-container' data-testid="Edit">
      <h4 className='title space-span-sub'>Editar Proyecto</h4>
      <span className='body1'>Selecciona el país al que pertenece el proyecto.</span>
      <CountrySelector onSelect={handleOnChange} countries={contries.slice(0, 4)} name="country"></CountrySelector>
      <div className='proyect-info-container space-container-1'>
        <div className='flex-space space'>
          <h6>Información del proyecto</h6>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              id="engagement-autocomplete"
              freeSolo
              options={engagementsCatalog.map((option) => option.name)}
              value={engagement}
              renderInput={(params) => {
                return (
                  <TextField {...params}
                    variant="filled"
                    label="ENGAGEMENT"
                    helperText="Ingresa el engagement"
                    name="engagement"
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
              value={customer}
              renderInput={(params) => {
                return (
                  <TextField {...params}
                    variant="filled"
                    label="CLIENTE"
                    helperText="Ingresa el nombre del cliente"
                    name="customer"
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
              <InputLabel id="project-types-select-label">TIPO DE PROYECTO</InputLabel>
              <Select
                labelId="project-types-select-label"
                id="project-types-select"
                value={projectType}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="projectType"
              >
                {
                  projectTypeCatalog.map((projectType: any) => {
                    return (
                      <MenuItem value={projectType.id} key={`projectType${projectType.id}`}>{projectType.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText>Selecciona el tipo de proyecto</FormHelperText>
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
                  />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="status-select-label">ESTATUS</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={status}
                name="status"
                onChange={(e) => handleOnChange(e)}
              >
                {
                  projectStatusCatalog.map((status: any) => {
                    return (
                      <MenuItem value={status.id} key={`projectType${status.id}`}>{status.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText>Selecciona un estatus</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField id="label"
              label="NÚMERO DE PROYECTO"
              variant="filled"
              fullWidth
              name="label"
              value={label}
              disabled />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField value={url}
              name="url"
              onChange={(e) => handleOnChange(e)}
              id="url"
              label="URL COTIZADOR"
              variant="filled"
              helperText="Ingresa la URL del cotizador"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: '100%' }} variant="filled">
              <InputLabel htmlFor="margin" shrink={true}>MARGEN DE NEGO</InputLabel>
              <FilledInput
                id="margin"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="filled-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight'
                }}
                type="number"
                value={margin}
                name="margin"
                onChange={(e) => handleOnChange(e)}
              />
              <FormHelperText id="margin-helper-text">Añade el margen</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: '100%' }} variant="filled">
              <InputLabel htmlFor="discount" shrink={true}>DESCUENTO</InputLabel>
              <FilledInput
                id="discount"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="filled-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                  shrink: true
                }}
                type="number"
                value={discount}
                name="discount"
                onChange={(e) => handleOnChange(e)}
              />
              <FormHelperText id="discount-helper-text">Añade el descuento</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} className="flex-align-center">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Link to={'/register'}>
                  <Button variant="outlined" fullWidth>CANCELAR</Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained" onClick={() => saveEdit()} fullWidth>GUARDAR</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tab-space">
          <Tabs value={value} onChange={tabHandleChange} aria-label="basic tabs example">
            <Tab label="Comentarios" />
            <Tab label="Perfiles precio inicial" />
            <Tab label="Perfiles precio final" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div className='flex-space sp-16'>
            <h6>Histórico de comentarios</h6>
            <Button variant="contained" onClick={() => handleClickOpen()}>AGREGAR COMENTARIO</Button>
          </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Comentario</TableCell>
                </TableHead>
                <TableBody>
                  {commentsDisplayed.map((row: any) => {
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
          <div className='flex-space sp-16'>
            <h6>Perfiles</h6>
            <Button variant="contained" onClick={() => handleClickOpenEditProfileDialog(true, profile)}>AGREGAR PERFIL</Button>
          </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} className="profile-table">
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableCell>Grupo</TableCell>
                  <TableCell>Perfil</TableCell>
                  <TableCell>Precio por hora</TableCell>
                  <TableCell>Precio por día</TableCell>
                  <TableCell>Precio por mes</TableCell>
                  <TableCell></TableCell>
                </TableHead>
                <TableBody>
                  {profilesDisplayed.map((profile) => {
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
                        <TableCell className='flexi'>
                          <IconButton color="primary" aria-label="edit" component="label" onClick={() => handleClickOpenEditProfileDialog(false, profile)}>
                            <EditIcon sx={{ color: "#757575" }} />
                          </IconButton>
                          {
                            profilesDisplayed.length > 1 ? (
                              <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleClickOpenDeleteProfile(profile)} >
                                <DeleteIcon sx={{ color: "#757575" }} />
                              </IconButton>
                            ) : null
                          }
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className='flex-space sp-16'>
            <h6>Perfiles</h6>
          </div>
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
                  {profilesDisplayed.map((profile) => {
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
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="add-comment-dialog"
      >
        <DialogContent className="add-comment-dialog-content">
          <DialogContentText id="add-comment-dialog">
            <div className='flex-space'>
              <h6>Comentario</h6>
              <img src={close} alt="close" className='close' onClick={handleClose} />
            </div>
          </DialogContentText>
          <TextField
            id="filled-multiline-flexible"
            label="Añade un comentario sobre el proyecto."
            multiline
            maxRows={5}
            variant="filled"
            fullWidth
            value={comment}
            name="comment"
            onChange={(e) => commentHandleOnChange(e)}
          />
        </DialogContent>
        <hr />
        <DialogActions className='add-comment-actions-container'>
          <Button variant="outlined" onClick={handleClose}>CANCELAR</Button>
          <Button variant="contained" onClick={() => saveComment()} disabled={commentError}>GUARDAR</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditProfileDialog}
        keepMounted
        onClose={handleCloseEditProfileDialog}
        aria-describedby="edit-profile-dialog"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogContent>
          <DialogContentText id="edit-profile-dialog">
            <div className='flex-space sp-16'>
              <h6>Editar información del perfil</h6>
              <img src={close} alt="close" className='close' onClick={handleCloseEditProfileDialog} />
            </div>
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="group-label">GRUPO</InputLabel>
                <Select
                  labelId="group-label"
                  id="group"
                  name="group"
                  value={group}
                  onChange={(e) => handleOnChangeProfile(e)}
                >
                  {
                    groupsCatalog.map((group: any) => {
                      return (
                        <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>Selecciona el grupo</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="profile-label">PERFIL</InputLabel>
                <Select
                  labelId="profile-label"
                  id="profile"
                  name="profile"
                  value={profile}
                  onChange={(e) => handleOnChangeProfile(e)}
                >
                  {
                    profileCatalog.map((profile: any) => {
                      return (
                        <MenuItem value={profile.id} key={profile.id}>{profile.name}</MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>Selecciona el perfil</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField 
                  id="price-per-hour" 
                  type="text"
                  label="$ 0.00" 
                  variant="filled" 
                  helperText="Ingresa el precio por hora"
                  name="price" 
                  onChange={(e) => handleOnChangeProfile(currencyMask(e))}
                  value={price}
                  fullWidth/>
            </Grid>
          </Grid>
        </DialogContent>
        <hr />
        <DialogActions className='add-comment-actions-container'>
          <Button variant="outlined" onClick={handleCloseEditProfileDialog}>CANCELAR</Button>
          <Button variant="contained" onClick={() => saveProfile()}>GUARDAR</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteProfile}
        keepMounted
        onClose={handleCloseDeleteProfile}
        aria-describedby="alert-dialog-delete-profile"
      >
        <DialogContent className='profiles-dialog'>
          <DialogContentText id="alert-dialog-delete-profile">
            <h6>¿Estás seguro que deseas eliminar este perfil?</h6>
          </DialogContentText>
        </DialogContent>
        <hr />
        <DialogActions className='actions-container'>
          <Button variant="outlined" onClick={handleCloseDeleteProfile}>CANCELAR</Button>
          <Button variant="contained" onClick={() => deleteProfile()}>ELIMINAR</Button>
        </DialogActions>
      </Dialog>
      {loading && <Loader />}
    </div>
  );
}

export default EditProject;
