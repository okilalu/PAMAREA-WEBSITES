export interface Checkpoint {
  id: string;
  code: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive";
}

export const checkpointList: Checkpoint[] = [
  {
    id: "1",
    code: "CP-01",
    name: "Gedung Admin",
    description: "Lokasi gedung administrasi PLTU Lombok FTP 2",
    latitude: -8.421288,
    longitude: 116.707266,
    status: "active",
  },
  {
    id: "2",
    code: "CP-02",
    name: "Area Masjid",
    description: "Lokasi masjid di area PLTU Lombok FTP 2",
    latitude: -8.42173955072101,
    longitude: 116.70740554415322,
    status: "active",
  },
];
