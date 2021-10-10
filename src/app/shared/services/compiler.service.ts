import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {FirebaseService} from '@app/shared/services/firebase.service'
import {environment} from '@src/environments/environment'
import {CompilerLang, Submission, SubmissionResponse} from '@app/shared/models'

@Injectable()
export class CompilerService {

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) {
  }

  public async createSubmission(body: Submission): Promise<any> {
    await this.firebaseService.waitPopulateFbData()

    if (!this.firebaseService.compilerApiKey) throw new Error('Invalid compiler api key!')
    if (!environment.compiler?.apiUrl) throw new Error('Invalid compiler api url!')

    return this.http.post(`https://${environment.compiler.apiUrl}/submissions`, body, {
      headers: {
        'x-rapidapi-host': environment.compiler.apiUrl,
        'x-rapidapi-key': this.firebaseService.compilerApiKey,
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    }).toPromise()
  }

  public async getSolution(token: string): Promise<any> {
    await this.firebaseService.waitPopulateFbData()

    if (!this.firebaseService.compilerApiKey) throw new Error('Invalid compiler api key!')
    if (!environment.compiler?.apiUrl) throw new Error('Invalid compiler api url!')

    const url: string = `https://${environment.compiler.apiUrl}/submissions/${token}?base64_encoded=true`

    return this.http.get(url, {
      headers: {
        'x-rapidapi-host': environment.compiler.apiUrl,
        'x-rapidapi-key': this.firebaseService.compilerApiKey,
        'content-type': 'application/json'
      }
    }).toPromise()
  }

  public async getCompilerLangs(): Promise<CompilerLang[] | null> {
    try {
      await this.firebaseService.waitPopulateFbData()

      if (!this.firebaseService.compilerApiKey) throw new Error('Invalid compiler api key!')
      if (!environment.compiler?.apiUrl) throw new Error('Invalid compiler api url!')

      const langsUrl: string = `https://${environment.compiler.apiUrl}/languages`

      const langs: CompilerLang[] = <CompilerLang[]>await this.http.get(langsUrl, {
        headers: {
          'x-rapidapi-key': this.firebaseService.compilerApiKey,
          'x-rapidapi-host': environment.compiler.apiUrl
        }
      }).toPromise()

      const validLangs: CompilerLang[] = []

      if (langs instanceof Array) {
        langs.forEach(lang => {
          if (lang?.id && lang?.name) validLangs.push(lang)
        })
      }

      return validLangs
    } catch (e) {
      console.error(e)
      return null
    }
  }

}
