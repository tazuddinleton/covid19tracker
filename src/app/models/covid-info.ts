
export interface CovidInfo {
  updated: number;
  country: string;
  countryInfo: CountryInfo;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  id?: string;
}

export interface CountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

export interface HistoricalData{
  id?: string;
  country: string;
  province: string;
  stateName?: string;
  stateCode?: string;
  date: Date;
  cases: number;
  deaths: number;
  recovered: number;
}

export interface HistoryRaw{
  country: string;
  province: string[] | string;
  timeline: Timeline;
}

export interface Cases {
}

export interface Deaths {
}

export interface Recovered {
}

export interface Timeline {
  cases: Cases;
  deaths: Deaths;
  recovered: Recovered;
}

export interface UsStateResult {
  state: string;
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
}
