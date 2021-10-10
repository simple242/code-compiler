import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ReactiveFormsModule} from '@angular/forms'

import {TranslateModule} from '@ngx-translate/core'

import {MaterialModule} from '@app/shared/material.module'
import {CompilerService, FirebaseService, LocalizeService, StorageService, UtilsService} from '@app/shared/services'
import {HeaderComponent, MenuComponent, SandboxComponent, SelectLanguageComponent} from '@app/shared/components'

@NgModule({
  declarations: [
    MenuComponent,
    HeaderComponent,
    SandboxComponent,
    SelectLanguageComponent
  ],
  providers: [
    UtilsService,
    FirebaseService,
    StorageService,
    LocalizeService,
    CompilerService
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,
    MenuComponent,
    HeaderComponent,
    SandboxComponent,
    SelectLanguageComponent
  ]
})
export class SharedModule {
}
