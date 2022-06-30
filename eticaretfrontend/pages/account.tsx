import { useAppSelector } from "app/hooks";
import { IOffer } from "interfaces/offer";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { productServices } from "services/productServices";
import { AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/router";
import { Toast } from "components";
import { formatterCurrency } from "utils/helpers";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.req.headers.cookie?.split('user_id=')[1].split(";")[0] || ""
    const offers_incomes = await productServices.getOfferOfUserIncome(Number(userId)).then(res => res.data) || [];
    const offers_outs = await productServices.getOfferOfUserSend(Number(userId)).then(res => res.data) || [];
    return {
        props: {
            offers_incomes,
            offers_outs,
        }
    }
}

const Account: NextPage = ({ offers_incomes, offers_outs }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { authenticatedUser } = useAppSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState(0);
    const router = useRouter();


    const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
        Toast({ type, message });
    }, []);

    const handleAcceptOffer = async (offerId: number, userId: number) => {
        try {
            const res = await productServices.acceptOffer(offerId, userId);
            if (res.status === 200) {
                notify("success", "Teklifi kabul ettiniz.");
                router.push("/");
            }
        } catch (e) {
            notify("error", "Teklif kabul edilemedi.");
        }
    }
    const handleRejectOffer = async (offerId: number) => {
        try {
            const res = await productServices.rejectOffer(offerId);
            if (res.status === 200) {
                notify("success", "Teklifi reddettiniz.");
                router.push("/");
            }
        } catch (e) {
            notify("error", "Teklif red edilemedi.");
        }
    }

    return (
        <div>
            <Head>
                <title>E-Ticaret Projesi | Hesabım - {authenticatedUser.user.UserName}</title>
            </Head>
            <section id="my-account">
                <ul className="flex items-center justify-center gap-4">
                    <li>
                        <button
                            onClick={() => setActiveTab(0)}
                            className={`${activeTab === 0 && "!bg-black !text-white hover:!bg-gray-800"} bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full`}>
                            Gelen Ürün Talepleri
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(1)}
                            className={`${activeTab === 1 && "!bg-black !text-white hover:!bg-gray-800"} bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full`}>
                            Başvurulan İlanlar
                        </button>
                    </li>
                </ul>
                <div className="flex flex-col items-center justify-center mt-4 p-4">
                    {activeTab === 0 && (
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-center border-b pb-4 mb-4 w-full ">Gelen Ürün Talepleri</h1>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {offers_incomes.map((offer: IOffer, index: number) => (
                                    <div key={index} className="flex flex-col items-center justify-center gap-4 w-[24%] border p-4">
                                        <div className="flex flex-col gap-4">
                                            <h1 className="font-bold text-center">{offer.URUN_ADI}</h1>
                                            <div className="flex items-center justify-center text-sm gap-x-3">
                                                <AiOutlineUser />
                                                {offer.URUN_SAHIBI}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-x-4 text-sm">
                                            <p
                                                className={`${offer.TEKLIF_DURUM_ADI === "Teklif Verildi" && "text-yellow-500"} 
                                            ${offer.TEKLIF_DURUM_ADI === "Teklif Kabul Edildi" && "text-green-500"} 
                                            ${offer.TEKLIF_DURUM_ADI === "Teklif Red Edildi" && "text-red-500"} font-bold`}
                                            >
                                                {offer.TEKLIF_DURUM_ADI}
                                            </p>
                                            <p className="text-gray-700">
                                                {formatterCurrency.format(offer.TEKLIF_FIYATI)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-sm gap-x-3">
                                            <AiOutlineUser />
                                            {offer.TEKLIF_VEREN}
                                        </div>
                                        {
                                            offer.TEKLIF_DURUM_ADI === "Teklif Verildi" && (
                                                <div className="flex items-center justify-center gap-x-4">
                                                    <button
                                                        onClick={() => handleAcceptOffer(offer.ID_OFFER!, offer.ID_TEKLIF_VEREN!)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                                    >
                                                        Teklifi Kabul Et
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectOffer(offer.ID_OFFER!)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                                    >
                                                        Teklifi Red Et
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                                {
                                    offers_incomes.length === 0 && (
                                        <div className="flex items-center justify-center gap-4 w-fit border p-4">
                                            Henüz ilanlarınıza teklif verilmemiş.
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-center border-b pb-4 mb-4 w-full ">Başvurulan İlanlar</h1>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {offers_outs.map((offer: IOffer, index: number) => (
                                    <div key={index} className="flex flex-col items-center justify-center gap-4 w-[24%] border p-4">
                                        <div className="flex flex-col gap-4">
                                            <h1 className="font-bold text-center">{offer.URUN_ADI}</h1>
                                            <div className="flex items-center justify-center text-sm gap-x-3">
                                                <AiOutlineUser />
                                                {offer.URUN_SAHIBI}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-x-4 text-sm">
                                            <p className={`${offer.TEKLIF_DURUM_ADI === "Teklif Verildi" && "text-yellow-500"} ${offer.TEKLIF_DURUM_ADI === "Teklif Kabul Edildi" && "text-green-500"}  ${offer.TEKLIF_DURUM_ADI === "Teklif Red Edildi" && "text-red-500"} font-bold`}>{offer.TEKLIF_DURUM_ADI}</p>
                                            <p className="text-gray-700">{formatterCurrency.format(offer.TEKLIF_FIYATI)}</p>
                                        </div>
                                    </div>
                                ))}
                                {
                                    offers_outs.length === 0 && (
                                        <div className="flex items-center justify-center gap-4 w-fit border p-4">
                                            Henüz herhangi bir ürün alım talebinde bulunmadınız.
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Account;