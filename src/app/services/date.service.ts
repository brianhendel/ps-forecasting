import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public endType: string;
  public sDT: string;
  public eDT: string;
  public diff: number;

  constructor() {
    this.setEndType('week');
   }

  setEndType(endType: string) {
    this.endType = endType;
    this.sDT = moment().startOf('week').add(1,'week').format();
    this.eDT = moment().add(1,'week').endOf(endType).format();
    this.dateDiff(this.sDT, this.eDT)
  }

  dateDiff(start: string, end: string) {
    this.diff = moment(end).diff(moment(start), 'hours', true);
    
  }
}