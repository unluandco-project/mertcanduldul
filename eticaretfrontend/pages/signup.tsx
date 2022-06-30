/* eslint-disable @next/next/no-img-element */
import { MainFormButton, MainFormFooter, MainFormHeader, MainFormInput, MainFormList, Toast } from "components";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { authServices } from "services/authServices";
import { listArray } from "utils/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import emailjs from '@emailjs/browser';
import Link from "next/link";

interface IRegisterProps {
    nameSurname: string
    email: string
    password: string
    password_confirmation: string
}

const SignUp: NextPage = () => {
    const router = useRouter();
    const form = useRef<HTMLFormElement>(null);

    const registerSchema = yup
        .object({
            nameSurname: yup
                .string()
                .required("Ad Soyad alanı gereklidir."),
            email: yup
                .string()
                .required("E-Posta alanı gereklidir.")
                .email("E-Posta alanı geçerli değil."),
            password: yup
                .string()
                .required("Şifre alanı gereklidir.")
                .min(8, "Şifre en az 8 karakter olmalıdır!")
                .max(20, "Şifre en fazla 20 karakter olmalıdır!"),
            password_confirmation: yup
                .string()
                .required("Şifre Tekrarı alanı gereklidir.")
                .oneOf([yup.ref("password"), null], "Şifreler uyuşmuyor!")
                .min(8, "Şifre en az 8 karakter olmalıdır!")
                .max(20, "Şifre en fazla 20 karakter olmalıdır!"),
        })
        .required();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IRegisterProps>({
        resolver: yupResolver(registerSchema),
    });

    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
        Toast({ type, message });
    }, []);

    const handleSignUpSubmit: SubmitHandler<IRegisterProps> = async (data) => {
        try {
            setIsAuthLoading(true);
            const response = await authServices.register(data.nameSurname, data.email, data.password);

            if (response.data.IsSuccess) {
                notify("success", response.data.Message);
                // @ts-ignore
                emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID, form.current, process.env.NEXT_PUBLIC_PUBLIC_KEY)
                    .then(() => {
                        // @ts-ignore
                        form.current.reset();
                        router.push("/signin");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                    })
            } else {
                notify("error", response.data.Message);
            }

            setIsAuthLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsAuthLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>E-Ticaret Uygulaması | Kayıt Ol</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="E-Ticaret Uygulaması | Kayıt Ol" />
            </Head>
            <section className="w-full h-[100vh] overflow-hidden">
                <div className="container flex w-full h-full">
                    <div className="h-full p-24 space-y-16 w-[65%] flex items-center justify-center flex-col order-2">
                        <div className="w-4/6">
                            <MainFormHeader
                                title="Kayıt ol"
                                subtitle="E-Ticaret Uygulamasına hoşgeldiniz. Kayıt olmak için, lütfen aşağıdaki formu doldurunuz. Hesabınız: Mail adresinizie gelen mail ile aktif edilecektir."
                            />
                            <div className="my-6">
                                <form ref={form} className="space-y-6" onSubmit={handleSubmit(handleSignUpSubmit)}>
                                    <div>
                                        <MainFormInput
                                            label="İsim ve Soyisim"
                                            placeholder="John Doe"
                                            id="name"
                                            type="name"
                                            name="nameSurname"
                                            register={register}
                                        />
                                        <small className="text-xs text-red-500">
                                            {errors.nameSurname && errors.nameSurname.message}
                                        </small>
                                    </div>
                                    <div>
                                        <MainFormInput
                                            label="E-Posta"
                                            placeholder="example@example.com"
                                            id="email"
                                            type="email"
                                            name="email"
                                            register={register}
                                        />
                                        <small className="text-xs text-red-500">
                                            {errors.email && errors.email.message}
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
                                        <small className="text-xs text-red-500">
                                            {errors.password && errors.password.message}
                                        </small>
                                    </div>
                                    <div>
                                        <MainFormInput
                                            label="Parola Tekrar"
                                            placeholder="********"
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            register={register}
                                        />
                                        <small className="text-xs text-red-500">
                                            {errors.password_confirmation && errors.password_confirmation.message}
                                        </small>
                                    </div>
                                    <MainFormButton
                                        label="Kayıt ol"
                                        loading={isAuthLoading}
                                        loadingText='Kaydolunuyor...'
                                    />
                                </form>
                            </div>
                            <MainFormFooter
                                title="Zaten bir hesabınız var mı?"
                                subtitle="Giriş Yap"
                                link="/signin"
                            />
                        </div>
                    </div>
                    <div className="bg-mainGray w-[35%] h-full flex flex-col items-center justify-center order-1">
                        <img
                            src="signup_left_image.png"
                            alt="Image"
                            className="object-cover"
                        />
                        <MainFormList
                            listArray={listArray}
                            title="Aramıza katılınca sahip olacaklarınız!"
                        />
                        <Link href="/">
                            <a id="logo" className="text-xl text-center font-bold hover:underline">
                                E-Ticaret Uygulaması
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp;