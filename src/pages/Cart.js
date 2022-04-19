import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../CartContext";

const Cart = () => {
  let total = 0;
  const [products, setProducts] = useState([]); //localstate
  const { cart, setCart } = useContext(CartContext);

  const [priceFetched, togglePriceFetched] = useState(false);

  useEffect(() => {
    if (!cart.items) {
      return;
    }
    if (priceFetched) {
      return;
    }
    // console.log(Object.keys(cart.items));
    fetch("https://star-spark-pasta.glitch.me/api/products/cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ ids: Object.keys(cart.items) }),
    })
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
        togglePriceFetched(true);
      });
  }, [cart]);

  const getQty = (product_id) => {
    return cart.items[product_id];
  };

  const increment = (product_id) => {
    const existingQty = cart.items[product_id];
    const _cart = { ...cart };
    _cart.items[product_id] = existingQty + 1;
    _cart.totalItems += 1;
    setCart(_cart);
  };
  const decrement = (product_id) => {
    const existingQty = cart.items[product_id];
    const _cart = { ...cart };
    if (existingQty === 1) {
      return;
    }
    _cart.items[product_id] = existingQty - 1;
    _cart.totalItems -= 1;
    setCart(_cart);
  };

  const getSum = (product_id, price) => {
    const existingQty = cart.items[product_id];
    const sum = price * getQty(product_id);
    total += sum;
    return sum;
  };

  const handleDelete = (product_id) => {
    const _cart = { ...cart };
    const qty = getQty(product_id);
    _cart.totalItems -= qty;
    delete _cart.items[product_id];

    setCart(_cart);
    setProducts(products.filter((product) => product._id !== product_id));
  };

  const handleOrderNow = () => {
    window.alert("order placed successfully!!!");
    setProducts([]);
    setCart({});
  };
  return products.length ? (
    <div className="container mx-auto lg:w-1/2 w-full pb-24">
      <h1 className="my-12 font-bold">Cart Items</h1>
      <ul>
        {products.map((product) => {
          return (
            <li key={product._id} className="mb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="h-16" src={product.image} />
                  <span className="font-bold ml-4 w-48">{product.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      decrement(product._id);
                    }}
                    className="bg-yellow-500 rounded-full px-4 py-2 leading-none"
                  >
                    -
                  </button>
                  <b className="px-4">{getQty(product._id)}</b>
                  <button
                    onClick={() => {
                      increment(product._id);
                    }}
                    className="bg-yellow-500 rounded-full px-4 py-2 leading-none"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold">
                  {getSum(product._id, product.price)}
                </span>
                <button
                  onClick={() => {
                    handleDelete(product._id);
                  }}
                  className="bg-red-500 rounded-full px-4 py-2 leading-none font-bold text-white"
                >
                  DELETE
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <hr className="my-6" />
      <div className="font-bold text-right my-4">Grand Total:{total}</div>
      <div className="text-right">
        <button
          onClick={handleOrderNow}
          className="bg-yellow-500 rounded-full px-4 py-2 leading-none"
        >
          Order Now
        </button>
      </div>
    </div>
  ) : (
    <img className="mx-auto w-1/2 mt-12" src="/images/empty-cart.png" />
  );
};

export default Cart;
