export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Kebijakan Privasi / Privacy Policy
      </h1>

      {/* Bahasa Indonesia */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Bahasa Indonesia</h2>
        <p className="mb-4">
          Aplikasi ini dirancang untuk mendukung produktivitas tim dan
          organisasi. Fitur utama aplikasi adalah integrasi dengan Google
          Calendar untuk membuat, mengedit, dan menghapus acara.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Penggunaan Data</h3>
        <p className="mb-4">
          Aplikasi hanya menggunakan informasi yang diperlukan untuk
          menambahkan, memperbarui, atau menghapus acara di Google Calendar
          Anda. Kami tidak membaca atau mengakses acara lain yang tidak dibuat
          melalui aplikasi ini.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Penyimpanan Data</h3>
        <p className="mb-4">
          Aplikasi tidak menyimpan permanen data kalender pribadi Anda.
          Informasi seperti ID akun Google hanya digunakan untuk autentikasi
          melalui Google OAuth.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Berbagi Data</h3>
        <p className="mb-4">
          Kami tidak membagikan data Anda ke pihak ketiga. Semua aksi terkait
          kalender dilakukan langsung melalui Google Calendar API.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Kontrol Pengguna</h3>
        <p className="mb-4">
          Anda dapat mencabut akses aplikasi kapan saja melalui{' '}
          <a
            href="https://myaccount.google.com/permissions"
            className="text-blue-600 underline"
            target="_blank"
          >
            pengaturan akun Google Anda
          </a>
          . Setelah akses dicabut, aplikasi tidak dapat lagi menambahkan,
          mengedit, atau menghapus acara.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Kontak</h3>
        <p>
          Jika ada pertanyaan terkait Kebijakan Privasi ini, silakan hubungi
          pengembang.
        </p>
      </section>

      {/* English Version */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">English</h2>
        <p className="mb-4">
          This application is designed to support the productivity of teams and
          organizations. The main feature of this application is to integrate
          with Google Calendar in order to create, edit, and delete events.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Data Usage</h3>
        <p className="mb-4">
          The application only uses the information necessary to add, update, or
          delete events in your Google Calendar. We do not read or access other
          calendar events that were not created through this application.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Data Storage</h3>
        <p className="mb-4">
          The application does not permanently store your personal calendar
          data. Information such as your Google account ID is only used for
          authentication purposes through Google OAuth.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h3>
        <p className="mb-4">
          We do not share your data with any third party. All calendar-related
          actions are done directly through the Google Calendar API.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. User Control</h3>
        <p className="mb-4">
          You can revoke access to your Google account at any time through your{' '}
          <a
            href="https://myaccount.google.com/permissions"
            className="text-blue-600 underline"
            target="_blank"
          >
            Google Account settings
          </a>
          . Once access is revoked, the application will no longer be able to
          add, edit, or delete events.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Contact</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact
          the developer.
        </p>
      </section>
    </main>
  );
}
