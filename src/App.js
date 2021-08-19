import React, { useState, useEffect } from "react";

import MeiliSearch from "meilisearch";

const client = new MeiliSearch({
  host: "http://meilisearch.eastus.cloudapp.azure.com/",
  apiKey: "a02530699d9b365c25be9e342aafba81ae2037b1555fad732018fb15a45bb30a",
});

const index = client.getIndex("DB_Cochez");

function App() {
  const [searchedWord, setSearch] = useState("");
  const [resultSearch, setResults] = useState([]);
  const [resultCards, setCards] = useState([]);

  useEffect(() => {
    // Create an scoped async function in the hook
    async function searchWithMeili() {
      const search = await index.search(searchedWord, {
        limit: 24,
        attributesToHighlight: ["ProductName"],
      });
      setResults(search.hits);
    }
    // Execute the created function directly
    searchWithMeili();
  }, [searchedWord]);

  useEffect(() => {
    let arrayItems = [];
    resultSearch.forEach((product) => {
      arrayItems.push(
        <div class="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-3">
          <div class="flex-1 rounded overflow-hidden shadow-lg">
            <img
              class="w-full h-48 object-cover"
              src={
                product["Images"]
                  ? product["Images"][0]?.["URL"]
                  : "https://semantic-ui.com/images/wireframe/image.png"
              }
              alt={product["ProductName"]}
            />
            <div class="px-6 py-3">
              <div class="font-bold text-sm mb-1 text-gray-600 capitalize">
                {product["Category"]}
              </div>
              <div class="font-bold text-xl mb-2 text-gray-800">
                {product["ProductName"]}
              </div>
              <p class="text-black text-xl font-bold text-base py-2">
                $ {product["Price"]?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    });
    setCards(arrayItems);
  }, [resultSearch]);

  return (
    <div className="mx-auto">
      <div class="header font-sans text-white items-center justify-center">
        <header class="py-12">
          <img
            class="h-20 w-auto items-center justify-center p-2 mx-auto"
            src="theme.zdassets.com/theme_assets/2153973/e3d2fc89c603e75bab57e7cf5510e1e07c88aea4.png"
            style={{ filter: "invert(0%)" }}
            alt=""
          />
          <h1 class="flex flex-wrap flex-grow text-3xl w-full justify-center p-4">
            Busqueda instantanea de productos
          </h1>
          <div class="border rounded overflow-hidden w-full flex justify-center mx-auto searchBox mt-6">
            <button class="flex items-center justify-center px-4 shadow-md bg-white text-black">
              <svg
                class="h-4 w-4 text-grey-dark"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
            </button>
            <input
              type="text"
              value={searchedWord}
              onChange={(event) => setSearch(event.target.value)}
              class="px-6 py-4 w-full text-black"
              placeholder="Product, category, brand..."
            />
          </div>
        </header>
      </div>

      <div>
        <div class="flex flex-wrap searchResults">{resultCards}</div>
      </div>
    </div>
  );
}

export default App;
