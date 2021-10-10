import {Component} from '@angular/core'

import {FirebaseService, LocalizeService} from '@app/shared/services'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private localizeService: LocalizeService,
    private firebaseService: FirebaseService
  ) {
    this.initializeApp()
  }

  private async initializeApp(): Promise<void> {
    await this.firebaseService.fbLogin()
    await this.firebaseService.populateFbData()
    this.localizeService.init()
  }

}
