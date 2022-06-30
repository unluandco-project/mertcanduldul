/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import type { NextPage } from "next";
import Head from "next/head";
import {
    MainFormButton,
    MainFormFooter,
    MainFormHeader,
    MainFormInput,
    MainFormList,
    Toast,
} from "components";
import { listArray } from "utils/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAppDispatch } from "app/hooks";
import { userLogin } from "features/auth/authSlice";
import Link from "next/link";

interface ILoginProps {
    email: string;
    password: string;
}

const SignIn: NextPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const loginSchema = yup
        .object({
            email: yup
                .string()
                .required("E-Posta alanı gereklidir.")
                .email("E-Posta alanı geçerli değil."),
            password: yup
                .string()
                .required("Şifre alanı gereklidir.")
                .min(8, "Şifre en az 8 karakter olmalıdır!")
                .max(20, "Şifre en fazla 20 karakter olmalıdır!"),
        })
        .required();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginProps>({
        resolver: yupResolver(loginSchema),
    });

    const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
        Toast({ type, message });
    }, []);

    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const handleSignInSubmit: SubmitHandler<ILoginProps> = async (data) => {
        setIsAuthLoading(true);
        const user = { email: data.email, password: data.password };

        dispatch(userLogin(user))
            .then((res) => {
                if (res.payload.data.IsSuccess) {
                    notify("success", res.payload.data.Message);
                    router.push('/')
                } else {
                    notify("error", res.payload.data.Message);
                }

            })
            .catch((err) => {
                notify("error", err.message);
            })
            .finally(() => {
                setIsAuthLoading(false);
            })
    };

    return (
        <>
            <Head>
                <title>E-Ticaret Uygulaması | Giriş Yap</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="E-Ticaret Uygulaması | Giriş Yap" />
            </Head>
            <section className="w-full h-[100vh] overflow-hidden">
                <div className="container flex w-full h-full">
                    <div className="h-full p-24 space-y-16 w-[65%] flex items-center justify-center flex-col">
                        <div className="w-4/6">
                            <MainFormHeader
                                title="Giriş Yap"
                                subtitle="E-Ticaret Uygulamasına hoşgeldiniz. Sisteme giriş yapabilmek için aşağıdaki formu doldurunuz."
                            />
                            <div className="my-6">
                                <form
                                    action=""
                                    className="space-y-6"
                                    onSubmit={handleSubmit(handleSignInSubmit)}
                                >
                                    <div>
                                        <MainFormInput
                                            label="E-Posta"
                                            placeholder="example@example.com"
                                            id="email"
                                            type="email"
                                            name="email"
                                            register={register}
                                        />
                                        <small className="text-red-500 text-xs">
                                            {errors.email?.message}
                                        </small>
                                    </div>
                                    <div>
                                        <MainFormInput
                                            label="Parola"
                                            placeholder="********"
                                            id="password"
                                            type="password"
                                            name="password"
                                            register={register}
                                        />
                                        <small className="text-red-500 text-xs">
                                            {errors.email?.message}
                                        </small>
                                    </div>
                                    <MainFormButton
                                        label="Giriş Yap"
                                        loading={isAuthLoading}
                                        loadingText="Giriş Yapılıyor..."
                                    />
                                </form>
                            </div>
                            <MainFormFooter
                                title="Hesabınız yok mu?"
                                subtitle="Kaydol"
                                link="/signup"
                            />
                        </div>
                    </div>
                    <div className="bg-mainGray w-[35%] h-full flex flex-col items-center justify-center">
                        <img
                            src="signup_left_image.png"
                            alt="Left image"
                            className="object-cover"
                        />
                        <MainFormList listArray={listArray} title="Aramıza katılınca sahip olacaklarınız!" />
                        <Link href="/">
                            <a id="logo" className="text-xl text-center font-bold hover:underline">
                                E-Ticaret Uygulaması
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignIn;
