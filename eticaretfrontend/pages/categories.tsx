import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { customStyles } from "utils/helpers";
import Modal from 'react-modal';
import { useRouter } from "next/router";
import { IProduct } from "interfaces/products";
import { ICategory } from "interfaces/category";
import { categoriesServices } from "services/categoriesServices";
import { FaEye, FaPlus, FaEdit, FaRegWindowClose } from "react-icons/fa";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const categories: ICategory[] = await categoriesServices.getCategories().then((res) => res.data);
    return {
        props: {
            categories
        }
    }
}

const Categories: NextPage = ({ categories }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    /* filtered active categories */
    const [activeCategories, setActiveCategories] = React.useState<ICategory[]>(categories);
    const [selectedCategory, setSelectedCategory] = React.useState<ICategory | null>(null);

    /* updated categories */
    const [isCategoryUpdateVisible, setIsCategoryUpdateVisible] = React.useState(false);
    const [updatedCategory, setUpdatedCategory] = React.useState(selectedCategory?.KATEGORI_ADI);

    /* added categories */
    const [isCategoryAddVisible, setIsCategoryAddVisible] = React.useState(false);
    const [addedCategory, setAddedCategory] = React.useState('');

    /* showing products */
    const [isProductVisible, setIsProductVisible] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState([]);

    /* MAIN FUNCTIONS */
    const handleUpdateCategory = (id: number) => {
        const category = categories.find((category: ICategory) => category.ID_KATEGORI === id);
        setSelectedCategory(category);
        setUpdatedCategory(category?.KATEGORI_ADI);
        setIsCategoryUpdateVisible(true);
    }

    const handleCategoryUpdateClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (updatedCategory === "" || updatedCategory === null) {
            console.log('Kategori adı giriniz!');
            return;
        }

        if (categories.find((category: ICategory) => category.KATEGORI_ADI === updatedCategory)) {
            alert('Kategori zaten mevcut!');
            return;
        }

        const category: ICategory = {
            ID_KATEGORI: Number(selectedCategory?.ID_KATEGORI),
            KATEGORI_ADI: String(updatedCategory),
        }

        categoriesServices.updateCategory(category)
            .then(() => {
                setActiveCategories(activeCategories.map((c: ICategory) => {
                    if (c.ID_KATEGORI === category.ID_KATEGORI) {
                        c.KATEGORI_ADI = String(updatedCategory);
                    }
                    return category;
                }
                ));

                setSelectedCategory(null);
                setUpdatedCategory("");
                setIsCategoryUpdateVisible(false);

            })
            .catch(() => {
                console.log('Kategori güncellenirken hata oluştu!');
            })

        setIsCategoryUpdateVisible(false);
        router.push('/categories');
    }

    const handleCategoryAddClick = (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        if (addedCategory === "" || addedCategory === null) {
            console.log('Kategori adı giriniz!');
            return;
        }

        if (categories.find((category: ICategory) => category.KATEGORI_ADI === addedCategory)) {
            alert('Kategori zaten mevcut!');
            return;
        }

        const category: ICategory = {
            KATEGORI_ADI: String(addedCategory),
        }

        categoriesServices.addCategory(category)
            .then(() => {
                setActiveCategories([...activeCategories, category]);
                setAddedCategory("");
                setUpdatedCategory("");
                setIsCategoryAddVisible(false);
                setIsCategoryUpdateVisible(false);
            })
            .catch(() => {
                console.log('Kategori eklenirken hata oluştu!');
            })

        router.push('/categories');
    }

    const handleShowProductsByCategoryName = (categoryName: string) => {
        event?.preventDefault();
        setIsProductVisible(true);
        setSelectedCategory(categories.find((category: ICategory) => category.KATEGORI_ADI === categoryName));

        categoriesServices.GetProductsByCategoryName(categoryName)
            .then((res) => {
                setSelectedProduct(res.data);
            })
            .catch(() => {
                console.log('Ürünler getirilirken hata oluştu!');
            })

        router.push('/categories');
    }


    React.useEffect(() => {
        Modal.setAppElement('#__next');
    }, [])

    return (
        <div>
            <Head>
                <title>E Ticaret Uygulaması | Kategoriler</title>
            </Head>
            <section className="flex items-center justify-center w-fit p-4">
                <div className="flex-shrink-0">
                    <div className="flex w-full items-center justify-end">
                        <button
                            className="flex items-center justify-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded outline-slate-600 text-sm"
                            onClick={() => {
                                setIsCategoryAddVisible(true);
                            }}
                        >
                            <span className="mr-2"><FaPlus /></span>
                            <span>Kategori Ekle</span>
                        </button>
                    </div>

                    <div id="categories_table" className="mt-4 border border-gray-400 flex-shrink-0">
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Kategori Adı</th>
                                    <th className="px-4 py-2">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category: ICategory) => (
                                    <tr key={category.ID_KATEGORI}>
                                        <td className="border px-4 py-2">{category.KATEGORI_ADI}</td>
                                        <td className="border px-4 py-2 flex items-center justify-between">
                                            <button
                                                onClick={() => handleUpdateCategory(category.ID_KATEGORI!)}
                                                title="Kategori Güncelle"
                                            >
                                                <FaEdit
                                                    size={20}
                                                    className="text-gray-500 hover:text-gray-700"
                                                />
                                            </button>
                                            <button
                                                className="mx-2"
                                                onClick={() => handleShowProductsByCategoryName(category.KATEGORI_ADI!)}
                                                title="Kategorideki Ürünleri Görüntüle"
                                            >
                                                <FaEye
                                                    size={20}
                                                    className="text-green-500 hover:text-green-700"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    isCategoryUpdateVisible && (
                        <div className="border border-gray-400 mx-4 mt-3">
                            <h3 className="text-xl font-bold m-4 mb-0">
                                Kategori Güncelle
                            </h3>
                            <form method="post" className="w-full max-w-lg p-6">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            Kategori Adı
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Kategori Adı"
                                            required
                                            className="border border-gray-400 p-2"
                                            name="category_name"
                                            value={updatedCategory}
                                            onChange={(e) => setUpdatedCategory(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full">
                                    <div className="w-full flex items-center justify-end">
                                        <button
                                            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-3 rounded flex items-center justify-center w-fit outline-slate-800"
                                            type="submit"
                                            // @ts-ignore
                                            onClick={handleCategoryUpdateClick}
                                        >
                                            <span className="mr-2"><FaEdit /></span>
                                            Güncelle
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )
                }
                {
                    isProductVisible && (
                        <div className="border border-gray-400 mx-4 mt-3">
                            <h6 className="text-lg font-bold border-b pb-2 p-2">{selectedCategory?.KATEGORI_ADI}</h6>
                            {selectedProduct.length > 0 ?
                                (
                                    <div className="flex items-center justify-between flex-wrap">
                                        {
                                            selectedProduct.map((product: IProduct) => (
                                                <div key={product.ID_URUN} className="flex my-2 px-2 border-r p-4">
                                                    <div>
                                                        <h1 className="text-sm">{product.RENK_ADI} {product.KULLANIM_DURUM_ADI} {product.URUN_ADI}</h1>
                                                        <h2 className="text-sm">{product.MARKA_ADI}</h2>
                                                        <div className={product.IS_SOLD ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
                                                            {product.IS_SOLD ? "Satıldı" : "Satılık"}
                                                        </div>
                                                        <h3 className="text-sm">{product.FIYAT}₺</h3>
                                                        <Link href={`/products`}>
                                                            <a
                                                                className={`${product.IS_OFFERABLE ? "bg-gray-800 cursor-pointer" : "bg-gray-400 cursor-not-allowed"} text-white font-bold py-1 px-2 rounded flex items-center justify-end outline-slate-800 text-xs mt-2 w-fit`}
                                                            >
                                                                {product.IS_OFFERABLE ? "Teklif Verilebilir" : "Teklif Verilemez"}
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                                : (
                                    <div className="flex items-center justify-center p-2 px-4">
                                        <h1 className="text-sm text-yellow-600">Kategoriye Ait Ürün Bulunamadı!</h1>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </section>
            <Modal
                isOpen={isCategoryAddVisible}
                style={customStyles}
                shouldCloseOnEsc={true}
                onRequestClose={() => setIsCategoryAddVisible(false)}
                contentLabel="Kategori Ekleme"
            >
                <button
                    className="float-right mb-4 pb-4"
                    onClick={() => setIsCategoryAddVisible(false)}
                >
                    <FaRegWindowClose size={20} />
                </button>
                <form method="post" className="w-full max-w-lg p-6">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Kategori Adı
                            </label>
                            <input
                                type="text"
                                placeholder="Kategori Adı"
                                required
                                className="border border-gray-400 p-2"
                                name="category_name"
                                value={addedCategory}
                                onChange={(e) => setAddedCategory(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-full flex items-center justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-fit outline-slate-800"
                                type="submit"
                                // @ts-ignore
                                onClick={handleCategoryAddClick}
                            >
                                <span className="mr-2"><FaPlus /></span>
                                Kategori Ekle
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Categories;