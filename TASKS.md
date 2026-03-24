# OtoFiyat AI - MVP Task Listesi

Bu dosya, `prd.md` belgesine gore MVP kapsamindaki gelistirme gorevlerini icerir.

## 1) Proje Kurulumu ve Altyapi
- [x] Next.js projesini baslat
- [x] Tailwind CSS kurulumunu yap ve aktif oldugunu dogrula
- [x] Temel klasor yapisini olustur (`app`, `components`, `lib`, `types`, `api`)
- [x] Ortam degiskeni altyapisini kur (`.env.local` kullanimi)
- [ ] Vercel deployment ayarlarini hazirla

## 2) Ana Sayfa ve UX Iskeleti
- [x] Modern ve sade bir ana sayfa tasarla (hero + aciklama + upload alani)
- [x] Mobil uyumlu responsive duzeni kur
- [x] Bos/doluyken farkli gorunen upload alanini olustur
- [x] Kullaniciyi yonlendiren kisa metinler ve durum mesajlari ekle

## 3) Resim Yukleme Bileseni
- [x] Surukle-birak ve dosya secme destegi ekle
- [x] Dosya turu kontrolu ekle (jpg/jpeg/png/webp)
- [x] Dosya boyutu limiti kontrolu ekle
- [x] Yuklenen resmi analiz oncesi onizleme olarak goster
- [x] Resmi sil/degistir aksiyonlarini ekle

## 4) Gemini Vision Entegrasyonu
- [x] Sunucu tarafinda Gemini istemcisi olustur (API route veya server action)
- [x] Yuklenen resmi Gemini Vision'a gonderen fonksiyonu yaz
- [x] Prompt tasarimi yap: marka, model, yil, paket ve kondisyon ciktilari
- [x] Ciktiyi standart bir JSON seklinde parse et ve dogrula
- [x] Hata durumlarinda fallback mesajlari ve loglama ekle

## 5) Fiyat Tahmin Mantigi
- [x] AI bilgisinden hareketle taban/tavan fiyat hesaplama kurali tanimla
- [x] Sonucu TL cinsinden formatla (`Intl.NumberFormat('tr-TR')`)
- [x] Belirsiz veri durumlari icin guvenli varsayimlar ekle
- [x] Tahmin sonucuna guven notu/aciklama alani ekle

## 6) Sonuc Ekrani
- [x] Arac bilgilerini gosteren kart bileseni olustur (marka/model/yil/paket)
- [x] Kondisyon degerlendirmesini gorunur ve anlasilir sun
- [x] Taban-tavan fiyat araligini odakli sekilde goster
- [x] Yukleme/analiz/sonuc adimlari arasinda akici gecisler ekle

## 7) Guvenlik ve Yapilandirma
- [x] API anahtarini sadece `.env.local` icinde tut (koda yazma)
- [x] Public/private env degiskenlerini dogru isimlendir
- [x] Sunucu tarafinda gizli anahtar kullanildigini dogrula
- [x] Hata metinlerinde gizli bilgi sizintisi olmadigini kontrol et

## 8) Test ve Kalite Kontrol
- [ ] Temel akislari manuel test et (yukle -> analiz -> sonuc)
- [ ] Gecersiz dosya tipi ve buyuk dosya senaryolarini test et
- [ ] API hatasi/zaman asimi senaryolarini test et
- [ ] Mobil ekranlarda UI kontrollerini yap
- [x] Build ve lint kontrollerini calistir

## 9) MVP Teslim Checklist
- [ ] Kullanici sadece fotograf yukleyerek sonuc alabiliyor
- [ ] Marka, model, yil ve durum bilgisi goruntuleniyor
- [ ] TL cinsinden fiyat araligi gosteriliyor
- [ ] Responsive ve temiz arayuz tamam
- [ ] Env ve guvenlik kurallari dogru uygulanmis

## Notlar
- `.env` dosyasinda API key benzeri hassas bir deger oldugu goruluyor. Bu degeri versiyon kontrol disinda tutmak icin `.env.local` kullanilmali ve repoya eklenmemelidir.
