import {Injectable} from '@angular/core'

@Injectable()
export class UtilsService {

  public timeout(ref: any, time: number): void {
    const tm = setTimeout(() => {
      ref()
      clearTimeout(tm)
    }, time)
  }

  public isOnline(): boolean {
    return window.navigator.onLine
  }

}
