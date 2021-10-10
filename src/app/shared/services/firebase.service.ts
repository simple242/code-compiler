import {Injectable} from '@angular/core'
import {AngularFireAuth} from '@angular/fire/auth'
import {AngularFirestore} from '@angular/fire/firestore'
import {take} from 'rxjs/operators'
import {environment} from '@src/environments/environment'

import {FbData} from '@app/shared/models'
import {BehaviorSubject, Subscription} from 'rxjs'

@Injectable()
export class FirebaseService {

  private readonly DATA_COLLECTION: string = 'data'
  private readonly IDS_DOCUMENT: string = 'ids'
  private compilerApiKey$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor(
    private fbAuth: AngularFireAuth,
    private fbFireStore: AngularFirestore
  ) {
  }

  public get compilerApiKey(): string | null {
    return this.compilerApiKey$.value
  }

  public async fbLogin(): Promise<void> {
    try {
      if (!environment?.fbUser?.email || !environment?.fbUser?.id) throw new Error('Invalid user data!')
      await this.fbAuth.signInWithEmailAndPassword(environment.fbUser.email, environment.fbUser.id)
    } catch (e) {
      console.error(e)
    }
  }

  public async populateFbData(): Promise<void> {
    try {
      await this.waitToken()
      await new Promise((resolve, reject) => {
        this.fbFireStore.collection(this.DATA_COLLECTION).doc(this.IDS_DOCUMENT).valueChanges()
          .pipe(take(1))
          .subscribe((res: FbData | any) => {
            if (res?.id_1) this.compilerApiKey$.next(res.id_1)
            resolve(true)
          }, reject)
      })
    } catch (e) {
      console.error(e)
    }
  }

  private async waitToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fbAuth.idToken
        .pipe(take(1))
        .subscribe(resolve, reject)
    })
  }

  public async waitPopulateFbData(): Promise<void> {
    try {
      await new Promise(resolve => {
        this.compilerApiKey$.subscribe(res => {
          if (res) resolve(true)
        })
      })
    } catch (e) {
      console.error(e)

    }
  }

}
