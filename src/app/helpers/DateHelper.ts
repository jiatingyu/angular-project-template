import { Injectable } from '@angular/core'
import * as dayjs from 'dayjs'

@Injectable({
  providedIn: 'root',
})
export class DateHelper {
  formart(date, formart = 'YYYY-MM-DD') {
    return dayjs(date).format(formart)
  }
}
