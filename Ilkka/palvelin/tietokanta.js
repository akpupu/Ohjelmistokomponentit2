import { createConnection } from "mysql2/promise";

export default class Tietokanta {
  #yhteystiedot;

  constructor(yhteystiedot) {
    this.#yhteystiedot = Object.freeze(yhteystiedot);
  }

  get yhteys() {
    try {
      return createConnection(this.#yhteystiedot);
    } catch (virhe) {
      return null;
    }
  }

  async suljeyhteys(yhteys) {
    try {
      if (yhteys) {
        await yhteys.end();
      }

      return true;
    } catch (virhe) {
      return false;
    }
  }

  suoritaKysely(sql, parametrit, yhteys) {
    return new Promise(async (resolve, reject) => {
      let uusiYhteys = false;

      try {
        if (!yhteys) {
          yhteys = await this.yhteys;

          if (yhteys) {
            uusiYhteys = true;
          } else {
            return reject({
              viesti: "Yhteys ei onnistunut",
            });
          }
        }

        const [kyselynTulos] = await yhteys.query(
          sql,
          parametrit
        );

        if (typeof kyselynTulos.affectedRows === "undefined") {
          resolve({
            kyselynTulos,
            tulosjoukko: true,
          });
        } else {
          resolve({
            kyselynTulos: {
              muutetutRivitLkm: Number(
                kyselynTulos.affectedRows
              ),
              lisattyNro: Number(
                kyselynTulos.insertId
              ),
              status: Number(
                kyselynTulos.warningStatus || 0
              ),
            },
            tulosjoukko: false,
          });
        }
      } catch (virhe) {
        reject({
          viesti: `SQL-virhe: ${virhe.message}`,
        });
      } finally {
        if (yhteys && uusiYhteys) {
          await yhteys.end();
        }
      }
    });
  }
}
