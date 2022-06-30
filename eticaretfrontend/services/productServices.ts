import axios from "axios";

const SERVICE = axios.create({
    baseURL: "https://localhost:7079/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});


export const productServices = {
    getAllProducts: () => {
        return SERVICE.get("/Product/GetAll");
    },
    getAllProductColors: () => {
        return SERVICE.get("/Product/GetAllColors");
    },
    getAllProductBrands: () => {
        return SERVICE.get('/Product/GetAllBrands')
    },
    getAllUsageStatuses: () => {
        return SERVICE.get('/Product/GetAllUsageStatuses')
    },
    addProduct: (product: any) => {
        return SERVICE.post("/Product/AddProduct", product);
    },
    buyProduct: (userId: number, productId: number) => {
        return SERVICE.post("/Offer/BuyProduct", { idKullanici: userId, idUrun: productId });
    },
    offerProduct: (userId: number, productUserOwnId: number, productId: number, price: number) => {
        return SERVICE.post("/Offer/AddOffer", { idUrunSahibi: productUserOwnId, idKullanici: userId, idUrun: productId, fiyat: price });
    },
    getOfferOfUserSend: (userId: number) => {
        return SERVICE.get("/Offer/PostOfferOfUser/", { params: { idUser: userId } });
    },
    getOfferOfUserIncome: (userId: number) => {
        return SERVICE.get("/Offer/GetOfferOfUser/", { params: { idUser: userId } });
    },
    acceptOffer: (offerId: number, userId: number) => {
        return SERVICE.post("/Offer/AcceptOffer", { idOffer: offerId, idKullanici: userId });
    },
    rejectOffer: (offerId: number) => {
        return SERVICE.post("/Offer/RejectOffer", { idOffer: offerId });
    }
};