import axios from "axios";

const SERVICE = axios.create({
    baseURL: "https://localhost:7147/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});


export const authServices = {
    login: (email: string, password: string) => {
        return SERVICE.post("/Login", { E_MAIL: email, SIFRE: password });
    },
    register: (nameSurname: string, email: string, password: string) => {
        return SERVICE.post("/Registration", { AD_SOYAD: nameSurname, E_MAIL: email, SIFRE: password });
    },
};