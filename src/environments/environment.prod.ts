export const environment = {
  production: true,
  url_backend: 'http://193.124.114.46:3001',
  project_id: 'pw',
  env: 'prod',
  max_resend: 5,
  app_title: 'Parrot Wings',
  getDefault(): string {
    return this.url_pw_backend;
  },
  getPrefix(): string {
    return this.project_id + '_' + this.env;
  }
};
