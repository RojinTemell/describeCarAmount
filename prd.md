# Proje Belgesi: AI Destekli Araç Değerleme Uygulaması (OtoFiyat AI)

## 1. Proje Vizyonu
Kullanıcıların sadece araç fotoğrafı yükleyerek, herhangi bir teknik veri girişi yapmadan araçlarının piyasa değerini saniyeler içinde öğrenmesini sağlayan, AI (Yapay Zeka) tabanlı bir web uygulaması.

## 2. Kullanıcı Kitlesi
- Aracını satmak isteyen ancak piyasa fiyatını bilmeyen bireysel kullanıcılar.
- Hızlıca piyasa araştırması yapmak isteyen otomobil meraklıları.
- Yazılım bilgisi olmayan, basit ve hızlı arayüz arayan kişiler.

## 3. Teknik Özellikler (MVP - Minimum Uygulanabilir Ürün)

### 3.1. Ana Sayfa ve Resim Yükleme
- **Sürükle-Bırak Alanı:** Kullanıcı resmini sürükleyebilmeli veya seçebilmeli.
- **Önizleme:** Yüklenen resim analizden önce ekranda görünmeli.

### 3.2. AI Analiz Motoru (Gemini Vision API)
- **Görüntü İşleme:** Fotoğraftaki aracın markasını, modelini, yaklaşık yılını ve paketini (varsa) tanımlama.
- **Durum Analizi:** Aracın genel dış görünüş kondisyonunu değerlendirme.

### 3.3. Fiyat Tahmin Algoritması
- **Dinamik Fiyatlandırma:** Tanımlanan araç modeline göre mantıklı bir "Taban Fiyat" ve "Tavan Fiyat" aralığı oluşturma.
- **Para Birimi:** Fiyatlar Türk Lirası (₺) cinsinden gösterilmeli.

### 3.4. Tasarım Prensipleri
- **Modern UI:** Tailwind CSS kullanılarak temiz, minimalist ve profesyonel bir görünüm.
- **Mobil Uyumluluk:** Telefonlardan fotoğraf çekip yüklemeye uygun "Responsive" yapı.

## 4. Kullanılacak Teknolojiler
- **Frontend:** Next.js (React tabanlı)
- **Styling:** Tailwind CSS
- **AI Brain:** Google Gemini API (Vision modeli)
- **Deployment:** Vercel

## 5. Uygulama ve Geliştirme Adımları

### Adım 1: Proje İskeleti
Cursor'a verilecek komut: *"Next.js ve Tailwind CSS kullanarak modern bir araç fiyat tahmin uygulaması iskeleti oluştur."*

### Adım 2: Resim Yükleme Fonksiyonu
Cursor'a verilecek komut: *"Kullanıcının resim seçebileceği ve seçtiği resmi ekranda görebileceği bir upload componenti ekle."*

### Adım 3: Gemini API Entegrasyonu
Cursor'a verilecek komut: *"Yüklenen resmi Gemini API'ye gönderip aracın marka, model ve yıl bilgilerini JSON formatında alan fonksiyonu yaz."*

### Adım 4: Sonuç Ekranı ve Fiyat Gösterimi
Cursor'a verilecek komut: *"AI'dan gelen bilgilere göre ekranda şık bir kart içerisinde aracın özelliklerini ve tahmin edilen fiyat aralığını göster."*

## 6. Güvenlik ve Ayarlar
- API anahtarları asla kodun içine doğrudan yazılmamalı, `.env.local` dosyasında saklanmalıdır.