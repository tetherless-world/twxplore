export interface MapFilterState {
  transmissionPower: {
    min: number | null;
    max: number | null;
  };

  timestamp: {
    min: number | null;
    max: number | null;
  };
}
