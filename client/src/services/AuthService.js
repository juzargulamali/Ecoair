import request from "./Request";

let login = (credentials) => {
    return request('post', 'users/login', credentials);
}

let signup = (data) => {
    return request('post', 'users/signup', data);
}

let saveToken = (token) => {
    localStorage.setItem('token', token);
}

let getToken = () => {
    let token = localStorage.getItem('token');
    return token;
}

let getUserDetails = () => {
    const token = getToken();
    let payload;
    if (token) {
        payload = token.split('.')[1];
        payload = window.atob(payload);
        return JSON.parse(payload);
    } else {
        return {};
    }
}

let isLoggedIn = () => {
    const user = getUserDetails();
    if (user) {
        return user.exp > Date.now() / 1000;
        // return true;
    } else {
        return false;
    }
}

let checkAuthState = () => {
    return request('get', 'loginStatus');
}

let logout = () => {
    localStorage.removeItem('auth-token');
}

//EXPORTING SERVICE FUNCTIONS
const AuthService = {
    saveToken,
    getToken,
    getUserDetails,
    isLoggedIn,
    checkAuthState,
    login,
    signup,
    logout,
};
export default AuthService;
