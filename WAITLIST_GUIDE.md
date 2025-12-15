# 📧 WatchPulse Waitlist Sistemi

## Ne Yaptık?

Web sitene **göze çarpan** bir mail toplama sistemi ekledik! Kullanıcılar mail adreslerini bırakıyor, uygulama çıktığında onlara mail atacaksın.

## Neler Eklendi?

1. ✅ **WaitlistSection** - Hero section'ın hemen altında göze çarpan mail formu
2. ✅ **API Endpoint** - `/api/waitlist` - Mail'leri kaydetmek için
3. ✅ **Otomatik Kayıt** - Mail'ler `data/waitlist.json` dosyasına kaydediliyor
4. ✅ **Türkçe/İngilizce** - İki dilde de çalışıyor
5. ✅ **Güvenlik** - Email validation, duplicate check, IP tracking

## Mail Listesini Nasıl Görürsün?

### Yöntem 1: API ile (Tarayıcıdan)

Siteyi çalıştır ve şu URL'e git:
```
http://localhost:3000/api/waitlist
```

JSON formatında tüm mail'leri göreceksin:
```json
{
  "success": true,
  "count": 5,
  "emails": [
    {
      "email": "user@example.com",
      "timestamp": "2025-12-15T10:30:00.000Z",
      "ip": "192.168.1.1"
    }
  ]
}
```

### Yöntem 2: Dosyayı Direkt Aç

Proje klasöründe:
```
watchpulse-website/data/waitlist.json
```

Bu dosyayı direkt açabilirsin. Excel'e aktarmak için:

1. Dosyayı aç
2. JSON formatındaki mail'leri kopyala
3. Online JSON to CSV converter kullan: https://www.convertcsv.com/json-to-csv.htm
4. Excel'de aç

### Yöntem 3: Curl ile (Terminal)

```bash
curl http://localhost:3000/api/waitlist
```

## Uygulama Çıktığında Ne Yapacaksın?

1. `data/waitlist.json` dosyasını aç
2. Tüm mail adreslerini al
3. Bir mail servisi kullan (örn: Mailchimp, SendGrid, AWS SES)
4. Herkese "🚀 WatchPulse yayında!" maili at

### Mail Template Örneği:

```
Konu: 🎉 WatchPulse Yayında! İlk Kullananlar Arasındasınız

Merhaba!

Heyecan verici haberlerimiz var! WatchPulse nihayet Google Play Store'da yayında!

🎬 Ne izleyeceğine karar vermekte artık zorlanmayacaksın
🤖 AI destekli kişisel öneriler
🎭 10 farklı ruh haline göre film/dizi önerileri

👉 Hemen İndir: [Google Play Link]

İlk 1000 kullanıcıya özel sürprizlerimiz var!

Sevgilerle,
WatchPulse Ekibi
```

## Önemli Notlar

- ✅ `data/waitlist.json` dosyası `.gitignore`'da - Git'e push olmaz
- ✅ Her mail bir kere kaydedilir (duplicate kontrolü var)
- ✅ IP adresi kaydediliyor (spam önleme için)
- ✅ Timestamp var - kim ne zaman kaydolmuş görebilirsin

## Test Et!

1. Siteyi çalıştır: `npm run dev`
2. `http://localhost:3000` aç
3. Hero section'dan sonra gelen waitlist formunu gör
4. Mail adresini gir ve "Join Waitlist" tıkla
5. `data/waitlist.json` dosyasını kontrol et

## Production'da (Canlıda)

Vercel'e deploy ettiğinde:
```
https://watchpulseapp.com/api/waitlist
```

Bu URL'den mail listesini çekebilirsin.

## Sorular?

- Mail'ler nerede? → `data/waitlist.json`
- Kaç kişi kaydoldu? → API'ye GET isteği at, `count` alanına bak
- Nasıl mail atarım? → Mailchimp, SendGrid veya AWS SES kullan

---

**Bonus:** İstersen ileride admin paneli ekleyebiliriz, oradan direkt mail listesini görebilirsin. Şimdilik API yeterli! 🚀
