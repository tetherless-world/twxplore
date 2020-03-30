/*
Each attribute of a Feature with type 'number' should have these
properties on filterStateOfType
*/
export interface filterStateTypes {
  min: number | null;
  max: number | null;
  idx: number | null;
}
