import ProductCard from "./shared/ProductCard";
import logo from "../assets/ecommerce_logo.jpeg";

const products = [
    {
        image: "https://res.cloudinary.com/zsypxb04/image/upload/v1786894536/g6sfls5km3ygkwebpvoe.jpg",
        productName: "🌀 Washing Machine",
        description:
          "A modern washing machine designed for efficiency and convenience. It features multiple wash programs, energy‑saving technology, and a durable drum that handles both delicate fabrics and heavy loads. With smart sensors to adjust water and detergent usage, it ensures cleaner clothes while reducing waste.",
        specialPrice: 720,
        price: 780,
      },
      {
        image: "https://res.cloudinary.com/zsypxb04/image/upload/v1786894571/tqrxixecighmic2ec2cp.jpg",
        productName: "📱 Smartphone",
        description:
          "A sleek smartphone built for performance and connectivity. Equipped with a high‑resolution display, powerful processor, and long‑lasting battery, it supports multitasking, gaming, and streaming with ease. Advanced camera systems capture stunning photos and videos, while 5G support keeps you connected at lightning speed.",
        specialPrice: 699,
        price: 799,
      },
      {
        image:"https://res.cloudinary.com/zsypxb04/image/upload/v1786894454/rsrnili8qs7jj0fxss4r.jpg",
        productName: "👟 Sports Shoes",
        description:
          "Lightweight sports shoes engineered for comfort and agility. They feature breathable mesh uppers, cushioned midsoles, and durable outsoles for maximum grip. Ideal for running, training, or casual wear, these shoes combine style with performance to keep you moving effortlessly.",
        price: 599,
        specialPrice: 400,
      }
];

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-slate-800 text-4xl font-bold text-center mb-12">
                About Us
            </h1>
           <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <p className="text-lg mb-4">
                        Welcome to our e-commerce store! We are dedicated to providing the
                        best products and services to our customers. Our mission is to offer
                        a seamless shopping experience while ensuring the highest quality of
                        our offerings.
                    </p>
                </div>

                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                   <img src={logo} alt="E-commerce Logo" 
                        className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" />
                </div>
           </div>


           <div className="py-7 space-y-8">
            <h1 className="text-slate-800 text-4xl font-bold text-center">
                Our Products
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.map((product, index) => (
                <ProductCard 
                    key={index}
                    image={product.image}
                    productName={product.productName}
                    description={product.description}
                    specialPrice={product.specialPrice}
                    price={product.price}
                    about
                />
               ))
               }
                

            </div>
           </div>
        </div>
    );
}

export default About;
