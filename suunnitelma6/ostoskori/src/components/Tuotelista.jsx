import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Tuotelista() {
  const { addToCart } = useContext(CartContext); // Haetaan funktio suoraan contextista!

  const esimerkkituotteet = [
    { id: 1, name: "Maito" },
    { id: 2, name: "Leipä" },
    { id: 3, name: "Kahvi" },
  ];

  return (
    <div>
      <h3>Kaupan tuotteet</h3>
      <ul>
        {esimerkkituotteet.map((tuote) => (
          <li key={tuote.id}>
            {tuote.name}{" "}
            <button onClick={() => addToCart(tuote)}>Lisää ostoskoriin</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tuotelista;
