import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Ostoskori() {
  // Haetaan ostoskorin tuotteet ja poistofunktio globaalista tilasta
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div
      style={{
        marginTop: "20px",
        borderTop: "1px solid #ccc",
        paddingTop: "10px",
      }}
    >
      <h3>Sinun ostoskorisi ({cartItems.length} tuotetta)</h3>
      {cartItems.length === 0 ? (
        <p>Ostoskori on tyhjä.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} style={{ margin: "5px 0" }}>
                {item.name}{" "}
                <button onClick={() => removeFromCart(item.id)}>Poista</button>
              </li>
            ))}
          </ul>
          <button
            onClick={clearCart}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Tyhjennä ostoskori
          </button>
        </>
      )}
    </div>
  );
}

export default Ostoskori;
