import { ENDPOINTS } from "adapters/Axios/endpoints";
import client from "../client";

export async function getStaff() {
  return client.get(ENDPOINTS.STAFF).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response;
  });
}
export async function getStaffAccess() {
  return client.get(ENDPOINTS.STAFFACCESS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response;
  });
}

export async function getProperties() {
  return client.get(ENDPOINTS.PROPERTIES).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response;
  });
}

export async function getAllProjects() {
  return client.get(ENDPOINTS.PROJECTS).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response;
  });
}

export async function getStaffProjects(id: number) {
  return client.get(`${ENDPOINTS.STAFFPROJECTS}?proyect_id=${id}`).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function postStaff(data: unknown) {
  return client.post(ENDPOINTS.STAFF, data);
}

export async function putStaff(data: unknown) {
  return client.put(ENDPOINTS.STAFF, data);
}

export async function postProjectStaff(data: unknown) {
  return client.post(ENDPOINTS.STAFFPROJECTS, data);
}

export async function getAssignments(id: any) {
  // eslint-disable-next-line
  return client.get(ENDPOINTS.ASSIGNMENTS.replace('${id}', `${id}`)).then((response: any) => {
    if ((response).error) {
      return response;
    }
    return response as any[];
  });
}

export async function deleteProjectStaff(id: number | string) {
  // eslint-disable-next-line
  return client.delete(ENDPOINTS.STAFFPROJECTSDEL.replace('${id}', `${id}`));
}

export async function updateAllProjectStaff(assignments: any) {
  // eslint-disable-next-line
  return client.put('/proyects/staff/updateAll', assignments);
}