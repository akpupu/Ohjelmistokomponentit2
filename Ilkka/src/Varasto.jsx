import { useEffect, useState } from "react";

function Varasto() {
  const [varastot, setVarastot] = useState([]);
  const [ladataan, setLadataan] = useState(true);

  useEffect(() => {
    lataaVarasto();
  }, []);

  const lataaVarasto = async () => {
    try {
      const response = await fetch(
        "/kukkatukku/hae_kaikki/varasto"
      );

      const data = await response.json();

      if (!response.ok || data.viesti) {
        throw new Error(
          data.viesti ||
            "Varastotietojen hakeminen epäonnistui"
        );
      }

      if (data && data.kyselynTulos) {
        setVarastot(data.kyselynTulos);
      } else if (Array.isArray(data)) {
        setVarastot(data);
      } else {
        setVarastot([]);
      }
    } catch (error) {
      console.error(
        "Virhe varastoa ladattaessa:",
        error
      );

      alert(
        error.message ||
          "Varastotietojen lataaminen epäonnistui."
      );
    } finally {
      setLadataan(false);
    }
  };

  return (
    <section>
      <h1>Varasto</h1>

      {ladataan ? (
        <p>Ladataan varastotietoja...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nro</th>
              <th>Kukka</th>
              <th>Väri</th>
              <th>Viljelijä</th>
              <th>Hinta</th>
              <th>Määrä</th>
              <th>Varastosaldo</th>
              <th>Yksikköhinta</th>
            </tr>
          </thead>

          <tbody>
            {varastot.map((varasto) => (
              <tr key={varasto.numero}>
                <td>{varasto.numero}</td>
                <td>{varasto.kukkanimi}</td>
                <td>{varasto.vari}</td>
                <td>{varasto.viljelijanimi}</td>
                <td>{varasto.hinta} €</td>
                <td>{varasto.maara}</td>
                <td>{varasto.varastosaaldo}</td>
                <td>{varasto.yksikköhinta} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Varasto;
