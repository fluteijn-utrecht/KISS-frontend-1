import { fetchLoggedIn } from "@/services";
import type { Zaak } from "@/stores/contactmoment";

export function useZaaksysteemService() {
  if (!window.gatewayBaseUri) {
    console.error("gatewayBaseUri missing");
  }

  const zaaksysteemBaseUri = `${window.gatewayBaseUri}/api/zaken`;

  const findByZaak = (zaaknummer: number) => {
    const url = `${zaaksysteemBaseUri}?identificatie=${zaaknummer}&extend[]=all`;

    return fetchLoggedIn(url)
      .then((r) => {
        if (!r.ok) {
          throw new Error();
        }
        return r.json();
      })

      .then((json) => {
        if (!Array.isArray(json.results)) {
          throw new Error(
            "Invalide json, verwacht een lijst: " + JSON.stringify(json.results)
          );
        }
        return json.results.map(
          (x: {
            id: string;
            identificatie: string;
            startdatum: string;
            url: string;
            embedded: {
              zaaktype: { omschrijving: string };
              status: { statustoelichting: string };
            };
          }) => {
            return {
              identificatie: x.identificatie,
              id: x.id,
              startdatum: x.startdatum,
              url: x.url,
              zaaktype: x.embedded.zaaktype.omschrijving,
              registratiedatum: x.startdatum,
              status: x.embedded.status.statustoelichting,
            } as Zaak;
          }
        );
      });
  };

  const findByBsn = (bsn: number) => {
    const url = `${zaaksysteemBaseUri}?rollen__betrokkeneIdentificatie__inpBsn=${bsn}&extend[]=all`;

    return fetchLoggedIn(url)
      .then((r) => {
        if (!r.ok) {
          throw new Error();
        }
        return r.json();
      })

      .then((json) => {
        if (!Array.isArray(json.results)) {
          throw new Error(
            "Invalide json, verwacht een lijst: " + JSON.stringify(json.results)
          );
        }

        return json.results.map(
          (x: {
            id: string;
            identificatie: string;
            startdatum: string;
            url: string;
            embedded: {
              zaaktype: { omschrijving: string };
              status: { statustoelichting: string };
            };
          }) => {
            return {
              identificatie: x.identificatie,
              id: x.id,
              startdatum: x.startdatum,
              url: x.url,
              zaaktype: x.embedded.zaaktype.omschrijving,
              registratiedatum: x.startdatum,
              status: x.embedded.status.statustoelichting,
            } as Zaak;
          }
        );
      });
  };

  //   {
  //     "contactmoment": "http://kissdevelopment-dimpact.commonground.nu/api/contactmomenten/10ec6633-aa70-4d52-9e54-f7cf4c70b680",
  //     "object": "http://kissdevelopment-dimpact.commonground.nu/api/zaken/4cad808a-6011-4d07-b0c6-cd5c98a3dfae",
  //     "objectType": "zaak"
  // }
  return {
    findByZaak,
    findByBsn,
  };
}
