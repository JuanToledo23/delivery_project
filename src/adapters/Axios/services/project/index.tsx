import { ENDPOINTS } from "adapters/Axios/endpoints";
import { ApiEngagement, ApiCustomers, ApiStatus, ApiProjectType, ApiGroups, ApiProfile } from "models/Api";
import client from "../client";

export async function getCountries() {
  return client.get(ENDPOINTS.COUNTRIES).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response;
  });
}

export async function getEngagement() {
  return client.get(ENDPOINTS.ENGAGEMENTS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiEngagement[];
  });
}

export async function getEngagementLike(name: string) {
  return client.get(`${ENDPOINTS.ENGAGEMENTS}?like=${encodeURIComponent(name)}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiEngagement[];
  });
}

export async function getEngagementForCountry(id: number | string) {
  return client.get(`${ENDPOINTS.ENGAGEMENTS}?country=${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiEngagement[];
  });
}

export async function getCustomers() {
  return client.get(ENDPOINTS.CUSTOMERS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiCustomers[];
  });
}

export async function getEngagementFilter(id: number) {
  return client.get(`${ENDPOINTS.PROJECTS}?engagement=${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function getProjectsFilter(id: number, id2: number) {
  return client.get(`${ENDPOINTS.PROJECTS}?engagement=${id}&customer=${id2}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function getProject(id: number) {
  return client.get(`${ENDPOINTS.PROJECTS}?id=${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function postEngagement(data: unknown) {
  return client.post(ENDPOINTS.ENGAGEMENTS, data);
}

export async function postCustomers(data: unknown) {
  return client.post(ENDPOINTS.CUSTOMERS, data);
}

export async function getCustomersLike(name: string) {
  return client.get(`${ENDPOINTS.CUSTOMERS}?like=${encodeURIComponent(name)}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiCustomers[];
  });
}

export async function getStatus() {
  return client.get(ENDPOINTS.STATUS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiStatus[];
  });
}

export async function getProjectTypes() {
  return client.get(ENDPOINTS.PROJECTTYPES).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiProjectType[];
  });
}

export async function getGroups() {
  return client.get(ENDPOINTS.GROUPS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiGroups[];
  });
}

export async function getAllProfiles() {
  return client.get(ENDPOINTS.ALLPROFILES).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiProfile[];
  });
}

export async function getGroupProfiles(id: number) {
  // eslint-disable-next-line
  return client.get(ENDPOINTS.GROUPPROFILES.replace('${id}', `${id}`)).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiProfile[];
  });
}

export async function postProfiles(data: unknown) {
  return client.post(ENDPOINTS.PROJECTPROFILES, data);
}

export async function putProfiles(data: unknown) {
  return client.put(ENDPOINTS.PROJECTPROFILES, data);
}

export async function deleteProfiles(id: number | string) {
  // eslint-disable-next-line
  return client.delete(ENDPOINTS.PROJECTPROFILESDELETE.replace('${id}', `${id}`));
}

export async function getProfiles(id: number) {
  return client.get(`${ENDPOINTS.PROJECTPROFILES}/${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function postProject(data: unknown) {
  return client.post(ENDPOINTS.PROJECTS, data);
}

export async function putProject(data: unknown) {
  return client.put(ENDPOINTS.PROJECTS, data);
}

export async function getProjectId(name: string) {
  return client.get(`${ENDPOINTS.PROJECTS}?proyect_name=${name}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function postComment(data: unknown) {
  return client.post(ENDPOINTS.COMMENTS, data);
}

export async function getComments(id: number) {
  return client.get(`${ENDPOINTS.COMMENTS}/${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}


export async function getProjectAssignments(id: number | string) {
  return client.get(`${ENDPOINTS.STAFFPROJECTS}?proyect_id=${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as ApiEngagement[];
  });
}