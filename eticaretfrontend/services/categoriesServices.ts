import axios from "axios";
import { ICategory } from "interfaces/category";

const SERVICE = axios.create({
    baseURL: "https://localhost:7079/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

export const categoriesServices = {
    getCategories: () => {
        return SERVICE.get("/Category/GetAllCategory");
    },
    GetProductsByCategoryName: (categoryName: string) => {
        return SERVICE.get("/Product/GetProductByCategoryName/" , { params: { categoryName } });
    },
    addCategory: (category: ICategory) => {
        return SERVICE.post("/Category/AddCategory", category);
    },
    updateCategory: (category: ICategory) => {
        return SERVICE.post("/Category/UpdateCategoryByIdCategory", category);
    },
    deleteCategory: (categoryId: number) => {
        return SERVICE.delete("/Category/DeleteCategoryByIdCategory" + categoryId);
    }
};