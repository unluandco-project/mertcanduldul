import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authServices } from "services/authServices";
import Cookies from 'js-cookie'
import { boolean } from "yup";

export const userLogin = createAsyncThunk("auth/login", async (payload: { email: string; password: string }) => {
    const { email, password } = payload;
    return await authServices.login(email, password);
});

interface ILoginProps {
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    isError: boolean;
    authenticatedUser: IUser;
}

interface IUser {
    user: User;
    token: string;
    isSuccess?: boolean,
    message?: string
}
interface User {
    UserId: number;
    UserName: string;
    UserMail: string;
}


const initialState: ILoginProps = {
    isAuthLoading: true,
    isAuthenticated: false,
    isError: false,
    authenticatedUser: {
        isSuccess: false,
        user: {
            UserId: 0,
            UserMail: "",
            UserName: ""
        },
        token: '',
        message: ""
    }
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        checkAuthUser: (state) => {
            state.isAuthLoading = true;
            if (localStorage.getItem("access_token") && Cookies.get("access_token") && localStorage.getItem("user")) {
                state.isAuthenticated = true;
                state.isAuthLoading = false;
                state.authenticatedUser = {
                    user: JSON.parse(localStorage.getItem("user") as string),
                    // @ts-ignore
                    token: JSON.parse(localStorage.getItem("access_token"))
                }
            } else {
                state.isAuthenticated = false;
                state.isAuthLoading = false;
            }
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.isAuthLoading = false;
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            Cookies.remove("access_token");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.isAuthenticated = true;
            const data = {
                user: {
                    UserId: action.payload.data.UserId,
                    UserMail: action.payload.data.UserMail,
                    UserName: action.payload.data.UserName,
                },
                token: action.payload.data.Token,
                isSuccess: true,
                message: ""
            }
            state.authenticatedUser = data;
            localStorage.setItem("access_token", JSON.stringify(data.token));
            localStorage.setItem("user", JSON.stringify(data.user));
            Cookies.set("access_token", data.token, { path: '/' });
            Cookies.set("user_id", data.user.UserId, { path: '/' });
        })
        builder.addCase(userLogin.rejected, (state) => {
            state.isAuthLoading = false;
            state.isError = true;
        })
    }
})

export const { checkAuthUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
