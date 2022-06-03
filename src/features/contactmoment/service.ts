import type { Contactmoment } from "./types";

export function useContactmomentService(): {
  save: (data: Contactmoment) => Promise<void>;
} {
  // fetch("http://localhost/api/contactmomenten")
  //   .then((r) => {
  //     if (!r.ok) console.log(r);
  //     return r.json();
  //   })
  //   .then((json) => {
  //     console.log(json);
  //   });

  if (!window.contactmomentenBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  const url = window.contactmomentenBaseUri;

  const save = (data: Contactmoment) => {
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
    });
  };
  return {
    save,
  };
}