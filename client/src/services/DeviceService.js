import request from "./Request";

let addDevice = (device) => {
    return request('post', 'devices/addDevice', device);
}

let updateDevice = (device) => {
    return request('post', `devices/updateDevice`, device);
}

let findDevices = (filters) => {
    return request('post', `devices/findDevicesByFilter`, filters);
}

let findDeviceByID = (id) => {
    return request('get', `devices/findDeviceById`, id);
}

let findCountries = (filters) => {
    return request('post', `devices/findCountriesByFilter`, filters);
}

let findCompanies = (filters) => {
    return request('post', `devices/findCompaniesByFilter`, filters);
}

let findDevicesByFilter = (filters) => {
    console.log(filters);
    return request('post', `devices/findDevicesByFilter`, filters);
}

let getAllDevices = (params) => {
    return request('get', `devices/all`, JSON.stringify(params));
}

let deleteDeviceByID = (id) => {
    return request('delete', `devices/delete/${id}`)
}

//EXPORTING SERVICE FUNCTIONS
const DeviceService = {
    addDevice,
    updateDevice,
    findDevices,
    findDeviceByID,
    findCountries,
    findDevicesByFilter,
    findCompanies,
    getAllDevices,
    deleteDeviceByID
};

export default DeviceService;
