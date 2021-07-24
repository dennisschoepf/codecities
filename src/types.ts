export interface SubProject {
  name: string;
  path: string;
  size: number;
  contents: {
    contributors: any[];
    legacy: any[];
    packages: any[];
  };
}

export interface Coordinates {
  x: number;
  y: number;
}
