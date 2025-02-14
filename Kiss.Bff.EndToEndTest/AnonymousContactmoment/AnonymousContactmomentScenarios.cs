﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kiss.Bff.EndToEndTest.AnonymousContactmoment.Helpers;
using Kiss.Bff.EndToEndTest.AnonymousContactmomentBronnen.Helpers;

namespace Kiss.Bff.EndToEndTest.AnonymousContactmomentBronnen
{
    [TestClass]
    public class AnonymousContactmomentScenarios : KissPlaywrightTest
    {
        [TestMethod("1. Search for Bronnen in Contactmoment")]
        public async Task SearchForBronnenInContactmoment()
        {
            await Step("Given the user is on the Startpagina");

            await Page.GotoAsync("/");

            await Step("When the user starts a new Contactmoment");

            await Page.CreateNewContactmomentAsync();

            await Step("And enters 'boom' in the search field in the Search pane");

            await Page.GetContactmomentSearch().FillAsync("boom");

            await Step("And presses Enter");

            await Page.GetContactmomentSearch().PressAsync("Enter");

            await Step("Then 10 items should appear in the Search pane");            
           
            await Expect(Page.GetContactmomentSearchResults()).ToHaveCountAsync(10);

            await Step("And each item has a label VAC or Kennisbank or Website in the first column");
           
            await Task.WhenAll((await Page.GetContactmomentSearchResults().AllAsync()).Select(async item =>
            {
                var firstColumn = item.Locator("span:nth-of-type(1)");
                await Expect(firstColumn.Filter(new() { HasText = "VAC" })
                    .Or(firstColumn.Filter(new() { HasText = "Kennisbank" }))
                    .Or(firstColumn.Filter(new() { HasText = "Website" }))).ToBeVisibleAsync();
            }));
        }

        [TestMethod("2. Search for Smoelenboek in Contactmoment")]
        public async Task SearchForSmoelenboekInContactmoment()
        {
            await Step("Given the user is on the Startpagina");

            await Page.GotoAsync("/");

            await Step("When the user starts a new Contactmoment");

            await Page.CreateNewContactmomentAsync();

            await Step("And checks the box Smoelenboek");

            await Page.GetSmoelenboekCheckbox().CheckAsync();

            await Step("And enters 'boom' in the search field in the Search pane");

            await Page.GetContactmomentSearch().FillAsync("boom");

            await Step("And presses Enter");

            await Page.GetContactmomentSearch().PressAsync("Enter");

            await Step("Then 10 items should appear");
 
            await Expect(Page.GetContactmomentSearchResults()).ToHaveCountAsync(10);

            await Step("And each item has a label Smoelenboek in the first column");

            await Task.WhenAll((await Page.GetContactmomentSearchResults().AllAsync()).Select(async item =>
            { 
            await Expect(item.Locator("span:nth-of-type(1)").Filter(new() { HasText = "Smoelenboek" })).ToBeVisibleAsync();
            }));
            
        }

        [TestMethod("3. Search for VAC in Contactmoment")]
        public async Task SearchForVACInContactmoment()
        {
            await Step("Given the user is on the Startpagina");

            await Page.GotoAsync("/");

            await Step("When the user starts a new Contactmoment");

            await Page.CreateNewContactmomentAsync();

            await Step("And checks the box VAC in the Search pane");

            await Page.GetVACCheckbox().CheckAsync();

            await Step("And enters 'boom' in the search field in the Search pane");

            await Page.GetContactmomentSearch().FillAsync("boom");

            await Step("And presses Enter");

            await Page.GetContactmomentSearch().PressAsync("Enter");

            await Step("Then 10 items should appear");

            await Expect(Page.GetContactmomentSearchResults()).ToHaveCountAsync(10);

            await Step("And each item has a label VAC in the first column");

            await Task.WhenAll((await Page.GetContactmomentSearchResults().AllAsync()).Select(async item =>
            {
                await Expect(item.Locator("span:nth-of-type(1)").Filter(new() { HasText = "VAC" })).ToBeVisibleAsync();
            }));
        }

        [TestMethod("4. Search for Kennisbank in Contactmoment")]
        public async Task SearchForKennisbankInContactmoment()
        {
            await Step("Given the user is on the Startpagina");

            await Page.GotoAsync("/");

            await Step("When the user starts a new Contactmoment");

            await Page.CreateNewContactmomentAsync();

            await Step("And checks the box Kennisbank in the Search pane");

            await Page.GetKennisbankCheckbox().CheckAsync();

            await Step("And enters 'boom' in the search field in the Search pane");

            await Page.GetContactmomentSearch().FillAsync("boom");

            await Step("And presses Enter");

            await Page.GetContactmomentSearch().PressAsync("Enter");

            await Step("Then 10 items should appear");
             
            await Expect(Page.GetContactmomentSearchResults()).ToHaveCountAsync(10);

            await Step("And each item has a label Kennisbank in the first column");

            await Task.WhenAll((await Page.GetContactmomentSearchResults().AllAsync()).Select(async item =>
            {
                await Expect(item.Locator("span:nth-of-type(1)").Filter(new() { HasText = "Kennisbank" })).ToBeVisibleAsync();
            }));
        }

      
       }
  }
