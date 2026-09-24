import React, { createContext, useState } from "react";

// Luodaan kontekstit vaatimusten mukaisesti, pääosassa CartContext
export const CartContext = createContext();
export const ThemeContext = createContext();
export const UserContext = createContext();

// Alustava data ostoslistalle (esimerkkituotteet)
const alkuperaisetTuotteet = [
  { name: "Maito", quantity: 1, category: "Maitotuotteet" },
  { name: "Leipä", quantity: 2, category: "Leivonnaiset" },
  { name: "Omenat", quantity: 5, category: "Hedelmät" },
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(alkuperaisetTuotteet);
  const [hakusana, setHakusana] = useState("");
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState("Matti Meikäläinen");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Funktio uuden tuotteen lisäämiseen ostoskoriin
  const addToCart = (uusiTuote) => {
    // Tarkistetaan onko tuote jo korissa (samalla nimellä)
    const existingItem = cartItems.find(
      (item) => item.name.toLowerCase() === uusiTuote.name.toLowerCase(),
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.name.toLowerCase() === uusiTuote.name.toLowerCase()
            ? { ...item, quantity: item.quantity + Number(uusiTuote.quantity) }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        { ...uusiTuote, quantity: Number(uusiTuote.quantity) },
      ]);
    }
  };

  // Funktio tuotteen poistamiseen
  const removeFromCart = (name) => {
    setCartItems(cartItems.filter((item) => item.name !== name));
  };

  // Suodatetaan tuotteet hakusanan perusteella
  const suodatetutTuotteet = cartItems.filter((item) =>
    item.name.toLowerCase().includes(hakusana.toLowerCase()),
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <CartContext.Provider
          value={{
            cartItems: suodatetutTuotteet,
            hakusana,
            setHakusana,
            addToCart,
            removeFromCart,
          }}
        >
          {children}
        </CartContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};
