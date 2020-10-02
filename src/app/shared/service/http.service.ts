import {environment} from '../../../environments/environment';
import {EventEmitter, Injectable} from '@angular/core';
import {BaseErrorHandler} from '../error/base.error-handler';
import {DefaultErrorHandler} from '../error/default.error-handler';
import {StorageService} from './storage.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {HttpHeaderEnum} from '../enum/http-header.enum';
import {Observable} from 'rxjs';
import {ResponseInterfaces} from '../interface/response.interface';
import {HttpRequestOptionsInterface} from '../interface/http-request-options.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  private httpOptions: HttpRequestOptionsInterface | undefined;
 // private loadingType: LoadingEnum = LoadingEnum.FULL;
  private contentType = 'application/json';
  private responseType: 'json' | 'blob' = 'json';
  private appKey = null;
  private baseUrl: string = environment.url_pw_backend;
  private ignore: string;
  private auth = true;
  private withCredentials = false;
  private errorHandler: BaseErrorHandler = new DefaultErrorHandler();

  public emitLogAccess: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) {

  }

  logAccess(message: string): void {
    // console.log('logAccess() EMIT message: ' + message);
    this.emitLogAccess.emit(message);
  }

  createUrl(url: string): string {
    if (url != null && url.length > 0) {
      if (url.charAt(0) !== '/') {
        url = '/' + url;
      }
    }
    return this.baseUrl + url;
  }

  private reset(): void {
    this.contentType = 'application/json';
    this.responseType = 'json';
    this.ignore = '';
    this.baseUrl = environment.url_pw_backend;
    this.auth = true;
    this.appKey = null;
    this.httpOptions = undefined;
  }

  setResponseType(type: 'blob' | 'json'): this {
    this.responseType = type;
    return this;
  }

  content(type: string): HttpService {
    this.contentType = type;
    return this;
  }

  handler(handler: BaseErrorHandler): this {
    this.errorHandler = handler;
    return this;
  }

  options(options: any): HttpService {
    this.httpOptions = options;
    return this;
  }

  server(server: string): HttpService {
    this.baseUrl = server;
    this.withCredentials = false;
    return this;
  }

  setWithCredentials(withCredentials: boolean): HttpService {
    this.withCredentials = withCredentials;
    return this;
  }

  get<T>(shortUrl: string, response: ResponseInterfaces<T>): Observable<any> | Promise<any> {
    console.log('GET shortUrl: ' + shortUrl);
    const options = this.createOptions(undefined, this.createUrl(shortUrl));

    const url: string = this.createUrl(shortUrl);

    // this.logAccess('HTTP GET url: ' + url);
    // console.log('options: ', options);
    return this.request('GET', url, this.createOptions(undefined, this.createUrl(shortUrl)), response);
  }

  delete(shortUrl: string, response: ResponseInterfaces<any>): Observable<any> | Promise<any> {
    this.contentType = 'text/plain;charset=UTF-8';

    return this.request('DELETE', this.createUrl(shortUrl), this.createOptions(undefined, this.createUrl(shortUrl)), response);
  }

  request<T>(
    method: string, url: string, options: HttpRequestOptionsInterface, response: ResponseInterfaces<T>, iterator: number = 0, sync?: boolean
  ): Observable<any> | Promise<any> {
    // const loadingType = this.loadingType;
    // options.withCredentials = false;
    if (method !== 'DELETE') {
      this.reset();
    }
    if (sync) {
      return this.http.request(method, url, options).toPromise();
    }

    const self = this;

    const observable: Observable<any> = this.http.request(method, url, options);
    observable.subscribe(
      (next) => {
        if (next instanceof HttpResponse) {
          response.success(next.body, next);
          return;
        }
        response.success(next, null);
      },
      (err: HttpErrorResponse) => {
        if (err.status === 502 && iterator <= 10) {
          setTimeout( () => {
            self.request(method, url, options, response, ++iterator, sync);
          }, 500);
          return;
        }
        if (response && typeof response.failed === 'function') {
          response.failed(err);
        }
      },
      () => {}
    );
    return observable;
  }

  post<T>(shortUrl: string, obj: object, response: ResponseInterfaces<T>, sync?: boolean): Observable<any> | Promise<any> {
    return this.request('POST', this.createUrl(shortUrl), this.createOptions(obj, this.createUrl(shortUrl)), response, 0, sync);
  }

  put<T>(shortUrl: string, obj: object, response: ResponseInterfaces<T>, sync?: boolean): Observable<any> | Promise<any> {
    return this.request('PUT', this.createUrl(shortUrl), this.createOptions(obj, this.createUrl(shortUrl)), response, 0, sync);
  }

  patch<T>(shortUrl: string, obj: object, response: ResponseInterfaces<T>, sync?: boolean): Observable<any> | Promise<any> {
    return this.request('PATCH', this.createUrl(shortUrl), this.createOptions(obj, this.createUrl(shortUrl)), response, 0, sync);
  }

  private createOptions(body?: any, url: string = ''): HttpRequestOptionsInterface {

    if (typeof this.withCredentials !== 'boolean') {
      this.withCredentials = false;
    }


    if (this.httpOptions) {
      this.httpOptions.withCredentials = this.withCredentials;
      return this.httpOptions;
    }

    let header = new HttpHeaders();
    if (this.contentType) {
      header = header.append(HttpHeaderEnum.CONTENT_TYPE, this.contentType);
    }

    const date = new Date();

    // don't use cache-requests
    header = header.append(HttpHeaderEnum.EXPIRES, 'Wed 11 Jan 1984 05:00:00 GMT');
    header = header.append(HttpHeaderEnum.EXPIRES, 'Wed 11 Jan 1984 05:00:00 GMT'); // need to safari
    header = header.append(HttpHeaderEnum.LAST_MODIFIED, date.toISOString()); // need to safari
    header = header.append(HttpHeaderEnum.CACHE_CONTROL, 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0", false');
    header = header.append(HttpHeaderEnum.PRAGMA, 'no-cache');

    if (this.storage.getAuthKey() && this.auth) {
      header = header.append(HttpHeaderEnum.AUTHENTICATION, 'Bearer ' + this.storage.getAuthKey());
    }
    const opt: HttpRequestOptionsInterface = {
      body: body as any,
      headers: header,
      observe: 'response',
      withCredentials: this.withCredentials,
      responseType: this.responseType
    };

    return opt;

  }

}
