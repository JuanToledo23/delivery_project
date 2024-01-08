
import { Grid, TextField, FormControl, InputLabel, FilledInput, InputAdornment, FormHelperText, Select, MenuItem, Button, Paper, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, IconButton, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { getGroups, getAllProfiles, getGroupProfiles, getEngagementLike, getCustomersLike, postEngagement, postCustomers, postProject, getProjectId, postComment, postProfiles } from "adapters/Axios/services/project";
import ProjectDataContext from 'context/ProjectDataContext';
import Loader from "components/Loader/Loader";
import { ApiGroups, ApiProfile } from "models/Api";
import { useState, useContext, useEffect } from "react";
import { currencyMask } from "utils/mask";
import arrow from 'assets/img/arrow.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortByName } from "utils/utils";

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

function Quoter() {
  
  const [loading, setLoading] = useState(false);

  const { formDataContext, setFormDataContext, setSecodSection } = useContext(ProjectDataContext);
  const [groupsCatalog, setGroupsCatalog] = useState<ApiGroups[]>([]);
  const [profileCatalog, setProfileCatalog] = useState<ApiProfile[]>([]);
  
  const [allProfiles, setAllProfiles] = useState<any[]>([]);

  const [priceDay, setPriceDay] = useState<string>('$ 0.00');
  const [priceMonth, setPriceMonth] = useState<string>('$ 0.00');

  const [engagementId, setEngagementId] = useState<number>();
  const [customerId, setCustomerId] = useState<number>();

  const [continueSave, setContinueSave] = useState<boolean>(true);

  const [formProfile, setFormProfile] = useState<any>({
    url: '',
    margin: null,
    discount: null,
    group: '',
    profile: '',
    price: null
  });

  const { country, engagement, customer, projectName, projectType, startDate, endDate, status, comment } = formDataContext;
  
  const [formProfileErrors, setformProfileErrors] = useState<any>({
    groupError: false,
    profileError: false,
    priceError: false,
    urlError: false,
    marginError: false,
    discountError: false
  });

  const [rowToDelete, setRowToDelete] = useState<any>();

  const { url, margin, discount, group, profile, price } = formProfile;
  const { groupError, profileError, priceError, urlError, marginError, discountError } = formProfileErrors;

  useEffect(() => {
    getGroups().then((response: any) => setGroupsCatalog(sortByName(response.data as ApiGroups[])));
    getAllProfiles().then((response: any) => setProfileCatalog(sortByName(response.data as ApiProfile[])));
    createInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (e: any) => {
    if(e) {
      if (e.target.name !== undefined) {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value })
      }
      if(e.target.value === "") {
        setformProfileErrors({ ...formProfileErrors, [`${e.target.name}Error`]: true })
      } else {
        setformProfileErrors({ ...formProfileErrors, [`${e.target.name}Error`]: false })
      }
    }
  };

  const addProfile = () => {
    if(!group || !profile || !price || !url || !margin || !discount) {
      let dataErr = {
        groupError: false,
        profileError: false,
        priceError: false,
        urlError: false,
        marginError: false,
        discountError: false,
      };

      if(!group) dataErr.groupError = true;
      if(!profile) dataErr.profileError = true;
      if(!price) dataErr.priceError = true;
      if(!url) dataErr.urlError = true;
      if(!margin) dataErr.marginError = true;
      if(!discount) dataErr.discountError = true;

      setformProfileErrors({ 
        ...formProfileErrors, 
        groupError: dataErr.groupError,
        profileError: dataErr.profileError,
        priceError: dataErr.priceError,
        urlError: dataErr.urlError,
        marginError: dataErr.marginError,
        discountError: dataErr.discountError,
      })
    } else {
      setAllProfiles([...allProfiles, {
        id: allProfiles.length + 1,
        grupo: groupsCatalog.find((group) => group.id === formProfile.group)?.name,
        grupoId: formProfile.group,
        perfil: profileCatalog.find((profile) => profile.id === formProfile.profile)?.name,
        perfilId: formProfile.profile,
        precioporhora: price.replace(/,/g,""),
        preciopordia: priceDay,
        precipormes: priceMonth
      }])
    }
  }

  useEffect(() => {
    if(allProfiles.length > 0) {
      setContinueSave(false);
    } else {
      setContinueSave(true);
    }
  }, [allProfiles])
  

  const calculatePrices = () => {
    const priceNumber = +price.replace(/,/g,"");
    setPriceDay(`${(+priceNumber*8)}`);
    setPriceMonth(`${(+priceNumber*160)}`);
  }

  useEffect(() => {
    getGroupProfiles(+group).then((response: any) => setProfileCatalog(response.data as ApiProfile[]));
  }, [group]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = (row: any) => {
    setRowToDelete(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteProfile = () => {
    setAllProfiles(prev => prev.filter(row => row !== rowToDelete));
    setOpen(false);
  };

  const createInfo = () => {
    let txt = '';
    if (engagement.includes('\'')) {
      txt = engagement.split('\'')[0];
    } else {
      txt = engagement;
    }
    
    getEngagementLike(txt).then((response: any) => {
      if(response.data.length > 0) {
        // setEngagementId(response.data[0].id);
        setEngagementId(response.data.filter((obj: any) => obj.name === engagement)[0].id);
      }
    });

    getCustomersLike(customer).then((response: any) => {
      if(response.data.length > 0) {
        // setCustomerId(response.data[0].id);
        setCustomerId(response.data.filter((obj: any) => obj.name === customer)[0].id);
      }
    });
  }

  const getEngagementId = async () => {
    return (await postEngagement({ name: engagement.toUpperCase() })).data.id
  }

  const getCustomerId = async () => {
    return (await postCustomers({ name: customer.toUpperCase() })).data.id
  }

  const saveProject = async () => {
    setLoading(true);
    let postEngagementId: any = null;
    let postCustomerId: any = null;
    if(!engagementId) {
      postEngagementId = await getEngagementId();
    }

    if(!customerId) {
      postCustomerId = await getCustomerId();
    }

    const dataProject = {
      name: projectName.toUpperCase(),
      StartDate: startDate ? startDate.$d : '',
      EndDate: endDate ? endDate.$d : '',
      country_id: country,
      engagement_id: engagementId ? engagementId : postEngagementId,
      customer_id: customerId ? customerId : postCustomerId,
      status_id: status,
      proyect_type_id: projectType,
      url_quotation: url.toUpperCase(),
      BusinessMargin: (margin*0.01),
      Discount: (discount*0.01)
    }

    postProject(dataProject).then((response: any) => {
      console.log(response);
    }).then(() => {
      getProjectId(projectName).then((response: any) => {
        postComment(
          {
            descrip: comment.toUpperCase(),
            proyect_id: response.data[0].id
          }
        ).then((response: any) => {
          console.log(response);
        });
        console.log(response);
        if(allProfiles.length > 0) {
          allProfiles.forEach(profile => {
            postProfiles({
              profile_id: profile.perfilId,
              proyect_id: response.data[0].id,
              price_hour: +profile.precioporhora,
              price_day: +profile.preciopordia,
              price_month: +profile.precipormes,
            }).then((response: any) => {
              console.log(response);
            })
          });
        }
      }).finally(() => {
        setFormDataContext({
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
        setAllProfiles([]);
        setPriceDay('$ 0.00');
        setPriceMonth('$ 0.00');
        setEngagementId(undefined);
        setCustomerId(undefined);
        setFormProfile({
          url: '',
          margin: null,
          discount: null,
          group: '',
          profile: '',
          price: null
        });
        setLoading(false);
        setSecodSection(false);
      });
    })

  }

  return (
    <div data-testid="Quoter">
      <div className='flex'>
        <img src={arrow} alt="Regresar" className='back' onClick={() => setSecodSection(false)}/>
        <h4>Cotizador</h4>
      </div>
      <div className='proyect-info-container space-container-1'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField value={url} 
            name="url" 
            onChange={(e) => handleOnChange(e)} 
            id="url" 
            label="URL COTIZADOR" 
            variant="filled" 
            helperText="Ingresa la URL del cotizador" 
            fullWidth
            error={urlError} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: '100%' }} variant="filled">
              <InputLabel htmlFor="margin" error={marginError} >MARGEN DE NEGO</InputLabel>
              <FilledInput
                id="margin"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="filled-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
                type="number"
                value={margin}
                name="margin"
                onChange={(e) => handleOnChange(e)}
                error={marginError} 
              />
              <FormHelperText id="margin-helper-text" error={marginError} >Añade el margen</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width: '100%' }} variant="filled">
              <InputLabel htmlFor="discount" error={discountError} >DESCUENTO</InputLabel>
              <FilledInput
                id="discount"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="filled-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
                type="number"
                value={discount} 
                name="discount" 
                onChange={(e) => handleOnChange(e)}
                error={discountError} 
              />
              <FormHelperText id="discount-helper-text" error={discountError} >Añade el descuento</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <span className='body1'>Cotiza los perfiles requeridos para el proyecto.</span>
      <div className='proyect-info-container space-container-2'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="group-label" error={groupError}>GRUPO</InputLabel>
              <Select
                labelId="group-label"
                id="group"
                value={group}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="group"
                error={groupError}
              >
                {
                  groupsCatalog.map((group: any) => {
                    return(
                      <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={groupError}>Selecciona el grupo</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="profile-label" error={profileError}>PERFIL</InputLabel>
              <Select
                labelId="profile-label"
                id="profile"
                value={profile}
                onChange={(e) => handleOnChange(e)}
                onOpen={(e) => handleOnChange(e)}
                name="profile"
                error={profileError}
              >
                {
                  profileCatalog.map((profile: any) => {
                    return(
                      <MenuItem value={profile.id} key={profile.id}>{profile.name}</MenuItem>
                    )
                  })
                }
              </Select>
              <FormHelperText error={profileError}>Selecciona el perfil</FormHelperText>
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
              onChange={(e) => handleOnChange(currencyMask(e))}
              onKeyUp={() => calculatePrices()}
              error={priceError}
              value={price}
              fullWidth/>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField value={formatter.format(+priceDay)} id="price-per-day" label="" variant="filled" helperText="El precio por día se calcula automáticamente" disabled fullWidth/>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField value={formatter.format(+priceMonth)} id="price-per-month" label="" variant="filled" helperText="El precio por mes se calcula automáticamente" disabled fullWidth/>
          </Grid>
          <Grid item xs={12} md={4} className="align-right">
            <Button variant="contained" onClick={() => addProfile()}>Agregar perfil</Button>
          </Grid>
        </Grid>
      </div>
      <div className='profile-table-container'>
        <h6>Información del proyecto</h6>
        {
          allProfiles.length > 0 ? (
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
                  {allProfiles.map((row) => (
                    <TableRow
                      key={`row_${row.id}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.grupo}
                      </TableCell>
                      <TableCell>{row.perfil}</TableCell>
                      <TableCell>{formatter.format(row.precioporhora)}</TableCell>
                      <TableCell>{formatter.format(row.preciopordia)}</TableCell>
                      <TableCell>{formatter.format(row.precipormes)}</TableCell>
                      <TableCell>
                        <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleClickOpen(row)} >
                          <DeleteIcon sx={{color: "#757575"}} />
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
              <span className='body1'>No se ha agregado un perfil todavia.</span>
            </div>
          )
        }
        <br/>
        <Button variant="contained" onClick={() => saveProject()} disabled={continueSave}>Guardar proyecto</Button>
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className='profiles-dialog'>
          <DialogContentText id="alert-dialog-slide-description">
            <h6>¿Estás seguro que deseas eliminar este perfil?</h6>
          </DialogContentText>
        </DialogContent>
        <hr/>
        <DialogActions className='actions-container'>
          <Button variant="outlined" onClick={handleClose}>CANCELAR</Button>
          <Button variant="contained" onClick={() => deleteProfile()}>ELIMINAR</Button>
        </DialogActions>
      </Dialog>
      {loading && <Loader/>}
    </div>
  );
}

export default Quoter;
