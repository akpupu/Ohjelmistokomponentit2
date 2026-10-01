import { useEffect, useState } from "react";

function Viljelija() {
  const [activeTab, setActiveTab] = useState("kaikki");
  const [viljelijat, setViljelijat] = useState([]);
  const [muokattava, setMuokattava] = useState(null);

  const tyhjaViljelija = {
    viljelijannro: "",
    ytunnus: "",
    nimi: "",
    osoite: "",
    yhteys_sukunimi: "",
    yhteys_etunimi: "",
    yhteys_puhelin: "",
    yhteys_email: "",
  };

  const [uusiViljelija, setUusiViljelija] =
    useState(tyhjaViljelija);

  useEffect(() => {
    lataaViljelijat();
  }, []);

  const lataaViljelijat = async () => {
    try {
      const response = await fetch(
        "/kukkatukku/hae_kaikki/viljelija"
      );

      if (!response.ok) {
        throw new Error(
          "Viljelijöiden hakeminen epäonnistui"
        );
      }

      const data = await response.json();

      if (data && data.viesti) {
        throw new Error(data.viesti);
      }

      if (data && data.kyselynTulos) {
        setViljelijat(data.kyselynTulos);
      } else if (Array.isArray(data)) {
        setViljelijat(data);
      } else {
        setViljelijat([]);
      }
    } catch (error) {
      console.error(
        "Virhe viljelijöitä ladattaessa:",
        error
      );

      alert(
        error.message ||
          "Viljelijöiden lataaminen epäonnistui."
      );
    }
  };

  const lisaaViljelija = async (e) => {
    e.preventDefault();

    if (
      !uusiViljelija.viljelijannro ||
      !uusiViljelija.ytunnus ||
      !uusiViljelija.nimi ||
      !uusiViljelija.osoite ||
      !uusiViljelija.yhteys_sukunimi ||
      !uusiViljelija.yhteys_etunimi ||
      !uusiViljelija.yhteys_puhelin ||
      !uusiViljelija.yhteys_email
    ) {
      alert("Täytä kaikki kentät");
      return;
    }

    const uusi = {
      viljelijannro: Number(
        uusiViljelija.viljelijannro
      ),
      ytunnus: uusiViljelija.ytunnus,
      nimi: uusiViljelija.nimi,
      osoite: uusiViljelija.osoite,
      yhteys_sukunimi:
        uusiViljelija.yhteys_sukunimi,
      yhteys_etunimi:
        uusiViljelija.yhteys_etunimi,
      yhteys_puhelin:
        uusiViljelija.yhteys_puhelin,
      yhteys_email:
        uusiViljelija.yhteys_email,
    };

    try {
      const response = await fetch(
        "/kukkatukku/lisaa/viljelija",
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
          data.viesti ||
            "Viljelijän lisääminen epäonnistui"
        );
      }

      await lataaViljelijat();

      setUusiViljelija(tyhjaViljelija);
      setActiveTab("kaikki");

      alert("Viljelijä lisättiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe viljelijää lisättäessä:",
        error
      );

      alert(
        error.message ||
          "Viljelijän lisääminen epäonnistui."
      );
    }
  };

  const paivitaViljelija = async (e) => {
    e.preventDefault();

    if (
      !muokattava.nimi ||
      !muokattava.osoite ||
      !muokattava.yhteys_sukunimi ||
      !muokattava.yhteys_etunimi ||
      !muokattava.yhteys_puhelin ||
      !muokattava.yhteys_email
    ) {
      alert("Täytä kaikki kentät");
      return;
    }

    const paivitetty = {
      viljelijannro: muokattava.viljelijannro,
      ytunnus: muokattava.ytunnus,
      nimi: muokattava.nimi,
      osoite: muokattava.osoite,
      yhteys_sukunimi:
        muokattava.yhteys_sukunimi,
      yhteys_etunimi:
        muokattava.yhteys_etunimi,
      yhteys_puhelin:
        muokattava.yhteys_puhelin,
      yhteys_email:
        muokattava.yhteys_email,
    };

    try {
      const response = await fetch(
        "/kukkatukku/paivita/viljelija/paivita_viljelija",
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
            "Viljelijän päivittäminen epäonnistui"
        );
      }

      await lataaViljelijat();

      setMuokattava(null);
      setActiveTab("kaikki");

      alert("Viljelijä päivitettiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe viljelijää päivitettäessä:",
        error
      );

      alert(
        error.message ||
          "Viljelijän päivittäminen epäonnistui."
      );
    }
  };

  const poistaViljelija = async (viljelijannro) => {
    const vahvistus = window.confirm(
      "Haluatko varmasti poistaa tämän viljelijän?"
    );

    if (!vahvistus) {
      return;
    }

    try {
      const response = await fetch(
        `/kukkatukku/poista/viljelija/${viljelijannro}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || data.viesti) {
        throw new Error(
          data.viesti ||
            "Viljelijän poistaminen epäonnistui"
        );
      }

      await lataaViljelijat();

      alert("Viljelijä poistettiin onnistuneesti!");
    } catch (error) {
      console.error(
        "Virhe viljelijää poistettaessa:",
        error
      );

      alert(
        error.message ||
          "Viljelijän poistaminen epäonnistui."
      );
    }
  };

  return (
    <section>
      <h1>Viljelijät</h1>

      <div className="sub-tabs">
        <button
          className={
            activeTab === "kaikki" ? "active" : ""
          }
          onClick={() => setActiveTab("kaikki")}
        >
          Kaikki viljelijät
        </button>

        <button
          className={
            activeTab === "kortteina" ? "active" : ""
          }
          onClick={() => setActiveTab("kortteina")}
        >
          Viljelijät kortteina
        </button>

        <button
          className={
            activeTab === "lisaa" ? "active" : ""
          }
          onClick={() => setActiveTab("lisaa")}
        >
          Lisää viljelijä
        </button>

        <button
          className={
            activeTab === "paivita" ? "active" : ""
          }
          onClick={() => setActiveTab("paivita")}
        >
          Päivitä viljelijä
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
              <th>Nro</th>
              <th>Y-tunnus</th>
              <th>Nimi</th>
              <th>Osoite</th>
              <th>Yhteyshenkilö</th>
              <th>Puhelin</th>
              <th>Sähköposti</th>
              <th>Toiminnot</th>
            </tr>
          </thead>

          <tbody>
            {viljelijat.map((viljelija) => (
              <tr key={viljelija.viljelijannro}>
                <td>{viljelija.viljelijannro}</td>
                <td>{viljelija.ytunnus}</td>
                <td>{viljelija.nimi}</td>
                <td>{viljelija.osoite}</td>

                <td>
                  {viljelija.yhteys_etunimi}{" "}
                  {viljelija.yhteys_sukunimi}
                </td>

                <td>{viljelija.yhteys_puhelin}</td>
                <td>{viljelija.yhteys_email}</td>

                <td>
                  <button
                    onClick={() => {
                      setMuokattava({
                        ...viljelija,
                      });
                      setActiveTab("paivita");
                    }}
                  >
                    Muokkaa
                  </button>

                  <button
                    onClick={() =>
                      poistaViljelija(
                        viljelija.viljelijannro
                      )
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
          {viljelijat.map((viljelija) => (
            <div
              className="card"
              key={viljelija.viljelijannro}
            >
              <h3>{viljelija.nimi}</h3>

              <p>
                Nro: {viljelija.viljelijannro}
              </p>

              <p>
                Y-tunnus: {viljelija.ytunnus}
              </p>

              <p>
                Osoite: {viljelija.osoite}
              </p>

              <p>
                Yhteyshenkilö:{" "}
                {viljelija.yhteys_etunimi}{" "}
                {viljelija.yhteys_sukunimi}
              </p>

              <p>
                Puhelin:{" "}
                {viljelija.yhteys_puhelin}
              </p>

              <p>
                Sähköposti:{" "}
                {viljelija.yhteys_email}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "lisaa" && (
        <div className="form-container">
          <h2>Lisää uusi viljelijä</h2>

          <form onSubmit={lisaaViljelija}>
            <label>Viljelijän numero</label>

            <input
              type="number"
              value={uusiViljelija.viljelijannro}
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  viljelijannro:
                    e.target.value,
                })
              }
            />

            <label>Y-tunnus</label>

            <input
              type="text"
              value={uusiViljelija.ytunnus}
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  ytunnus: e.target.value,
                })
              }
            />

            <label>Viljelijän nimi</label>

            <input
              type="text"
              value={uusiViljelija.nimi}
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  nimi: e.target.value,
                })
              }
            />

            <label>Osoite</label>

            <input
              type="text"
              value={uusiViljelija.osoite}
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  osoite: e.target.value,
                })
              }
            />

            <label>Yhteyshenkilön sukunimi</label>

            <input
              type="text"
              value={
                uusiViljelija.yhteys_sukunimi
              }
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  yhteys_sukunimi:
                    e.target.value,
                })
              }
            />

            <label>Yhteyshenkilön etunimi</label>

            <input
              type="text"
              value={
                uusiViljelija.yhteys_etunimi
              }
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  yhteys_etunimi:
                    e.target.value,
                })
              }
            />

            <label>Yhteyshenkilön puhelin</label>

            <input
              type="text"
              value={
                uusiViljelija.yhteys_puhelin
              }
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  yhteys_puhelin:
                    e.target.value,
                })
              }
            />

            <label>Yhteyshenkilön sähköposti</label>

            <input
              type="email"
              value={
                uusiViljelija.yhteys_email
              }
              onChange={(e) =>
                setUusiViljelija({
                  ...uusiViljelija,
                  yhteys_email:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Lisää viljelijä
            </button>
          </form>
        </div>
      )}

      {activeTab === "paivita" && (
        <div className="form-container">
          <h2>Päivitä viljelijä</h2>

          {!muokattava ? (
            <div>
              <p>
                Valitse ensin viljelijä taulukosta.
              </p>

              <button
                onClick={() => setActiveTab("kaikki")}
              >
                Valitse viljelijä
              </button>
            </div>
          ) : (
            <form onSubmit={paivitaViljelija}>
              <label>Viljelijän numero</label>

              <input
                type="number"
                value={muokattava.viljelijannro}
                disabled
              />

              <label>Y-tunnus</label>

              <input
                type="text"
                value={muokattava.ytunnus}
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    ytunnus: e.target.value,
                  })
                }
              />

              <label>Viljelijän nimi</label>

              <input
                type="text"
                value={muokattava.nimi}
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    nimi: e.target.value,
                  })
                }
              />

              <label>Osoite</label>

              <input
                type="text"
                value={muokattava.osoite}
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    osoite: e.target.value,
                  })
                }
              />

              <label>Yhteyshenkilön sukunimi</label>

              <input
                type="text"
                value={
                  muokattava.yhteys_sukunimi
                }
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    yhteys_sukunimi:
                      e.target.value,
                  })
                }
              />

              <label>Yhteyshenkilön etunimi</label>

              <input
                type="text"
                value={
                  muokattava.yhteys_etunimi
                }
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    yhteys_etunimi:
                      e.target.value,
                  })
                }
              />

              <label>Yhteyshenkilön puhelin</label>

              <input
                type="text"
                value={
                  muokattava.yhteys_puhelin
                }
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    yhteys_puhelin:
                      e.target.value,
                  })
                }
              />

              <label>Yhteyshenkilön sähköposti</label>

              <input
                type="email"
                value={
                  muokattava.yhteys_email
                }
                onChange={(e) =>
                  setMuokattava({
                    ...muokattava,
                    yhteys_email:
                      e.target.value,
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

export default Viljelija;
