import config from './apiConfig';

const MOCK_PRODUCTS = [
  { id: 1, title: "Recycled Plastic Chair", price: 45, material: "Plastic", image: "https://via.placeholder.com/300" },
  { id: 2, title: "Glass Bottle Lamp", price: 30, material: "Glass", image: "https://via.placeholder.com/300" },
  { id: 3, title: "Eco-Friendly Tote Bag", price: 15, material: "Fabric", image: "https://via.placeholder.com/300" },
];

export const marketService = {
  getProducts: async () => {
    if (config.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_PRODUCTS;
    }
  }
};