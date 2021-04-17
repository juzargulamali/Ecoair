import request from "./Request";

let login = (credentials) => {
    return request('post', 'auth/signIn', credentials);
}

let isLoggedIn = () => {
    return localStorage.getItem('loggedIn') === "true";
}

export const checkAuthState = () => {
    return request('get', 'auth/isSignedIn');
}

export const signOut = () => {
    return request('get', 'auth/signOut');
}

//EXPORTING SERVICE FUNCTIONS
const AuthService = {
    isLoggedIn,
    checkAuthState,
    login,
    signOut,
};
export default AuthService;
