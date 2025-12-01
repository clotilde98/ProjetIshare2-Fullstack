import axios from "axios";

async function validateBelgianAddress({ street_number, street, city, postal_code }) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${street_number} ${street}, ${postal_code} ${city}, Belgium`,
        format: "json",
        addressdetails: 1,
        limit: 1,
        countrycodes: "be"
      },
      headers: {
        "User-Agent": "validateAddress/1.0 (yourapp@example.com)"
      }
    });

    const data = response.data;

    if (!data || data.length === 0) {
      return { isValid: false, reason: "Adresse introuvable en Belgique" };
    }

    const result = data[0];
    const addr = result.address;

    const isReliable =
      addr.country_code === "be" &&
      addr.postcode === postal_code &&
      (
        addr.city?.toLowerCase() === city.toLowerCase() ||
        addr.town?.toLowerCase() === city.toLowerCase() ||
        addr.village?.toLowerCase() === city.toLowerCase()
      );

    return {
      isValid: isReliable,
      normalized: {
        streetName: addr.road,
        houseNumber: street_number,
        postalCode: addr.postcode,
        municipality: addr.city || addr.town || addr.village,
      },
      coordinates: { lat: result.lat, lon: result.lon }
    };
  } catch (error) {
    console.error("Erreur validateBelgianAddress:", error.message);
    return { isValid: false, reason: "Erreur technique" };
  }
}
