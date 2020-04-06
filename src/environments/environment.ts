// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  newsUrlFirst: "https://newsapi.org/v2/everything?q=",
  newsUrlSecond: "&apiKey=fde3d2128ece4766aa368aeeb4b66b76",
  jhuGitUrl: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/",
  jhuGitCases: "time_series_covid19_confirmed_global.csv",
  jhuGitDeaths: "time_series_covid19_deaths_global.csv",
  jhuGitRecovered: "time_series_covid19_recovered_global.csv"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
