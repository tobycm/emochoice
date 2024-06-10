import { ProductWithKeywords } from "./utils/search";

const Constants = Object.freeze<{
  PocketBaseURL: string;
  exampleProduct: ProductWithKeywords;
}>({
  PocketBaseURL: "https://pocketbase.emochoice.ca",
  exampleProduct: {
    collectionId: "kt5o377go6qzzct",
    collectionName: "products",
    created: Date(),
    updated: Date(),
    brand: "grj5wxlbdp33xmc",
    id: "404productnotfound",
    name: "Sui-chan wa kyou mo Kawaii~ Mug",
    custom_id: "messikimochi",
    category: ["upfqqdkkgeff7wj"],
    hidden: false,
    tags: ["out_of_stock"],
    colors: ["oagyo7283zmms2y"],
    types: ["jh5d0keidenggzg", "c325dz03i9coqwz"],
    images: [],
    boundary: "",
    description:
      "Introducing the ultimate companion for your morning ritual - " +
      "Sui-chan wa kyou mo Kawaii~ Mug. " +
      "Elevate your coffee or tea experience with this exquisite, " +
      "handcrafted vessel designed to cradle your favorite brew. " +
      "Crafted from high-quality, lead-free ceramic, it ensures " +
      "your beverage's purity and taste remain untarnished. The " +
      "ergonomic handle provides a comfortable grip, while the wide " +
      "base offers stability. Its double-walled insulation keeps " +
      "drinks at the perfect temperature, whether piping hot or " +
      "refreshingly cool. The elegant, minimalist design complements " +
      "any kitchen or office space. Dishwasher and microwave safe, " +
      "it's a breeze to clean and maintain. Indulge in your daily dose " +
      "of comfort and style with this exceptional mug!",
    custom_data: { "Handcrafted by": "Toby and Eggu" },
    keywords: "sui-chan wa kyou mo kawaii~ mug oagyo7283zmms2y messikimochi jh5d0keidenggzg c325dz03i9coqwz upfqqdkkgeff7wj toby and eggu",
    expand: {
      brand: {
        id: "grj5wxlbdp33xmc",
        name: "Toby and Eggu",
        collectionId: "846j6uvbucbn6pp",
        collectionName: "brands",
        created: Date(),
        updated: Date(),
      },
    },
    customizable: false,
  },
});

export default Constants;
