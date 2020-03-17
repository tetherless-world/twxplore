export interface MapFilterState {
  frequency: {
    min: number | null;
    max: number | null;
  };

  timestamp: {
    min: number | null;
    max: number | null;
  };
}
