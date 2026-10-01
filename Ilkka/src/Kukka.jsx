import { useState } from "react";

function Kukka({ kukat, setKukat }) {
  const [activeTab, setActiveTab] = useState("kaikki");

  const [uusiKukka, setUusiKukka] = useState({
    nimi: "",
    vari: "",
    hinta: "",
    maara: "",
  });

  const [muokattavaKukka, setMuokattavaKukka] = useState(null);

  const lataaKukat = async () => {
    try {
      const response = await fetch(
        "/kukkatukku/hae_kaikki/kukka"
      );

      if (!response.ok) {
        throw new Error("Kukkien hakeminen epäonnistui");
      }

      const data = await response.json();

      if (data && data.kyselynTulos) {
        setKukat(data.kyselynTulos);
      } else if (Array.isArray(data)) {
        setKukat(data);
      } else {
        setKukat([]);
      }
    } catch (error) {
      console.error("Virhe kukkia ladattaessa:", error);
      alert("Kukkien lataaminen epäonnistui.");
    }
  };

  const lisaaKukka = async (e) => {
    e.preventDefault();

    if (
      !uusiKukka.nimi ||
      !uusiKukka.vari ||
      !uusiKukka.hinta ||
      !uusiKukka.maara
    ) {
      alert("Täytä kaikki kentät");
      return;
    }

    const uusi = {
      nimi: uusiKukka.nimi,
      vari: uusiKukka.vari,
      hinta: Number(uusiKukka.hinta),
      maara: Number(uusiKukka.maara),
    };

    try {
      const response = await fetch(
        "/kukkatukku/lisaa/kukka",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uusi),
        }
      );

      const data = await response.json();

      if (!response.ok || data.viesti) {
        throw new Error(
          data.viesti || "Kukan lisääminen epäonnistui"
        );
      }

      await lataaKukat();

      setUusiKukka({
        nimi: "",
        vari: "",
        hinta: "",
        maara: "",
      });

      setActiveTab("kaikki");

      alert("Kukka lisättiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe kukkaa lisättäessä:",
        error
      );
      alert(
        error.message ||
          "Kukan lisääminen epäonnistui."
      );
    }
  };

  const paivitaKukka = async (e) => {
    e.preventDefault();

    if (
      !muokattavaKukka.nimi ||
      !muokattavaKukka.vari ||
      !muokattavaKukka.hinta ||
      !muokattavaKukka.maara
    ) {
      alert("Täytä kaikki kentät");
      return;
    }

    const paivitetty = {
      nimi: muokattavaKukka.nimi,
      vari: muokattavaKukka.vari,
      hinta: Number(muokattavaKukka.hinta),
      maara: Number(muokattavaKukka.maara),
    };

    try {
      const response = await fetch(
        "/kukkatukku/paivita/kukka/paivita_kukka",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paivitetty),
        }
      );

      const data = await response.json();

      if (!response.ok || data.viesti) {
        throw new Error(
          data.viesti ||
            "Kukan päivittäminen epäonnistui"
        );
      }

      await lataaKukat();

      setMuokattavaKukka(null);
      setActiveTab("kaikki");

      alert("Kukka päivitettiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe kukkaa päivitettäessä:",
        error
      );
      alert(
        error.message ||
          "Kukan päivittäminen epäonnistui."
      );
    }
  };

  const poistaKukka = async (nimi) => {
    const vahvistus = window.confirm(
      "Haluatko varmasti poistaa tämän kukan?"
    );

    if (!vahvistus) {
      return;
    }

    try {
      const response = await fetch(
        `/kukkatukku/poista/kukka/${encodeURIComponent(
          nimi
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || data.viesti) {
        throw new Error(
          data.viesti ||
            "Kukan poistaminen epäonnistui"
        );
      }

      await lataaKukat();

      alert("Kukka poistettiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe kukkaa poistettaessa:",
        error
      );
      alert(
        error.message ||
          "Kukan poistaminen epäonnistui."
      );
    }
  };

  return (
    <section>
      <h1>Kukat</h1>

      <div className="sub-tabs">
        <button
          className={
            activeTab === "kaikki" ? "active" : ""
          }
          onClick={() => setActiveTab("kaikki")}
        >
          Kaikki kukat
        </button>

        <button
          className={
            activeTab === "kortteina" ? "active" : ""
          }
          onClick={() => setActiveTab("kortteina")}
        >
          Kaikki kukat kortteina
        </button>

        <button
          className={
            activeTab === "lisaa" ? "active" : ""
          }
          onClick={() => setActiveTab("lisaa")}
        >
          Lisää kukka
        </button>

        <button
          className={
            activeTab === "paivita" ? "active" : ""
          }
          onClick={() => setActiveTab("paivita")}
        >
          Päivitä kukka
        </button>

        <button
          className={
            activeTab === "muut" ? "active" : ""
          }
          onClick={() => setActiveTab("muut")}
        >
          Muut
        </button>
      </div>

      {activeTab === "kaikki" && (
        <table>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Väri</th>
              <th>Hinta</th>
              <th>Määrä</th>
              <th>Toiminnot</th>
            </tr>
          </thead>

          <tbody>
            {kukat.map((kukka) => (
              <tr key={kukka.nimi}>
                <td>{kukka.nimi}</td>
                <td>{kukka.vari}</td>
                <td>{kukka.hinta} €</td>
                <td>{kukka.maara}</td>

                <td>
                  <button
                    onClick={() => {
                      setMuokattavaKukka({
                        ...kukka,
                      });
                      setActiveTab("paivita");
                    }}
                  >
                    Muokkaa
                  </button>

                  <button
                    onClick={() =>
                      poistaKukka(kukka.nimi)
                    }
                  >
                    Poista
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "kortteina" && (
        <div className="cards">
          {kukat.map((kukka) => (
            <div
              className="card"
              key={kukka.nimi}
            >
              <h3>{kukka.nimi}</h3>

              <p>Väri: {kukka.vari}</p>
              <p>Hinta: {kukka.hinta} €</p>
              <p>Määrä: {kukka.maara}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "lisaa" && (
        <div className="form-container">
          <h2>Lisää uusi kukka</h2>

          <form onSubmit={lisaaKukka}>
            <label>Kukan nimi</label>

            <input
              type="text"
              value={uusiKukka.nimi}
              onChange={(e) =>
                setUusiKukka({
                  ...uusiKukka,
                  nimi: e.target.value,
                })
              }
            />

            <label>Väri</label>

            <input
              type="text"
              value={uusiKukka.vari}
              onChange={(e) =>
                setUusiKukka({
                  ...uusiKukka,
                  vari: e.target.value,
                })
              }
            />

            <label>Hinta</label>

            <input
              type="number"
              step="0.01"
              value={uusiKukka.hinta}
              onChange={(e) =>
                setUusiKukka({
                  ...uusiKukka,
                  hinta: e.target.value,
                })
              }
            />

            <label>Määrä</label>

            <input
              type="number"
              value={uusiKukka.maara}
              onChange={(e) =>
                setUusiKukka({
                  ...uusiKukka,
                  maara: e.target.value,
                })
              }
            />

            <button type="submit">
              Lisää kukka
            </button>
          </form>
        </div>
      )}

      {activeTab === "paivita" && (
        <div className="form-container">
          <h2>Päivitä kukka</h2>

          {!muokattavaKukka ? (
            <div>
              <p>
                Valitse ensin kukka taulukosta.
              </p>

              <button
                onClick={() =>
                  setActiveTab("kaikki")
                }
              >
                Valitse kukka
              </button>
            </div>
          ) : (
            <form onSubmit={paivitaKukka}>
              <label>Kukan nimi</label>

              <input
                type="text"
                value={muokattavaKukka.nimi}
                disabled
              />

              <label>Väri</label>

              <input
                type="text"
                value={muokattavaKukka.vari}
                onChange={(e) =>
                  setMuokattavaKukka({
                    ...muokattavaKukka,
                    vari: e.target.value,
                  })
                }
              />

              <label>Hinta</label>

              <input
                type="number"
                step="0.01"
                value={muokattavaKukka.hinta}
                onChange={(e) =>
                  setMuokattavaKukka({
                    ...muokattavaKukka,
                    hinta: e.target.value,
                  })
                }
              />

              <label>Määrä</label>

              <input
                type="number"
                value={muokattavaKukka.maara}
                onChange={(e) =>
                  setMuokattavaKukka({
                    ...muokattavaKukka,
                    maara: e.target.value,
                  })
                }
              />

              <button type="submit">
                Tallenna muutokset
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === "muut" && (
        <div className="other-actions">
          <p>Muut toiminnot</p>
        </div>
      )}
    </section>
  );
}

export default Kukka;
