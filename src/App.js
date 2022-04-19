import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navigation from "./components/Navigation";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import ProductsPage from "./pages/ProductsPage";
import { CartContext } from "./CartContext"; //use curly bracket casue we export component but not at default
import { useEffect, useState } from "react";
import { getCart, storeCart } from "./helpers";

const App = () => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    getCart().then((cart) => {
      setCart(JSON.parse(cart));
    });
 
    // console.log(JSON.parse(cart));
  }, []);

  useEffect(() => {
    storeCart(JSON.stringify(cart));
    // window.localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); //dependency
  return (
    <>
      <Router>
        <CartContext.Provider value={{ cart, setCart }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            {/* <Route path="/about" element={<About />}></Route> */}
            <Route path="/products" exact element={<ProductsPage />}></Route>
            <Route path="/products/:_id" element={<SingleProduct />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
          </Routes>
        </CartContext.Provider>
      </Router>
    </>
  );
};

export default App;
