import {Injectable} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {BehaviorSubject, Observable} from 'rxjs'

import * as storageKeys from '@app/shared/constants'
import {Lang, LangInfo} from '@app/shared/models'
import {StorageService} from '@app/shared/services/storage.service'

@Injectable()
export class LocalizeService {

  private languages: Lang[] = ['uk', 'ru', 'en']
  private currentLanguage: Lang | null = null

  private _onLangChange$: BehaviorSubject<Lang | null> = new BehaviorSubject<Lang | null>(null)
  public onLangChange$: Observable<Lang | null> = this._onLangChange$.asObservable()

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService
  ) {
  }

  public get currentLang(): Lang | null {
    return this.currentLanguage
  }

  public get langs(): Lang[] {
    return this.languages
  }

  public get langsInfo(): LangInfo[] {
    return [
      {lang: 'uk', code: 'UA', name: 'Українська'},
      {lang: 'ru', code: 'RU', name: 'Русский'},
      {lang: 'en', code: 'EN', name: 'English'}
    ]
  }

  public init(): void {
    const sotorageLang: Lang = this.storageService.get(storageKeys.LANG)

    if (sotorageLang) {
      this.changeLanguage(sotorageLang)
      return
    }

    const browserLang: string = this.translateService.getBrowserLang()

    if (this.languages.includes(<Lang>browserLang)) {
      this.changeLanguage(<Lang>browserLang)
      return
    }

    this.changeLanguage('en')
  }

  public changeLanguage(lang: Lang): void {
    this.translateService.setDefaultLang(lang)
    this.translateService.use(lang)
    this.currentLanguage = lang
    this.storageService.set(storageKeys.LANG, lang)
    this._onLangChange$.next(lang)
  }

  public translate(key: string): string {
    return this.translateService.instant(key)
  }

}
