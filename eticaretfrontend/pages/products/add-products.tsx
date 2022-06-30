// @ts-nocheck
import { ICategory } from "interfaces/category";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { categoriesServices } from "services/categoriesServices";
import { productServices } from "services/productServices";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "interfaces/products";
import React from "react";
import { Toast } from "components";
import { useRouter } from "next/router";
import { useAppSelector } from "app/hooks";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const categories: ICategory[] = await categoriesServices.getCategories().then((res) => res.data);
    const colors = await productServices.getAllProductColors().then((res) => res.data);
    const brands = await productServices.getAllProductBrands().then((res) => res.data);
    const usageStatuses = await productServices.getAllUsageStatuses().then((res) => res.data);
    return {
        props: {
            categories,
            colors,
            brands,
            usageStatuses
        }
    }
}

const AddProduct: NextPage = ({ categories, colors, brands, usageStatuses }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const addProductSchema = yup
        .object({
            product_name: yup
                .string()
                .required("Ürün Adı alanı gereklidir.")
                .max(100, "Ürün Adı alanı en fazla 100 karakter olabilir."),
            product_description: yup
                .string()
                .required("Ürün Açıklaması alanı gereklidir.")
                .max(500, "Ürün Açıklaması alanı en fazla 500 karakter olabilir."),
            product_price: yup
                .number()
                .integer("Ürün Fiyatı tam sayı olmalıdır.")
                .positive("Ürün Fiyatı pozitif bir değer olmalıdır.")
                .required("Ürün Fiyatı alanı gereklidir.")
                .min(0, "Ürün Fiyatı 0'dan küçük olamaz."),
            product_category: yup
                .number()
                .positive("Ürün Kategorisi alanı gereklidir.")
                .required("Ürün Kategorisi alanı gereklidir."),
            product_color: yup
                .number()
                .positive("Ürün Rengi alanı gereklidir.")
                .required("Ürün Rengi alanı gereklidir."),
            product_brand: yup
                .number()
                .positive("Ürün Markası alanı gereklidir.")
                .required("Ürün Markası alanı gereklidir."),
            product_usage_status: yup
                .number()
                .positive("Ürün Kullanım Durumu alanı gereklidir.")
                .required("Ürün Kullanım Durumu alanı gereklidir."),
            product_is_offerable: yup
                .boolean()
                .required("Ürün Teklif Durumu alanı gereklidir."),
        })
        .required();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IProduct>({
        resolver: yupResolver(addProductSchema),
    });

    const router = useRouter();
    const { authenticatedUser } = useAppSelector(state => state.auth)

    const [isAddProductLoading, setIsAddProductLoading] = React.useState(false);

    const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
        Toast({ type, message });
    }, []);

    const handleAddProductSubmit: SubmitHandler<IProduct> = async (data) => {
        event?.preventDefault();
        setIsAddProductLoading(true);

        const product = {
            URUN_ADI: data.product_name,
            URUN_ACIKLAMA: data.product_description,
            FIYAT: data.product_price,
            ID_KATEGORI: data.product_category,
            ID_RENK: data.product_color,
            ID_MARKA: data.product_brand,
            ID_KULLANIM_DURUMU: data.product_usage_status,
            IS_OFFERABLE: data.product_is_offerable,
            ID_URUN_SAHIBI: authenticatedUser.user.UserId
        }

        await productServices.addProduct(product)
            .then(() => {
                notify("success", "Ürün başarıyla eklendi.");
                setTimeout(() => {
                    reset();
                    router.push("/products");
                }, 1000)
            })
            .catch((err) => {
                notify("error", err.response.data.message);
            })
            .finally(() => {
                setIsAddProductLoading(false);
            })
    }


    return (
        <div>
            <Head>
                <title>E-Ticaret Uygulaması | Ürün Ekle</title>
            </Head>
            <section className="flex flex-col w-full p-4 px-12">
                <div className="mb-4 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Ürün Ekle</h1>
                </div>
                <form className="flex flex-col" onSubmit={handleSubmit(handleAddProductSubmit)}>
                    <div className="flex items-baseline justify-between mt-4">
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_name">Ürün Adı</label>
                            <textarea
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800 h-32"
                                id="product_name"
                                placeholder="Ürün Adı"
                                name="product_name"
                                {...register('product_name')}
                            />
                            <small className="text-red-500 text-xs">
                                {errors.product_name && errors.product_name.message}
                            </small>
                        </div>
                        <div className="form-group flex flex-col items-start w-full pl-4">
                            <label htmlFor="product_description">Ürün Açıklaması</label>
                            <textarea
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800 h-32"
                                id="product_description"
                                name="product_description"
                                placeholder="Ürün Açıklaması"
                                {...register('product_description')}
                            />
                            <small className="text-red-500 text-xs">
                                {errors.product_description && errors.product_description.message}
                            </small>
                        </div>
                    </div>

                    <div className="flex items-baseline justify-between mt-4">

                        {/* item */}
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_price">Ürün Fiyatı</label>
                            <input
                                type="number"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                id="product_price"
                                name="product_price"
                                placeholder="Ürün Fiyatı"
                                min={0}
                                {...register('product_price')}
                            />
                            <small className="text-red-500 text-xs">
                                {errors.product_price && errors.product_price.message}
                            </small>
                        </div>

                        {/* item */}
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_category">Ürün Kategorisi</label>
                            <select
                                name="product_category"
                                id="product_category"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                {...register('product_category')}
                            >
                                <option value="0" defaultChecked disabled selected>Kategori Seçiniz</option>
                                {categories.map((category: ICategory) => (
                                    <option key={category.ID_KATEGORI} value={category.ID_KATEGORI}>{category.KATEGORI_ADI}</option>
                                ))}
                            </select>
                            <small className="text-red-500 text-sm">
                                {errors.product_category && errors.product_category.message}
                            </small>
                        </div>

                        {/* item */}
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_brand">Ürün Markası</label>
                            <select
                                name="product_brand"
                                id="product_brand"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                {...register('product_brand')}
                            >
                                <option value="0" defaultChecked selected disabled>Ürün Markası Seçiniz</option>
                                {
                                    brands.map((brand: string) => (
                                        <option key={brand} value={brand.ID_MARKA}>{brand.MARKA_ADI}</option>
                                    ))
                                }
                            </select>
                            <small className="text-red-500 text-xs">
                                {errors.product_brand && errors.product_brand.message}
                            </small>
                        </div>
                    </div>
                    {/* item */}
                    <div className="flex items-baseline justify-between mt-4">
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_usage_status">Ürün Kullanım Durumu</label>
                            <select
                                name="product_usage_status"
                                id="product_usage_status"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                {...register('product_usage_status')}
                            >
                                <option value="0" defaultChecked selected disabled>Ürün Kullanım Durumu</option>
                                {
                                    usageStatuses.map((usageStatus: string) => (
                                        <option key={usageStatus} value={usageStatus.ID_KULLANIM_DURUM}>{usageStatus.KULLANIM_DURUM_ADI}</option>
                                    ))
                                }
                            </select>
                            <small className="text-red-500 text-sm">
                                {errors.product_usage_status && errors.product_usage_status.message}
                            </small>
                        </div>
                        {/* item */}
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_color">Ürün Rengi</label>
                            <select
                                name="product_color"
                                id="product_color"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                required
                                {...register('product_color')}
                            >
                                <option value="0" defaultChecked selected disabled>Ürün Rengi Seçiniz</option>
                                {
                                    colors.map((color: string) => (
                                        <option key={color} value={color.ID_RENK}>{color.RENK_ADI}</option>
                                    ))
                                }
                            </select>
                            <small className="text-red-500 text-xs">
                                {errors.product_color && errors.product_color.message}
                            </small>
                        </div>
                        {/* item  */}
                        <div className="form-group flex flex-col items-start w-[31.333%]">
                            <label htmlFor="product_is_offerable">Teklif Opsiyonu</label>
                            <select
                                name="product_is_offerable"
                                id="product_is_offerable"
                                className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                required
                                {...register('product_is_offerable')}
                            >
                                <option value={false} defaultChecked selected>Teklif Opsiyonu Yok</option>
                                <option value={true}>Teklif Opsiyonu Var</option>
                            </select>
                            <small className="text-red-500 text-xs">
                                {errors.product_is_offerable && errors.product_is_offerable.message}
                            </small>
                        </div>
                    </div>

                    <div className="my-4 flex items-center justify-end">
                        <button
                            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline text-sm"
                        >
                            Ürün Ekle
                        </button>
                    </div>

                </form>
            </section>
        </div>
    )
}

export default AddProduct;