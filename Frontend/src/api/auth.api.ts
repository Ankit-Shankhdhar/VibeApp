import API from "./axios";

export const registerUser = (data: {
    username: string;
    email: string;
    password: string;

})=> {
    return API.post('/auth/register', data);
};

export const loginUser = (data: {
    email: string;
    password: string;
}) => {
    return API.post('/auth/login', data);
};