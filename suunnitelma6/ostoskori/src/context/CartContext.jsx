import { createContext, useState } from "react";

// Luodaan itse context, jota komponentit käyttävät useContext-hookin kanssa
export const CartContext = createContext();

// Luodaan Provider-komponentti, joka kääritään koko sovelluksen ympärille
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Funktio uuden tuotteen lisäämiseksi ostoskoriin
  const addToCart = (product) => {
    // Luodaan tuotteelle yksilöllinen id ajan perusteella
    const newProduct = { ...product, id: Date.now() };
    setCartItems([...cartItems, newProduct]);
  };

  // Funktio tuotteen poistamiseksi ostoskorista id:n perusteella
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Funktio ostoskorin tyhjentämiseksi
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
