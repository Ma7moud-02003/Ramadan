import { user } from '@angular/fire/auth';
import { surah } from './../../models/surah';
import { sheikhs, surahs } from './../../constants/quran.constants';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HomeService } from '../../services/home';
import { UserData } from '../../models/userdata';
import { Subscription } from 'rxjs';
import { Ayah } from '../../models/surah';
import { CommonModule } from '@angular/common';
import { Authenication } from '../../services/auth';
import { apis } from '../../environments/apis.env';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit,OnDestroy{

hideAyat=signal<boolean>(false);
darkMode=signal<boolean>(false);
alertMessage=signal<string>('');
showAlert=signal<boolean>(false);
hiddenAyat()
{
  this.hideAyat.set(!this.hideAyat());
}
getShowAlert(messsage:string)
{
this.alertMessage.set(messsage);
this.showAlert.set(!this.showAlert());
}

private  subs=new Subscription();
home=inject(HomeService);
userData=signal<UserData>({} as UserData);
auth=inject(Authenication);
surah=signal<surah>({} as surah);
ayat=signal<Ayah[]>([]);
dailyAyat=signal<Ayah[]>([]);
dailyTafseer=signal<any[]>([]);
tafseerofAyahs=signal<any[]>([]);
ngOnInit(): void {
this.getUserData();
}

getUserData()
{
this.subs.add( this.home.getUserData().subscribe({
next:(data)=>{
this.userData.set(data);
const surah=localStorage.getItem('currentSurah');
const tafseer=localStorage.getItem('tafseer');
if(surah&&tafseer)
{
this.surah.set(JSON.parse(surah));  
this.ayat.set(this.surah().ayahs);
this.tafseerofAyahs.set(JSON.parse(tafseer))
this.getDailyAyat();
this.getDailyTafseer();
}
else
this.getCurrentSurah(this.userData().plane.surahNumber)
this.getTafseerOfSurah(this.userData().plane.surahNumber);

}}));

}


getCurrentSurah(cSurah:number)
{
this.subs.add(
this.home.getCurrentSurah(cSurah).subscribe((res)=>{
this.surah.set(res.data);
this.ayat.set(this.surah().ayahs)
localStorage.setItem('currentSurah',JSON.stringify(res.data));
this.getDailyAyat();}))
}

getTafseerOfSurah(surahNum:number)
{

    console.log(surahNum);
    this.subs.add(
    this.home.getSurahTafseer(surahNum).subscribe((res)=>{
    localStorage.setItem('tafseer',JSON.stringify(res.data.ayahs));
    this.tafseerofAyahs.set(res.data.ayahs);
    this.getDailyTafseer();
  })
)
}

getDailyTafseer()
{
  const dailyAyahs:number=this.userData().plane.dailyAyahs;
  const start:number=this.userData().plane.currentAyah-1;
  const end:number=start+dailyAyahs;
  const ayahs=this.tafseerofAyahs();
  this.dailyTafseer.set(ayahs.slice(start,end));
  console.log(this.dailyAyat());
}

getDailyAyat()
{
  const dailyAyahs:number=this.userData().plane.dailyAyahs;
  const start:number=this.userData().plane.currentAyah-1;
  const end:number=start+dailyAyahs;
  this.dailyAyat.set(this.ayat().slice(start,end));
  this.state.update((state)=>({...state,inCurrent:true,inPervious:false}));
 this.collectAudios();

}


completed()
{
  const plane=this.userData().plane;
  const currentAyah=this.userData().plane.currentAyah;
  const dailyayat=this.userData().plane.dailyAyahs;
  const surah=JSON.parse(localStorage.getItem('currentSurah')||'{}');
  const ayat=surah.ayahs;
const nextIndex = currentAyah + dailyayat - 1;
if (nextIndex >= ayat.length) {
  plane.currentAyah = 1;
  plane.surahNumber += 1;
  if(plane.surahNumber>114)
  plane.surahNumber=1;
  this.home.updatePlaneData(plane);
  this.getCurrentSurah(plane.surahNumber);
this.getShowAlert('تهانينا 🎉 لقد أكملت حفظ سورة كاملة! الحفظ نور للقلب ورفعة للمرء عند الله، فاحرص على الاستمرار 💫📖')
  } 
  else
  {this.getShowAlert('مبروك! 🎉 أتممت حفظ حصتك اليومية. أحب الأعمال إلى الله ما دام مستمرًا عليها ✨📖')
 
    const newCurrentAyah=currentAyah+dailyayat;
    this.dailyAyat.set(ayat.slice(newCurrentAyah-1,newCurrentAyah-1+dailyayat));
    this.state.update((state)=>({...state,inCurrent:true,inPervious:false}));
    this.collectAudios();
    this.play.set(false);
    this.stopPlaying();
    //update in firestore
  plane.currentAyah=newCurrentAyah;
  this.home.updatePlaneData(plane);
  }
  setTimeout(()=>{
    this.showAlert.set(false)
  },6000)
}

// audio section
currentAudio: HTMLAudioElement | null = null;
audios=signal<string[]>([]);

collectAudios() 
{
  this.audios.set([]);
  const ayahs=this.dailyAyat();
  ayahs.forEach(ayah=>{
  const sheikh=sheikhs.find(s=>s.audioEdition==this.userData().plane.sheikhId);

  const audioUrl=`${apis.audioApi}/${sheikh?.qulity}/${this.userData().plane.sheikhId}/${ayah.number}.mp3`;
  this.audios.update((audios)=>[...audios,audioUrl]);
});
 
}



play=signal<boolean>(false);
currentReadingAyahIndex = signal<number>(-1);
currentIndex=signal<number>(0);

   playAllAyahs() {
  
  const audios = this.audios();
  this.currentReadingAyahIndex.set(this.currentIndex());
  if(this.currentIndex()>=audios.length)
  {
    this.play.set(false);
    this.currentReadingAyahIndex.set(-1);
    this.currentIndex.set(0);
    return;
  }
  this.currentAudio = new Audio(this.audios()[this.currentIndex()]);
  this.play.set(true);
  this.currentAudio.play().catch((error) => {
    console.warn(`Audio failed for ayah index ${this.currentIndex()}:`, error);
    this.currentIndex.update((index) => index + 1);
    this.playAllAyahs();
  });
  this.currentAudio.onended = () => {
    this.play.set(true);
    this.currentIndex.update((index) => index + 1);
    this.playAllAyahs();
  };


}


stopPlaying() {   
  if (this.currentAudio) {
    this.currentReadingAyahIndex.set(-1);
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.play.set(false);
    
  }
}
state=signal({
  inPervious:false,
  inCurrent:false,
})
grtPerviousDay()
{

const previousAya=this.UserData.currentAyah-this.UserData.dailyayat;
if(previousAya<1)
{
  alert('لا يوجد آيات سابقة');
  return; 
}
else{
  const newDailyAyat=this.ayat().slice(previousAya-1,previousAya-1+this.UserData.dailyayat);
  this.dailyAyat.set(newDailyAyat);
  this.collectAudios();
  this.state.update((state)=>({...state,inCurrent:false,inPervious:false}));

}}


playSingleAyah(ayahNumber:number,i:number)
{
  const sheikh=sheikhs.find(s=>s.audioEdition==this.userData().plane.sheikhId);   
  const audioUrl=`${apis.audioApi}/${sheikh?.qulity}/${this.userData().plane.sheikhId}/${ayahNumber}.mp3`;
  if (this.currentAudio) {
this.stopPlaying()
  }
  this.playAudio(audioUrl,i);
}
  playAudio(audioUrl:string,i:number)
  {
  this.currentReadingAyahIndex.set(i);
  this.currentAudio = new Audio(audioUrl);
  this.currentAudio.play().catch((error) => {
  console.warn(`Audio failed for ayah index ${i}:`, error);
  });
  }
   



getThePrvious()
{
const currentAya=this.UserData.currentAyah-1;
if(currentAya<=this.UserData.dailyayat)
{
  alert('لا يوجد آيات سابقة');
  return; 
}
else{
  const newDailyAyat=this.ayat().slice(0,currentAya);
  const newCurrentTaseer=this.tafseerofAyahs().slice(0,currentAya);
  this.dailyTafseer.set(newCurrentTaseer);
  this.dailyAyat.set(newDailyAyat);

  this.state.update((state)=>({...state,inPervious:true,inCurrent:false}));
  this.collectAudios();
}}
get UserData()
{
  const currentAyah=this.userData().plane.currentAyah;
  const dailyayat=this.userData().plane.dailyAyahs;
  return {currentAyah,dailyayat};
}
ayaIndex=signal<number>(-1);

logout()
{
  this.auth.logOut();;
}




ngOnDestroy(): void {
  this.subs.unsubscribe();
   if (this.currentAudio) {
    this.currentAudio.pause();

}
}
}

