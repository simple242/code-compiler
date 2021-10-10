import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core'

import {alertAnimation, tooltipAnimation} from '@app/shared/animations'
import {Callback, CompilerLang, Solution, Submission, SubmissionResponse} from '@app/shared/models'
import {CompilerService, FirebaseService, LocalizeService, UtilsService} from '@app/shared/services'
import {FormControl, Validators} from '@angular/forms'
import {MatOptionSelectionChange} from '@angular/material/core'

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  animations: [tooltipAnimation, alertAnimation]
})
export class SandboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltipRef') private tooltipRef: ElementRef | null = null
  @ViewChild('inputDataRef') private inputDataRef: ElementRef | null = null
  @ViewChild('inputSubDataRef') private inputSubDataRef: ElementRef | null = null
  @ViewChild('outputDataRef') private outputDataRef: ElementRef | null = null

  public isShowTooltip: boolean = false
  public submitted: boolean = false
  public isOnline: boolean = true
  public inputData: string = ''
  public inputSubData: string = ''
  public autocompleteControl: FormControl | null = null
  public filteredCompilerLang: CompilerLang[] = []
  public showCompilerLangList: boolean = false

  private compilerLangs: CompilerLang[] = []
  private events: Callback[] = []
  private interval: number | null = null
  private compilerLangId: number | null = null
  private firstOnlineStatus: boolean | null = null
  private appIsReinitialize: boolean = false

  constructor(
    public localizeService: LocalizeService,
    private renderer: Renderer2,
    private compilerService: CompilerService,
    private utilsService: UtilsService,
    private firebaseService: FirebaseService
  ) {
  }

  async ngOnInit() {
    this.firstOnlineStatus = this.isOnline = this.utilsService.isOnline()
    this.utilsService.timeout(() => this.observeOnlineStatus(), 1_000)

    this.inputData = this.getDefaultValue()
    this.autocompleteControl = new FormControl('', [
      Validators.required
    ])

    await this.updateCompilerLangs()
 }

  ngAfterViewInit() {
    if (this.tooltipRef) {
      this.events.push(this.renderer.listen(this.tooltipRef.nativeElement, 'mouseover', () => {
        this.isShowTooltip = true
      }))

      this.events.push(this.renderer.listen(this.tooltipRef.nativeElement, 'mouseout', () => {
        this.isShowTooltip = false
      }))
    }

    const tabPress: Callback = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault()
    }

    if (this.inputDataRef) {
      this.events.push(this.renderer.listen(this.inputDataRef.nativeElement, 'keydown', tabPress))
    }

    if (this.inputSubDataRef) {
      this.events.push(this.renderer.listen(this.inputSubDataRef.nativeElement, 'keydown', tabPress))
    }

  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval)

    this.events.forEach(removeEvent => {
      removeEvent()
    })
  }

  public get formInvalid(): boolean {
    return (
      this.submitted || !!this.autocompleteControl?.invalid ||
      !this.inputData
    )
  }

  private async updateCompilerLangs(): Promise<void> {
    this.compilerLangs = await this.compilerService.getCompilerLangs() || []
    this.filteredCompilerLang = [...this.compilerLangs]
    this.filteredCompilerLang.forEach(lang => {
      if (!lang?.id || !lang?.name || !this.autocompleteControl || this.autocompleteControl.value) return

      if (lang.name.includes('C++')) {
        this.autocompleteControl.patchValue(lang.name)
        this.compilerLangId = lang.id
        this.searchCompilerLang(lang.name)
        this.showCompilerLangList = true
      }
    })
  }

  public async submit(): Promise<void> {
    if (this.formInvalid) return
    this.submitted = true
    const outputText: HTMLElement = this.outputDataRef?.nativeElement

    try {
      if (!this.compilerLangId) throw new Error('Compiler language not select!')

      outputText.innerHTML = ''
      outputText.innerHTML += 'Creating Submission ...\n'

      const body: Submission = {
        source_code: this.inputData,
        stdin: this.inputSubData,
        language_id: this.compilerLangId?.toString()
      }

      const jsonResponse: SubmissionResponse = await this.compilerService.createSubmission(body)
      outputText.innerHTML += 'Submission Created ...\n'

      let jsonGetSolution: Solution = {
        status: {description: 'Queue'},
        stderr: null,
        compile_output: null
      }

      while (
        jsonGetSolution.status.description !== 'Accepted' &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
        ) {
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`

        if (jsonResponse.token) {
          jsonGetSolution = await this.compilerService.getSolution(jsonResponse.token)
        }
      }

      if (jsonGetSolution['stdout']) {
        const output: string = atob(jsonGetSolution['stdout'])
        outputText.innerHTML = ''
        outputText.innerHTML += output
      } else if (jsonGetSolution.stderr) {
        const error: string = atob(jsonGetSolution.stderr)
        outputText.innerHTML = ''
        outputText.innerHTML += `\n Error: ${error}`
      } else {
        const compilation_error: string = atob(<string>jsonGetSolution.compile_output)
        outputText.innerHTML = ''
        outputText.innerHTML += `\n Error: ${compilation_error}`
      }
    } catch (e) {
      console.error('Submit error: ', e)
      outputText.innerHTML = ''
      outputText.innerHTML = e?.message ? `Error: ${e?.message}` : `Error: ${JSON.stringify(e)}`
    } finally {
      this.submitted = false
    }
  }

  private observeOnlineStatus() {
    this.interval = setInterval(() => {
      this.isOnline = this.utilsService.isOnline()

      if (!this.firstOnlineStatus && this.isOnline) {
        this.reinitializeApp()
      }
    }, 1_000)
  }

  public inputDataEvent(event: Event): void {
    this.inputData = (<HTMLTextAreaElement>event.target).value
  }

  public inputSubDataEvent(event: Event): void {
    this.inputSubData = (<HTMLTextAreaElement>event.target).value
  }

  public changeCompilerLang(event: MatOptionSelectionChange, lang: CompilerLang): void {
    if (!event?.source?.selected) return
    if (!lang?.id || !lang?.name) return
    this.compilerLangId = lang.id
  }

  public searchCompilerLang(value: Event | string): void {
    let searchValue: string = ''

    if (value instanceof String || typeof value === 'string') {
      searchValue = value.trim()
    } else if (value?.target) {
      searchValue = (<HTMLInputElement>value.target)?.value?.trim()
    }

    if (!searchValue) {
      this.filteredCompilerLang = [...this.compilerLangs]
      return
    }

    this.filteredCompilerLang = this.compilerLangs.filter(lang => {
      if (!lang?.id || !lang?.name) return false
      if (lang.name.toLowerCase().includes(searchValue.toLowerCase())) return true
      return false
    })
  }

  public unfocusLangInput(): void {
    const currentLang: CompilerLang | null = this.compilerLangs.find(lang => lang?.id === this.compilerLangId) || null
    if (currentLang?.name) {
      this.autocompleteControl?.patchValue(currentLang.name)
    }
  }

  private async reinitializeApp(): Promise<void> {
    try {
      if (this.appIsReinitialize) return
      this.appIsReinitialize = true

      await this.firebaseService.fbLogin()
      await this.firebaseService.populateFbData()
      await this.updateCompilerLangs()

      this.firstOnlineStatus = true
    } catch (e) {
      console.error(e)
    } finally {
      this.appIsReinitialize = false
    }
  }

  private getDefaultValue(): string {
    return (`#include <iostream>
#include <string>
using namespace std;

int main() {

    cout << "Hello World" << "\\n";

    return 0;
}`)
  }

}
