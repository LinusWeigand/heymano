import React, { Suspense } from "react";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { Plus, Minus, Navigation } from "lucide-react";
import { useProfiles } from "@/context/ProfilesContext";
import Modal from "../modal";
import Details from "../details";
import { ProfileModel } from "@/types/ProfileModel";

function AirbnbMap({
  apiKey,
  initialCenter = { lat: 48.12716675545072, lng: 11.574901781491835 },
  initialZoom = 11,
  onMarkerClick,
}: {
  apiKey: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMarkerClick?: (profileId: string) => void;
}) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const [center, setCenter] = React.useState(initialCenter);
  // Keep zoom in React state as well (if you want to preserve zoom level)
  const [zoom, setZoom] = React.useState(initialZoom);

  // Get profiles from context
  const { profiles, isLoading } = useProfiles();


  if (!isLoaded || isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
      </div>
    );
  }

  const containerStyle = { width: "100%", height: "100%" };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onDragEnd={() => {
        if (map) {
          const newCenter = map.getCenter();
          if (newCenter) {
            setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
          }
        }
      }}
      onIdle={() => {
        if (map) {
          setZoom(map.getZoom() ?? initialZoom);
        }
      }}
      options={{
        mapId: "298cbf7b9c015966",
        disableDefaultUI: true,
        clickableIcons: false,
      }}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {profiles.map((profile) => {
        const { id, lat, lng, craft } = profile;
        if (!lat || !lng) return null;
        return (
          <OverlayView
            key={id}
            position={{ lat, lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              onClick={() => onMarkerClick && onMarkerClick(id)}
              className="relative flex items-center justify-center bg-white rounded-full px-12 py-1 shadow-md min-w-[60px] h-[30px] font-semibold text-sm hover:z-10 hover:scale-105 transition-transform cursor-pointer"
            >
              {craft}
            </div>
          </OverlayView>
        );
      })}

      {/* Custom map controls */}
      <div className="absolute top-12 right-6 flex flex-col gap-2">
        <button
          onClick={() => {
            if (map) {
              map.setZoom((map.getZoom() ?? 0) + 1);
            }
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => {
            if (map) {
              map.setZoom((map.getZoom() ?? 0) - 1);
            }
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  if (map) {
                    map.panTo({ lat: latitude, lng: longitude });
                    map.setZoom(12);
                  }
                },
                (error) => {
                  console.error("Error fetching location:", error);
                }
              );
            } else {
              console.error("Geolocation is not supported by this browser.");
            }
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Navigate"
        >
          <Navigation className="-ml-[1px] w-5 h-5 text-gray-700" />
        </button>
      </div>
    </GoogleMap>
  );
}

function MapLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-medium"></div>
    </div>
  );
}

export default function MapBody() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const [selectedProfileId, setSelectedProfileId] = React.useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false)
  const { profiles } = useProfiles();

  if (!apiKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Irgendwas ist schiefgelaufen</h1>
          <p className="mb-4">Bitte versuche es später noch einmal.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<MapLoading />}>
        <div className="w-full h-screen">
          <AirbnbMap
            apiKey={apiKey}
            onMarkerClick={(profileId: string) => {
              setSelectedProfileId(profileId)
              setIsDetailsModalOpen(true)
            }}
          />
        </div>
      </Suspense>
      {isDetailsModalOpen && selectedProfileId && (
        <div className="fixed inset-0 z-[5000]">
          <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
            <Details
              {...profiles.find((p: ProfileModel) => p.id === selectedProfileId)!}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          </Modal>
        </div>
      )}
    </main>
  );
}
