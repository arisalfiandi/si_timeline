export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Syarat & Ketentuan / Terms of Service
      </h1>

      {/* Bahasa Indonesia */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Bahasa Indonesia</h2>
        <p className="mb-4">
          Dengan menggunakan aplikasi ini, Anda setuju dengan syarat dan
          ketentuan berikut:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Tujuan Aplikasi</h3>
        <p className="mb-4">
          Aplikasi ini dibuat untuk tujuan pembelajaran dan latihan, khususnya
          membantu tim atau organisasi mengelola acara di Google Calendar.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          2. Penggunaan Google Calendar API
        </h3>
        <p className="mb-4">
          Aplikasi hanya dapat membuat, mengedit, atau menghapus acara kalender.
          Aplikasi tidak membaca atau menggunakan acara lain di luar yang dibuat
          melalui aplikasi ini.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Tanpa Jaminan</h3>
        <p className="mb-4">
          Aplikasi ini disediakan “sebagaimana adanya” tanpa jaminan stabilitas,
          ketersediaan, atau layanan berkelanjutan.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          4. Tanggung Jawab Pengguna
        </h3>
        <p className="mb-4">
          Pengguna bertanggung jawab atas keakuratan data yang dimasukkan dan
          harus mematuhi kebijakan Google serta hukum yang berlaku.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          5. Batasan Tanggung Jawab
        </h3>
        <p>
          Pengembang tidak bertanggung jawab atas kehilangan data atau masalah
          lain yang timbul akibat penggunaan aplikasi ini.
        </p>
      </section>

      {/* English Version */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">English</h2>
        <p className="mb-4">
          By using this application, you agree to the following terms:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          1. Purpose of the Application
        </h3>
        <p className="mb-4">
          This application is built for educational and training purposes,
          specifically to help teams or organizations manage events in Google
          Calendar more productively.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          2. Use of Google Calendar API
        </h3>
        <p className="mb-4">
          The application can only create, edit, or delete calendar events. The
          application does not read or use events outside of those created by
          the user via this app.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. No Guarantee</h3>
        <p className="mb-4">
          This application is provided “as is” without any guarantees of
          stability, uptime, or continuous service.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          4. User Responsibility
        </h3>
        <p className="mb-4">
          Users are responsible for the accuracy of the data they input. Users
          should use this application in accordance with Google’s policies and
          applicable laws.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          5. Limitation of Liability
        </h3>
        <p>
          The developer is not liable for any loss of data or other issues
          resulting from the use of this application.
        </p>
      </section>
    </main>
  );
}
