export type SegmentPace = {
  name: string;
  paceInterval: string;
};

export const zonesFallback: SegmentPace[] = [
  {
    name: "Ritmo de recuperação",
    paceInterval: "00:00",
  },
  {
    name: "Ritmo fácil",
    paceInterval: "00:00",
  },
  {
    name: "Ritmo de maratona",
    paceInterval: "00:00",
  },
  {
    name: "Ritmo de limiar",
    paceInterval: "00:00",
  },
  {
    name: "Ritmo de intervalo",
    paceInterval: "00:00",
  },
  {
    name: "Ritmo de repetição",
    paceInterval: "00:00",
  },
];
