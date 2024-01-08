export type ApiEngagement = {
  id: number;
  name: string;
  status_id: number;
};

export type ApiCustomers = {
  id: number;
  name: string;
  status_id: number;
};

export type ApiStatus = {
  id: number;
  name: string;
  status_id: number;
};

export type ApiProjectType = {
  id: number;
  name: string;
  status_id: number;
};

export type ApiGroups = {
  id: number;
  name: string;
};

export type ApiProfile = {
  id: number;
  name: string;
  group_id: number;
};

export type ApiCountry = {
  id: number;
  name: string;
  flag: string;
};

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  all_access: number;
};