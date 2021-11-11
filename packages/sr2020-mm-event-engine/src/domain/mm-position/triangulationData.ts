import { SRLatLng } from "../shared-kernel";

// EdgeId format `${locId1}_${locId2}` 
// where locIds are numbers.
export type EdgeId = string;

export interface TriangulationCentroid {
  locationId: number;
  centroidLatLng: SRLatLng;
}

export interface TriangulationData {
  neighborsIndex: Map<number, number[]>;
  centroids: TriangulationCentroid[];
  edgeSet: Set<EdgeId>;
}
