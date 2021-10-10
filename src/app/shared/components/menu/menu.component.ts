import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core'

import {UtilsService} from '@app/shared/services'

declare const ipcRenderer: any

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('maximize') private maximize: ElementRef | null = null
  @ViewChild('minimize') private minimize: ElementRef | null = null

  constructor(
    private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.utilsService.timeout(() => {
      if (!ipcRenderer) return

      ipcRenderer.on('isMaximized', () => {
        if (!this.minimize || !this.maximize) return

        this.maximize.nativeElement.style.display = 'none'
        this.minimize.nativeElement.style.display = 'block'
      })

      ipcRenderer.on('isRestored', () => {
        if (!this.minimize || !this.maximize) return

        this.maximize.nativeElement.style.display = 'block'
        this.minimize.nativeElement.style.display = 'none'
      })
    }, 100)
  }

  public closeApp(): void {
    try {
      if (!ipcRenderer) return
      ipcRenderer.send('closeApp')
    } catch (e) {
      console.log(e)
    }
  }

  public minimizeApp(): void {
    try {
      if (!ipcRenderer) return
      ipcRenderer.send('minimizeApp')
    } catch (e) {
      console.log(e)
    }
  }

  public maximizeRestoreApp(): void {
    try {
      if (!ipcRenderer) return
      ipcRenderer.send('maximizeRestoreApp')
    } catch (e) {
      console.log(e)
    }
  }

}
