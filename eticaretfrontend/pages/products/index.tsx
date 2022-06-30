import { useAppSelector } from "app/hooks";
import { Toast } from "components";
import { IProduct } from "interfaces/products";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import DataTable from 'react-data-table-component';
import { AiOutlineClose } from "react-icons/ai";
import { FaRegWindowClose } from "react-icons/fa";
import ReactModal from "react-modal";
import { productServices } from "services/productServices";
import { customStyles, formatterCurrency } from "utils/helpers";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const products: IProduct[] = await productServices.getAllProducts().then((res) => res.data);
    return {
        props: {
            products
        }
    }
}

const Products: NextPage = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const { authenticatedUser } = useAppSelector(state => state.auth);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [offeredPrice, setOfferedPrice] = React.useState("");
    const [selectedProduct, setSelectedProduct] = React.useState<IProduct>();

    const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
        Toast({ type, message });
    }, []);

    const handleOfferModalClicked = (productId: number) => {
        setSelectedProduct(products.find((p: IProduct) => p.ID_URUN === productId));
        setIsModalOpen(true);
    }

    const handleOfferSubmit = async () => {
        try {
            event?.preventDefault();
            const response = await productServices.offerProduct(authenticatedUser.user.UserId, Number(selectedProduct?.ID_URUN_SAHIBI), selectedProduct!.ID_URUN, Number(offeredPrice));
            if (response.data.IsSuccess) {
                notify("success", "Teklifiniz başarıyla gönderildi.");
                setIsModalOpen(false);
                return
            }
            notify("error", response.data.Message);
        } catch (e) {
            notify("error", "Hata oluştu!");
        }
    }

    const handleBuyClicked = async (id: number, productId: number) => {
        try {
            const response = await productServices.buyProduct(id, productId);
            if (response.data.IsSuccess) {
                notify("success", "Ürün başarıyla satın alındı.");
                router.push("/products");
                return
            }
        } catch (err) {
            notify("error", "Ürün satın alınırken bir sorun oluştu!");
        }
    }

    const columns = [
        {
            name: 'Marka',
            selector: 'MARKA_ADI',
            sortable: true,
            cell: (row: IProduct) => <div>{row.MARKA_ADI}</div>
        },
        {
            name: 'Ürün Adı',
            selector: 'URUN_ADI',
            sortable: true,
            cell: (row: IProduct) => <div>{row.URUN_ADI}</div>
        },
        {
            name: 'Durum',
            selector: 'KULLANIM_DURUM_ADI',
            sortable: true,
            cell: (row: IProduct) => <div>{row.KULLANIM_DURUM_ADI}</div>
        },
        {
            name: 'Fiyat(₺)',
            selector: 'FIYAT',
            sortable: true,
            cell: (row: IProduct) => <div>{formatterCurrency.format(row.FIYAT)}</div>
        },
        {
            name: 'Satış Durumu',
            selector: 'IS_SOLD',
            sortable: true,
            cell: (row: IProduct) => <div>{row.IS_SOLD ? "Satıldı" : "Satılık"}</div>
        },
        {
            name: 'Kategorisi',
            selector: 'KATEGORI_ADI',
            sortable: true,
            cell: (row: IProduct) => <div>{row.KATEGORI_ADI}</div>
        },
        {
            name: 'Ürün Rengi',
            selector: 'RENK_ADI',
            sortable: true,
            cell: (row: IProduct) => <div>{row.RENK_ADI}</div>
        },
        {
            name: "Ürün Açıklaması",
            selector: "URUN_ACIKLAMA",
            sortable: false,
            cell: (row: IProduct) => <div className="text-xs py-2">{String(row.URUN_ACIKLAMA).substring(0, 50)}{row.URUN_ACIKLAMA.length > 50 ? "..." : ""}</div>
        },
        {
            name: "İşlemler",
            selector: "ID_URUN",
            sortable: false,
            cell: (row: IProduct) => (
                <div className="flex flex-col items-center justify-center w-full gap-y-2 my-2">
                    {
                        row.IS_OFFERABLE ? (
                            <button
                                onClick={() => handleOfferModalClicked(row.ID_URUN)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                                Teklif Ver
                            </button>
                        ) : (
                            <button
                                className="bg-gray-400 hover:bg-gray-300 cursor-not-allowed text-white font-bold py-2 px-4 rounded w-full">
                                Teklif Verilemez
                            </button>
                        )
                    }
                    <button
                        onClick={() => handleBuyClicked(authenticatedUser.user.UserId, row.ID_URUN)}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">
                        Satın Al
                    </button>
                </div>
            )
        }

    ]

    const data: IProduct[] = products.filter((product: IProduct) => product.IS_SOLD === false && product.ID_URUN_SAHIBI !== authenticatedUser.user.UserId);

    console.log(data);
    

    React.useEffect(() => {
        ReactModal.setAppElement('#__next');
    }, [])

    return (
        <div>
            <Head>
                <title>E-Ticaret Uygulaması | Ürünler</title>
            </Head>
            <section className="flex flex-col w-full p-4">
                <div className="flex justify-end mb-4">
                    <Link href="/products/add-products">
                        <a className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 text-sm rounded">Ürün Ekle</a>
                    </Link>
                </div>
                <DataTable
                    // @ts-ignore
                    columns={columns}
                    data={data}
                />
                <ReactModal
                    isOpen={isModalOpen}
                    style={customStyles}
                    shouldCloseOnEsc={true}
                    onRequestClose={() => {
                        setIsModalOpen(false)
                        setOfferedPrice("")
                    }}
                    contentLabel="Teklif Ver"
                >
                    <button
                        className="float-right mb-4 pb-4"
                        onClick={() => {
                            setIsModalOpen(false)
                            setOfferedPrice("")
                        }}
                    >
                        <AiOutlineClose size={20} />
                    </button>
                    <form method="post" className="w-full max-w-lg p-6">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Teklif Tutarı
                                </label>
                                <input
                                    type="number"
                                    placeholder="Teklifinizi giriniz..."
                                    required
                                    className="border border-gray-400 p-2 w-96"
                                    name="offered_price"
                                    value={offeredPrice}
                                    min={0}
                                    max={selectedProduct?.FIYAT || 0}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOfferedPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="w-full flex items-center justify-end">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-fit outline-slate-800"
                                    type="submit"
                                    // @ts-ignore
                                    onClick={handleOfferSubmit}
                                >
                                    Teklif Ver
                                </button>
                            </div>
                        </div>
                    </form>
                </ReactModal>
            </section>
        </div>
    )
}

export default Products;