import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapView = ({ listings = [], onMarkerClick }) => {
  return (
    <MapContainer
      center={[34.0522, -118.2437]} // Default to Los Angeles
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg mt-8 z-0"
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Render pins only if lat/lon are valid */}
      {listings.map((listing) =>
        listing.lat !== null &&
        listing.lat !== undefined &&
        listing.lon !== null &&
        listing.lon !== undefined ? (
          <Marker key={listing.id} position={[listing.lat, listing.lon]}>
            <Popup>
              <div className="text-sm">
                <button
                  onClick={() => onMarkerClick?.(listing.id)}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  {listing.title}
                </button>
                <div className="text-gray-600 mt-1">{listing.address}</div>
                <div className="text-gray-700">
                  {listing.bedrooms} beds · {listing.bathrooms} baths ·{" "}
                  {listing.sqft} sqft
                </div>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapView;
