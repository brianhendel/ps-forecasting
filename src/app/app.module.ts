import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AngularMaterialModule } from '../app/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

import { MsalModule } from '@azure/msal-angular';
import { OAuthSettings } from '../oauth';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/admin.component';

import { GraphService } from './services/graph.service';
import { ReportComponent } from './report/report.component';

library.add(faExternalLinkAlt);
library.add(faUserCircle);

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AlertsComponent,
    CalendarComponent,
    AdminComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,     
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    MsalModule.forRoot({
      clientID: OAuthSettings.appId
    })
  ],
  providers: [GraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
