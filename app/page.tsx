import UploadAnalyzeForm from "@/components/upload-analyze-form"

const HomePage = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-12 md:px-6">
      <header className="mb-8 w-full max-w-3xl space-y-3 text-center">
        <p className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          OtoFiyat AI - MVP
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Fotograf yukle, aracinin deger araligini saniyeler icinde gor
        </h1>
        <p className="text-sm text-slate-600 md:text-base">
          Gemini Vision ile arac bilgileri cikartilir, tahmini taban ve tavan fiyat araligi gosterilir.
        </p>
      </header>

      <UploadAnalyzeForm />
    </main>
  )
}

export default HomePage
