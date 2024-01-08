import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  getCustomers,
  getProjectTypes,
  getStatus,
  getEngagementForCountry,
  getEngagementFilter,
  getProjectsFilter,
  getProject,
  getCountries,
} from "adapters/Axios/services/project";
import CountrySelector from "components/CountrySelector/CountrySelector";
import {
  ApiEngagement,
  ApiCustomers,
  ApiProjectType,
  ApiStatus,
  ApiCountry,
} from "models/Api";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState, useEffect } from "react";
import { sortByName } from "utils/utils";
import "./ProjectFilter.css";
import Loader from "components/Loader/Loader";

const ProjectFilter = ({ onChange, firstLoader = true }: any) => {
  const [loading, setLoading] = useState(false);

  const [engagementsCatalog, setEngagementsCatalog] = useState<ApiEngagement[]>(
    []
  );
  const [customerCatalog, setCustomerCatalog] = useState<ApiCustomers[]>([]);
  const [projectTypesCatalog, setProjectTypesCatalog] = useState<
    ApiProjectType[]
  >([]);
  const [statusCatalog, setStatusCatalog] = useState<ApiStatus[]>([]);
  const [projectCustomers, setProjectCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contries, setContries] = useState<ApiCountry[]>([]);
  const [countryId, setCountryId] = useState<number>();

  useEffect(() => {
    getCustomers().then((response: any) =>
      setCustomerCatalog(sortByName(response.data as ApiCustomers[]))
    );
    getProjectTypes().then((response: any) =>
      setProjectTypesCatalog(sortByName(response.data as ApiCustomers[]))
    );
    getStatus().then((response: any) =>
      setStatusCatalog(sortByName(response.data as ApiCustomers[]))
    );
    getCountries().then((response: any) =>
      setContries(response.data as ApiCountry[])
    );
  }, []);

  const [formData, setFormData] = useState<any>({
    country: 0,
    engagement: "",
    customer: "",
    project: "",
  });

  const { engagement, customer, project } = formData;

  const handleOnChange = (e: any) => {
    setCountryId(e.selectedValue);
  };

  useEffect(() => {
    setEngagementsCatalog([]);
    setProjectCustomers([]);
    setProjects([]);
    if (firstLoader) setLoading(true);
    if (countryId) {
      getEngagementForCountry(countryId)
        .then((response: any) => {
          setEngagementsCatalog(sortByName(response.data as ApiEngagement[]));
        })
        .finally(() => {
          if (firstLoader) setLoading(false);
        });
    }
    setFormData({
      ...formData,
      engagement: null,
      customer: null,
      project: null,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  useEffect(() => {
    if (project) {
      setLoading(true);
      getProject(project)
        .then((response: any) => {
          let startD = String(response.data[0].StartDate)
            .substring(0, 10)
            .split("-");
          let finishD = String(response.data[0].EndDate)
            .substring(0, 10)
            .split("-");
          onChange({
            ...response.data[0],
            projectType: projectTypesCatalog.find(
              (x) => x.id === response.data[0].proyect_type_id
            )?.name,
            startDate: `${startD[1]}/${startD[2]}/${startD[0]}`,
            endDate: `${finishD[1]}/${finishD[2]}/${finishD[0]}`,
            status: statusCatalog.find(
              (x) => x.id === response.data[0].status_id
            )?.name,
            projectNumber: response.data[0]?.id,
            url: response.data[0]?.url_quotation,
            margin: response.data[0]?.BusinessMargin,
            discount: response.data[0]?.Discount,
          });
        })
        .finally(() => setLoading(false));
    } else {
      onChange({});
    }
  }, [formData]);

  const handleOnChangeEngagement = (e: any) => {
    setLoading(true);
    setProjectCustomers([]);
    setProjects([]);
    setFormData({
      ...formData,
      engagement: e.target.value,
      customer: null,
      project: null,
    });
    getEngagementFilter(+e.target.value)
      .then((response: any) => {
        let arrAux: any[] = [];
        response.data.forEach((project: any) => {
          customerCatalog.forEach((customer) => {
            if (
              project.customer_id === customer.id &&
              project.country_id === countryId
            ) {
              arrAux.push(customer);
            }
          });
        });
        setProjectCustomers(
          arrAux.filter((value, index) => {
            return arrAux.indexOf(value) === index;
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnChangeCustomer = (e: any) => {
    setLoading(true);
    setProjects([]);
    setFormData({
      ...formData,
      customer: e.target.value,
      project: null,
    });
    getProjectsFilter(engagement, +e.target.value)
      .then((response: any) => {
        setProjects(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnChangeProject = (e: any) => {
    setFormData({ ...formData, project: e.target.value });
  };

  return (
    <div className="ProjectFilter" data-testid="ProjectFilter">
      <CountrySelector
        onSelect={handleOnChange}
        countries={contries.slice(0, 4)}
        name="country"
      ></CountrySelector>
      <Grid container spacing={3} className="grid-space">
        <Grid item xs={12} md={4}>
          {engagementsCatalog && engagementsCatalog.length > 0 ? (
            <FormControl variant="filled" fullWidth className="arrow-spacing">
              <InputLabel id="engagement-label">ENGAGEMENT</InputLabel>
              <Select
                labelId="engagement-label"
                disabled={!engagementsCatalog.length}
                id="engagement"
                value={engagement}
                onChange={(e) => handleOnChangeEngagement(e)}
                name="engagement"
              >
                {engagementsCatalog.map((engagement: any) => {
                  return (
                    <MenuItem
                      value={engagement.id}
                      key={`engagement${engagement.id}`}
                    >
                      {engagement.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <KeyboardArrowRightIcon />
            </FormControl>
          ) : (
            <div className="skeleton s-un" style={{ maxWidth: "100%" }}>
              <div className="line w100 inpu"></div>
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {engagementsCatalog && engagementsCatalog.length > 0 ? (
            <FormControl variant="filled" fullWidth className="arrow-spacing">
              <InputLabel id="customer-label">CLIENTE</InputLabel>
              <Select
                labelId="customer-label"
                disabled={!projectCustomers.length}
                id="customer"
                value={customer}
                onChange={(e) => handleOnChangeCustomer(e)}
                name="customer"
              >
                {projectCustomers.map((customer: any) => {
                  return (
                    <MenuItem
                      value={customer.id}
                      key={`customer${customer.id}`}
                    >
                      {customer.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <KeyboardArrowRightIcon />
            </FormControl>
          ) : (
            <div className="skeleton s-un" style={{ maxWidth: "100%" }}>
              <div className="line w100 inpu"></div>
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {engagementsCatalog && engagementsCatalog.length > 0 ? (
            <FormControl variant="filled" fullWidth>
              <InputLabel id="project-select-label">PROYECTO</InputLabel>
              <Select
                disabled={!projects.length}
                labelId="project-select-label"
                id="project-select"
                value={project}
                onChange={(e) => handleOnChangeProject(e)}
                name="project-select"
              >
                {projects.map((project: any) => {
                  return (
                    <MenuItem value={project.id} key={`project${project.id}`}>
                      {project.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <div className="skeleton s-un" style={{ maxWidth: "100%" }}>
              <div className="line w100 inpu"></div>
            </div>
          )}
        </Grid>
      </Grid>
      {loading && <Loader />}
    </div>
  );
};

export default ProjectFilter;
