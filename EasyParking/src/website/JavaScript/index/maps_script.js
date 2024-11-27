document.addEventListener('DOMContentLoaded', async function() {
  // Sort parking lots

  const listItems = document.querySelectorAll('.lot'); 
  const itemsArray = Array.from(listItems);

  itemsArray.sort((a, b) => {
    const valueA = a.querySelector('.lot-number').textContent.trim();
    const valueB = b.querySelector('.lot-number').textContent.trim();

    if (valueA === '0'){
      return -1;
    } 
    else if (valueB === '0'){
      return 1;
    }
    else {
      return parseInt(valueA) - parseInt(valueB);
    }
  });

  const lotsList = document.querySelector('.lots-list');
  itemsArray.forEach(item => {
    lotsList.appendChild(item);
  });

  // Google Maps API

    // Fetch the API key from the Firebase Cloud Function
    const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/getGoogleMapsApiKey');
    const data = await response.json();
    const apiKey = data.key;

    // Initialize the Google Maps script with the fetched API key
    (g => {
        var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
        key: apiKey, // Use the API key fetched from the Cloud Function
        v: "weekly",
        // Add other bootstrap parameters as needed, using camel case.
    });

  let map;

  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PinElement } = await google.maps.importLibrary("marker");

    // Fine Arts Lot
    const fineArtsGlyph = document.createElement("img");

    fineArtsGlyph.src = "./images/7.svg";
    
    const fineArtsGlyphPin = new PinElement({
      glyph: fineArtsGlyph,
    });
    //  Chapel Way Lot
    const chapelGlyph = document.createElement("img");

    chapelGlyph.src = "./images/4.svg";

    const chapelGlyphPin = new PinElement({
      glyph: chapelGlyph,
    });
    // Plains Rd Lot
    const plainsRdGlyph = document.createElement("img");

    plainsRdGlyph.src = "./images/25.svg";

    const plainsRdGlyphPin = new PinElement({
      glyph: plainsRdGlyph,
    });
    // Keaney
    const keaneyGlyph = document.createElement("img");

    keaneyGlyph.src = "./images/26.svg";

    const keaneyGlyphPin = new PinElement({
      glyph: keaneyGlyph,
    });
    // Plains South
    const plainsSouthGlyph = document.createElement("img");

    plainsSouthGlyph.src = "./images/31.svg";

    const plainsSouthGlyphPin = new PinElement({
      glyph: plainsSouthGlyph,
    });

    map = new Map(document.getElementById("map"), {
      center: { lat: 41.486028, lng: -71.530732 },
      zoom: 15,
      mapId: "2b0fbf90c6f27f7f",
      mapTypeControl: false,
    });

    const geoJsonUrl = "https://us-central1-easyparking-d43a9.cloudfunctions.net/getGeoJSON";

    fetch(geoJsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(geoJsonData => {
        map.data.addGeoJson(geoJsonData);
      })
      .catch(error => {
        console.error("Error fetching GeoJSON:", error);
      });

    map.data.setStyle({
      fillColor: '#D0A627',
      strokeWeight: 1,
      fillOpacity: 0.6,
      strokeColor: '#C79316'
    });

    const markerFA = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.488450, lng: -71.522163},
      content: fineArtsGlyphPin.element,
      title: "Fine Arts Lot",
      gmpClickable: true,
    });

    const markerCW = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.485569, lng: -71.522679},
      content: chapelGlyphPin.element,
      title: "Chapel Way Lot",
      gmpClickable: true,
    });

    const markerPR = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.490583, lng: -71.538161},
      content: plainsRdGlyphPin.element,
      title: "Plains Road Lot",
      gmpClickable: true,
    });

    const markerKeaney = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.483658, lng: -71.536081},
      content: keaneyGlyphPin.element,
      title: "Keaney Lot",
      gmpClickable: true,
    });

    const markerPS = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.489134, lng: -71.540769},
      content: plainsSouthGlyphPin.element,
      title: "Plains Road South Lot",
      gmpClickable: true,
    });

    // Function to create the content for the InfoWindow
    function createInfoContent(url) {
      return `
        <div id="infoWindowContent">
          <a href="${url}" target="_blank">View in Google Maps</a>
        </div>
      `;
    }
    
    const infoWindow = new google.maps.InfoWindow();
    
    // Function to add a click listener to a marker
    function addMarkerListener(marker, title, url) {
      marker.addListener("click", () => {
        infoWindow.setContent(createInfoContent(url));
        infoWindow.open(map, marker);
    
        infoWindow.addListener('domready', () => {
          const iwContainer = document.querySelector('.gm-style-iw-ch');
          
          if (iwContainer) {
            // Remove any existing title elements before adding the new one
            const existingTitle = iwContainer.querySelector('h5');
            if (existingTitle) {
              existingTitle.remove();
            }
    
            // Add the new title element
            const titleElement = document.createElement('h5');
            titleElement.textContent = title;
            iwContainer.prepend(titleElement);
          }
        });
      });
    }

    // Add listeners for each marker
    addMarkerListener(markerFA, "Fine Arts Lot", 
      "https://www.google.com/maps/place/Fine+Arts+Lot/@41.4881906,-71.5222189,509m/data=!3m1!1e3!4m6!3m5!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerCW, "Chapel Way Lot", 
      "https://www.google.com/maps/place/Commuter+Lot/@41.4854366,-71.522822,202m/data=!3m1!1e3!4m14!1m7!3m6!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!2sFine+Arts+Lot!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh!3m5!1s0x89e5b9b36554528d:0x3573a515f97fe5c5!8m2!3d41.4855588!4d-71.5227038!16s%2Fg%2F11f3w9p99n?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerPR, "Plains Road Lot", 
      "https://www.google.com/maps/place/Ryan+Center+Lot,+Flagg+Rd,+Kingston,+RI+02881/@41.4897863,-71.5391906,453m/data=!3m1!1e3!4m14!1m7!3m6!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!2sFine+Arts+Lot!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh!3m5!1s0x89e5b84637afa7ed:0x52f0ea1ad50a2e68!8m2!3d41.4903061!4d-71.5386408!16s%2Fg%2F11b8tgqft4?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerKeaney, "Keaney Lot", 
      "https://maps.app.goo.gl/3VFtfNempiRtuQbw8");

    addMarkerListener(markerPS, "Plains Road South Lot", 
      "https://maps.app.goo.gl/7Q1nEMdNi9URwEwT7");
  }
  // Initialize the map when the page is first loaded
  initMap();
});

