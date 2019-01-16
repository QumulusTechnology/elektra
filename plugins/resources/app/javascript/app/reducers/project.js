import * as constants from '../constants';

const initialState = {
  //data from Limes
  metadata: null,
  overview: null,
  services: null,
  resources: null,
  //UI state
  receivedAt: null,
  isFetching: false,
  syncStatus: null,
};

////////////////////////////////////////////////////////////////////////////////
// get project

const request = (state, {projectID, requestedAt}) => ({
  ...state,
  isFetching: true,
  requestedAt,
});

const requestFailure = (state, action) => ({
  ...state,
  isFetching: false,
  syncStatus: null,
});

const receive = (state, {projectData, receivedAt}) => {
  // This reducer takes the `projectData` returned by Limes and flattens it
  // into several structures that reflect the different levels of React
  // components.

  // `metadata` is what multiple levels need (e.g. bursting multiplier).
  var {services: serviceList, ...metadata} = projectData;

  // `overview` is what the ProjectOverview component needs.
  const overview = {
    scrapedAt: Object.fromEntries(
      serviceList.map(srv => [ srv.type, srv.scraped_at ]),
    ),
  };
  const areas = {};
  for (let srv of serviceList) {
    areas[srv.area || srv.type] = [];
  }
  for (let srv of serviceList) {
    areas[srv.area || srv.type].push(srv.type);
  }
  overview.areas = areas;

  // `services` is what the ProjectService component needs.
  const services = {};
  for (let srv of serviceList) {
    var {resources: resourceList, ...serviceData} = srv;

    const categories = {};
    for (let res of resourceList) {
      categories[res.category || srv.type] = [];
    }
    for (let res of resourceList) {
      categories[res.category || srv.type].push(res.name);
    }
    serviceData.categories = categories;

    services[serviceData.type] = serviceData;
  }

  // `resources` is what the ProjectResource component needs.
  const resources = {};
  for (let srv of serviceList) {
    for (let res of srv.resources) {
      resources[`${srv.type}/${res.name}`] = res;
    }
  }

  return {
    ...state,
    metadata: metadata,
    overview: overview,
    services: services,
    resources: resources,
    isFetching: false,
    syncStatus: null,
    receivedAt,
  };
}

////////////////////////////////////////////////////////////////////////////////
// sync project

const setSyncStatus = (state, action, syncStatus) => ({
  ...state,
  syncStatus: syncStatus,
});

////////////////////////////////////////////////////////////////////////////////
// entrypoint

export const project = (state, action) => {
  if (state == null) {
    state = initialState;
  }

  switch (action.type) {
    case constants.REQUEST_PROJECT:         return request(state, action);
    case constants.REQUEST_PROJECT_FAILURE: return requestFailure(state, action);
    case constants.RECEIVE_PROJECT:         return receive(state, action);
    case constants.SYNC_PROJECT_REQUESTED:  return setSyncStatus(state, action, 'requested');
    case constants.SYNC_PROJECT_FAILURE:    return setSyncStatus(state, action, null);
    case constants.SYNC_PROJECT_STARTED:    return setSyncStatus(state, action, 'started');
    case constants.SYNC_PROJECT_FINISHED:   return setSyncStatus(state, action, 'reloading');
    default: return state;
  }
};
