import { inject, Injectable, signal } from '@angular/core';
import { doc, docData, Firestore, serverTimestamp, setDoc, updateDoc } from '@angular/fire/firestore';
import { Authenication } from './auth';
import { PlaneInterface } from '../models/plane';

@Injectable({
  providedIn: 'root',
})
export class Plane {
firestore=inject(Firestore);
private _auth=inject(Authenication);
uid=signal<string>('');

constructor()
{
  this._auth.$user.subscribe((user)=>{
    this.uid.set(user?.uid||'');
  })
}

async savePlane(userPlane:PlaneInterface)
{
console.log('hhhhhhhhhhhhh');  
const docRef=doc(this.firestore,`users/${this.uid()}`);
const plane={...userPlane,createdAt:serverTimestamp()}
  await updateDoc(docRef,{plane});
}

isUserHasPlane()
{
const userDoc=doc(this.firestore,`users/${this.uid()}`) ;
return docData(userDoc);

}

}
