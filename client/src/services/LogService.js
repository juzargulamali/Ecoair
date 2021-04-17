import request from "./Request";

let findLogEntriesByFilter = (filters) => {
    console.log(filters);
    return request('get', `logs/filter`, JSON.stringify(filters));
}

let getAllLogEntries = (params) => {
    return request('get', `logs/all`, JSON.stringify(params));
}

let deleteLogsByFilters = (filters) => {
    return request('delete', `logs/filter`, JSON.stringify(filters));
}

//EXPORTING SERVICE FUNCTIONS
const LogService = {
    findLogEntriesByFilter,
    getAllLogEntries,
    deleteLogsByFilters,
};

export default LogService;
