import { APIResponse } from 'src/app/core/models';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandlerService {
  
  constructor(
    private http: HttpClient,
    private translateServ: TranslateService
  ) { }

  // API 錯誤處理
  public HttpErrorHandle(err: HttpErrorResponse) {
    if ( err.error.message !== undefined || err.error.data !== undefined ) {
      const message = JSON.stringify(err.error.message);
      const data = JSON.stringify(err.error.data);
      alert(`Code: ${err.status}, Message: ${message}, Data: ${data}`);
    } else {
      alert(this.translateServ.instant('ALERT.UNKNOWN_ERROR'));
    }
  }

}
