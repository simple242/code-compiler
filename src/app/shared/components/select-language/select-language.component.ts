import {Component, OnInit} from '@angular/core'

import {LocalizeService} from '@app/shared/services'
import {Lang} from '@app/shared/models'

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageComponent implements OnInit {

  private prevIndex: string = '1000'

  constructor(
    public localizeService: LocalizeService
  ) {
  }

  ngOnInit() {
  }

  public setCurrentLanguage(lang: Lang): void {
    if (!lang) return
    this.localizeService.changeLanguage(lang)
  }

  public menuOpened(): void {
    const elem: HTMLElement | null = document.querySelector('.cdk-overlay-container')
    if (elem) {
      const style: CSSStyleDeclaration = getComputedStyle(elem)
      this.prevIndex = style.zIndex
      elem.style.zIndex = '4000'
    }
  }

  public menuClosed(): void {
    const elem: HTMLElement | null = document.querySelector('.cdk-overlay-container')
    if (elem) elem.style.zIndex = '1000'
  }

}
