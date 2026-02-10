
export interface PlaneInterface{
  sheikhId:string,        // الشيخ المختار (audio edition)
  surahNumber: number,               // رقم السورة
  startAyah: number,                 // هيبدأ من أنهي آية
  dailyAyahs: number,                // عدد الآيات يوميًا
  currentAyah: number,               // آخر آية وصلها
  completed: boolean              // خلص السورة ولا لسه
}