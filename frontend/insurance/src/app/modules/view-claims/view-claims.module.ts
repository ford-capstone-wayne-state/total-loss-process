import { NgModule } from '@angular/core';
import { ViewClaimsComponent } from './view-claims.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';

@NgModule({
  declarations: [
    ViewClaimsComponent
  ],
  providers: [
    AuthService,
    MiddlewareService
  ]
})
export class ViewClaimsModule { }
