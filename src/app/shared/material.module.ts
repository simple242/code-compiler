import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatMenuModule} from '@angular/material/menu'

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatMenuModule
]

@NgModule({
  declarations: [],
  imports: [CommonModule, materialModules],
  exports: [materialModules]
})
export class MaterialModule {
}
