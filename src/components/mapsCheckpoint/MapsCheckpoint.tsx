import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Checkpoint } from "../../data/checkPointData";
import { checkpointList } from "../../data/checkPointData";

// Icon marker aktif dan nonaktif
const createMarkerIcon = (active: boolean) => {
  return L.divIcon({
    className: "checkpoint-marker-wrapper",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        border-radius: 50%;
        background: ${active ? "#16A34A" : "#9CA3AF"};
        color: white;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      ">
        ●
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

interface CheckpointMapProps {
  checkpoints?: Checkpoint[];
}

interface MapControllerProps {
  selectedCheckpoint: Checkpoint | null;
}

function MapController({ selectedCheckpoint }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!selectedCheckpoint) return;

    map.flyTo(
      [
        Number(selectedCheckpoint.latitude),
        Number(selectedCheckpoint.longitude),
      ],
      18, // Batasi zoom ke level 18 terlebih dahulu
      {
        animate: true,
        duration: 0.8,
      },
    );
  }, [map, selectedCheckpoint]);

  return null;
}

// Menutup popup saat pengguna memilih lokasi baru
function MapInteraction() {
  useMapEvents({
    click() {
      // Bisa ditambahkan logika tambahan jika diperlukan
    },
  });

  return null;
}

export default function MapsCheckpoint({
  checkpoints = checkpointList,
}: CheckpointMapProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<Checkpoint | null>(null);

  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredCheckpoints = checkpoints.filter((item) => {
    if (filterStatus === "all") return true;

    return item.status === filterStatus;
  });

  // Titik awal peta
  //   const center: [number, number] = [-6.2095, 106.8456];

  // Membatasi pergerakan peta di sekitar area operasional
  //   const mapBounds: L.LatLngBoundsExpression = [
  //     [-6.213, 106.84],
  //     [-6.205, 106.851],
  //   ];

  //   const center: [number, number] = [-8.422056, 116.709629];
  const center: [number, number] = [-8.421514, 116.707336];
  const mapBounds: L.LatLngBoundsExpression = [
    [-8.432, 116.699],
    [-8.412, 116.72],
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px] mt-4">
      {/* MAP */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Peta Patroli
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Lokasi pemeriksaan area operasional
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {filteredCheckpoints.length} Lokasi
          </span>
        </div>

        <div className="relative h-[450px] w-full">
          <MapContainer
            center={[-8.421514, 116.707336]}
            zoom={18}
            minZoom={16}
            maxZoom={20}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={20}
            />

            <MapController selectedCheckpoint={selectedCheckpoint} />

            {filteredCheckpoints.map((item) => (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={createMarkerIcon(item.status === "active")}
                eventHandlers={{
                  click: () => setSelectedCheckpoint(item),
                }}
              >
                <Popup>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-gray-200 px-4 py-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-600" />
            Checkpoint aktif
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gray-400" />
            Checkpoint nonaktif
          </div>
        </div>
      </div>

      {/* CHECKPOINT LIST */}
      <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800">Daftar Area</h3>

          <p className="mt-1 text-sm text-gray-500">
            Pilih lokasi untuk melihat posisinya.
          </p>

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                event.target.value as "all" | "active" | "inactive",
              )
            }
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="max-h-[450px] overflow-y-auto p-2">
          {filteredCheckpoints.length > 0 ? (
            filteredCheckpoints.map((item) => {
              const isSelected = selectedCheckpoint?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCheckpoint(item)}
                  className={`mb-1 flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                    isSelected
                      ? "border border-blue-200 bg-blue-50"
                      : "border border-transparent hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                      item.status === "active" ? "bg-green-600" : "bg-gray-400"
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-gray-500">
                      {item.code}
                    </span>

                    <span className="mt-1 block text-sm font-semibold text-gray-800">
                      {item.name}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                Tidak ada checkpoint
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Tidak ditemukan lokasi dengan status tersebut.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
