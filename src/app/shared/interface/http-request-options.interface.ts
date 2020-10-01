import {HttpHeaders, HttpParams} from '@angular/common/http';

export interface HttpRequestOptionsInterface {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
};
  observe?: 'body' | 'response';
  params?: HttpParams | {
    [param: string]: string | string[];
};
  reportProgress?: boolean;
  responseType: 'json' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}
