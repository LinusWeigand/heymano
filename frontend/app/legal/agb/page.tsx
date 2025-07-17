import Head from 'next/head';

export default function AGB() {
  return (
    <>
      <Head>
        <title>Allgemeine Geschäftsbedingungen | Handwerker-Plattform</title>
        <meta name="description" content="Allgemeine Geschäftsbedingungen der Handwerker-Plattform" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Allgemeine Geschäftsbedingungen</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Geltungsbereich</h2>
        <p className="mb-4">
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Handwerker-Plattform, einem Studentenprojekt.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Leistungsbeschreibung</h2>
        <p className="mb-4">
          Die Plattform bietet Handwerkern die Möglichkeit, sich mit einem Profil zu präsentieren, und Nutzern die Möglichkeit, nach Handwerkern zu suchen.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Registrierung und Profile</h2>
        <p className="mb-4">
          Handwerker können sich kostenlos registrieren und ein Profil anlegen. Die Angaben müssen wahrheitsgemäß und vollständig sein.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Haftungsausschluss</h2>
        <p className="mb-4">
          Wir überprüfen Handwerker-Profile nicht auf Vollständigkeit/Richtigkeit.
          Nutzer kontaktieren Handwerker auf eigenes Risiko.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Kündigung</h2>
        <p className="mb-4">
          Die Betreiber behalten sich das Recht vor, Profile ohne Angabe von Gründen zu löschen, insbesondere bei Verstößen gegen diese AGB.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Änderung der AGB</h2>
        <p className="mb-4">
          Die Betreiber behalten sich das Recht vor, diese AGB jederzeit zu ändern. Die aktuellen AGB sind auf der Webseite einsehbar.
        </p>
      </div>
    </>
  );
}
