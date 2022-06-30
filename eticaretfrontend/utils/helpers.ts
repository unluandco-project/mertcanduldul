export const listArray = [
    {
        id: 1,
        label: "Yüzlerce üründen fazla seçim yapabilirsiniz",
    },
    {
        id: 2,
        label: "Hesabınızın ücretsiz kullanımını sağlayabilirsiniz",
    },
    {
        id: 3,
        label: "Opsiyonlu ürünlerinizi seçebilirsiniz",
    },
    {
        id: 4,
        label: "İstediğiniz kategoride ürünlerinizi bulabilirsiniz",
    }
]

export const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export const formatterCurrency = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
});
