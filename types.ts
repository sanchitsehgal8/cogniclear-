export interface BiasDetectorResponse {
  overallScore: number;
  summary: string;
  biases: DetectedBias[];
  metrics: {
    rationality: number;
    objectivity: number;
    completeness: number;
  };
  correction: string;
}

export interface DetectedBias {
  name: string;
  description: string;
  confidence: number;
  triggerPhrase: string;
}

export enum ScenarioContext {
  NONE = "None",
  HIGH_STAKES = "High Stakes",
  TIME_PRESSURE = "Time Pressure",
  PEER_PRESSURE = "Peer Pressure",
}

export const MOCK_INITIAL_DATA: BiasDetectorResponse = {
  overallScore: 0,
  summary: "Awaiting input...",
  biases: [],
  metrics: {
    rationality: 0,
    objectivity: 0,
    completeness: 0,
  },
  correction: "",
};
