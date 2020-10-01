// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url_pw_backend: 'http://193.124.114.46:3001',
  project_id: 'pw',
  env: 'local',
  app_title: 'Parrot Wings Local',
  max_resend: 5,
  getDefault(): string {
    return this.url_pw_backend;
  },
  getPrefix(): string {
    return this.project_id + '_' + this.env;
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
