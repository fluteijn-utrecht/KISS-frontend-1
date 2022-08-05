import { createApp } from "vue";
import { defineCustomElements } from "@utrecht/web-component-library-stencil";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

declare global {
  interface Window {
    organisatieIds: string[];
    activeOrganisatieId: string;
    pubBeheerUrl: string;
    gatewayBaseUri: string;
  }
}

//nog onduidelijk hoe dit in de praktijk gaat weken, voorlopig uitgaan van 1 org
window.activeOrganisatieId =
  window.organisatieIds && window.organisatieIds[0]
    ? window.organisatieIds[0]
    : "";

// HACK VOOR RARE ORGANISATIE IDS
try {
  window.organisatieIds = window.organisatieIds.map((x) =>
    Number.parseFloat(x).toFixed(0)
  );
} catch (error) {
  console.error(error);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");

defineCustomElements();

// Register a global custom directive called `v-focus`
app.directive("focus", {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // Focus the element
    el.focus();
  },
});
