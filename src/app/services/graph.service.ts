import { Injectable } from '@angular/core';
import { Client, GraphRequest, ResponseType, BatchResponseContent } from '@microsoft/microsoft-graph-client';

import { Event, EventHolder } from '../event';

import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { DateService } from './date.service';


@Injectable({
  providedIn: 'root'
})
export class GraphService {

  public eventsGraph: Event[];
  private graphClient: Client;
  private defaults = {
    basePath: 'https://graph.microsoft.com/v1.0/',
    calendarPath: '/calendar/calendarView',
    batchPath: 'https://graph.microsoft.com/v1.0/$batch',
    select: 'subject,organizer,start,end,categories',
    orderBy: 'start/dateTime ASC',
    top: '1000'
  }

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private dateService: DateService) {

    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service
        let token = await this.authService.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  }

  async getEvents(user: string): Promise<Event[]> {
    try {
      let result = await this.graphClient
        .api('/users/' + user + '/calendar/calendarView' + '?startdatetime=' + this.dateService.sDT + '&enddatetime=' + this.dateService.eDT)
        .select(this.defaults.select)
        .orderby(this.defaults.orderBy)
        .top(1000)
        .get();
      console.log(result)
      this.eventsGraph = result.value;
      return result.value;
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

  async getReport(calendar: string, eventHolder: EventHolder[]): Promise<EventHolder[]> {
    let result: EventHolder[] = eventHolder;
    let batchResponse: GraphResponse;
    let urls: string[] = this.buildUrls(calendar, eventHolder);

    try {
      batchResponse = await this.getBatch(this.batchGen(urls))
      
      batchResponse.responses.forEach((resp, i) => {
        result[resp.id].eventArray = resp.body.value
      })
  
      console.log(result)
      return result
    } catch (error) {
      this.alertsService.add('getReport error', JSON.stringify(error, null, 2));
    }

  }

  buildUrls(userEmail: string, eventHolder: EventHolder[]) {
    let urls: string[] = [];
    eventHolder.forEach(view => {
      urls.push('/users/' + userEmail + this.defaults.calendarPath + '?startdatetime=' + view.start + '&enddatetime=' + view.end + '&$select=' + this.defaults.select + '&$orderby=' + this.defaults.orderBy + '&$top=' + this.defaults.top)
    })
    return urls;
  }

  batchGen(urls: string[]) {
    let batch = { requests: [] };
    let i = 0;
    urls.forEach(u => {
      batch.requests.push({ id: i, method: 'GET', url: u })
      i++
    })
    console.log(batch)
    return batch
  }

  async getBatch(batch: { requests: any[]; }) {
    try {
      let result = await this.graphClient
        .api('/$batch')
        .post(JSON.stringify(batch));
      return result
    } catch (error) {
      this.alertsService.add('Batch API error', JSON.stringify(error, null, 2));
    }
  }
}


export interface GraphResponse {
  "responses": GraphResponseView[];
}

export interface GraphResponseView {
  id: string;
  status: number;
  headers: {
    "Cache-Control": string;
    "Content-Type": string;
    "OData-Version": string;
  };
  body: {
    "@odata.context": string;
    value: Event[]
  };
}





