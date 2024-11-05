import {
  ServiceResult,
  fetchLoggedIn,
  throwIfNotOk,
  parseJson,
  parsePagination,
  type PaginatedResult,
} from "@/services";
import {
  enrichBetrokkeneWithDigitaleAdressen,
  enrichBetrokkeneWithKlantContact,
  enrichInterneTakenWithActoren,
  fetchBetrokkenen,
  filterOutContactmomenten,
  KlantContactExpand,
  mapToContactverzoekViewModel,
  type ContactverzoekViewmodel,
} from "@/services/openklant2";
import { mapObjectToContactverzoekViewModel } from "@/services/openklant1";
import { ref, type Ref } from "vue";
import type { Contactverzoek } from "./types";

const klantinteractiesProxyRoot = "/api/klantinteracties";
const klantinteractiesApiRoot = "/api/v1";
const klantinteractiesBaseUrl = `${klantinteractiesProxyRoot}${klantinteractiesApiRoot}`;
const klantinteractiesBetrokkenen = `${klantinteractiesBaseUrl}/betrokkenen`;
const klantinteractiesDigitaleAdressen = `${klantinteractiesBaseUrl}/digitaleadressen`;

function searchRecursive(urlStr: string, page = 1): Promise<any[]> {
  const url = new URL(urlStr);
  url.searchParams.set("page", page.toString());

  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then(parseJson)
    .then(async (j) => {
      if (!Array.isArray(j?.results)) {
        throw new Error("Expected array: " + JSON.stringify(j));
      }

      if (!j.next) return j.results;
      const nextResults = await searchRecursive(urlStr, page + 1);
      return [...j.results, ...nextResults];
    });
}

export async function search(
  query: string,
  gebruikKlantInteractiesApi: boolean,
): Promise<PaginatedResult<Contactverzoek>[]> {
  if (gebruikKlantInteractiesApi) {
    const url = new URL(klantinteractiesDigitaleAdressen, location.origin);
    url.searchParams.set("adres", query);

    const searchResults = await searchRecursive(url.toString());
    const enrichedResults = await Promise.all(
      searchResults.map(async (result: any) => {
        const digitaalAdresUrl = ref(result.url);
        const contactverzoek = await getContactverzoekenByDigitaalAdresUrl(
          digitaalAdresUrl.value,
        );
        // Filter voor OK2: alleen resultaten met 'wasPartij' null of undefined
        return contactverzoek.page.filter(
          (item) =>
            item.record.data.betrokkene.wasPartij === null ||
            item.record.data.betrokkene.wasPartij === undefined,
        );
      }),
    );

    return [
      {
        page: enrichedResults.flat(),
        next: null,
        previous: null,
        count: enrichedResults.flat().length,
      },
    ];
  } else {
    const url = new URL("/api/internetaak/api/v2/objects", location.origin);
    url.searchParams.set("ordering", "-record__data__registratiedatum");
    url.searchParams.set("pageSize", "10");
    url.searchParams.set(
      "data_attrs",
      `betrokkene__digitaleAdressen__icontains__${query}`,
    );

    const searchResults = await searchRecursive(url.toString());

    const mappedResults = mapObjectToContactverzoekViewModel({
      next: null,
      previous: null,
      count: searchResults.length,
      results: searchResults,
    });

    // Filter voor OK1: alleen resultaten zonder 'klant'
    const filteredResults = mappedResults.page.filter(
      (item) => item.record.data.betrokkene.klant === undefined,
    );

    return [
      {
        page: filteredResults,
        next: mappedResults.next,
        previous: mappedResults.previous,
        count: filteredResults.length,
      },
    ];
  }
}

export async function getContactverzoekenByDigitaalAdresUrl(klantUrl: string) {
  return fetchBetrokkenen({ verstrektedigitaalAdres__url: klantUrl })
    .then((r) =>
      enrichBetrokkeneWithKlantContact(r, [
        KlantContactExpand.leiddeTotInterneTaken,
      ]),
    )
    .then(filterOutContactmomenten)
    .then(enrichBetrokkeneWithDigitaleAdressen)
    .then(enrichInterneTakenWithActoren)
    .then(mapToContactverzoekViewModel);
}

export function fetchContactverzoekenByKlantId(
  id: string,
  gebruikKlantInteractiesApi: boolean,
) {
  if (gebruikKlantInteractiesApi) {
    return fetchBetrokkenen({ wasPartij__url: id })
      .then((paginated) =>
        enrichBetrokkeneWithKlantContact(paginated, [
          KlantContactExpand.leiddeTotInterneTaken,
        ]),
      )
      .then(filterOutContactmomenten)
      .then(enrichBetrokkeneWithDigitaleAdressen)
      .then(enrichInterneTakenWithActoren)
      .then(mapToContactverzoekViewModel);
  }

  const url = new URL("/api/internetaak/api/v2/objects", location.origin);
  url.searchParams.set("ordering", "-record__data__registratiedatum");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("data_attrs", `betrokkene__klant__exact__${id}`);

  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then(parseJson)
    .then((r) => parsePagination(r, (v) => v as ContactverzoekViewmodel));
}
