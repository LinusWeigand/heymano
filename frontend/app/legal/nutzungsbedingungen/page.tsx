import Head from 'next/head';

export default function Nutzungsbedingungen() {
  return (
    <>
      <Head>
        <title>Nutzungsbedingungen | Handwerker-Plattform</title>
        <meta name="description" content="Nutzungsbedingungen der Handwerker-Plattform" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Nutzungsbedingungen</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Allgemeines</h2>
        <p className="mb-4">
          Diese Nutzungsbedingungen regeln die Nutzung der Handwerker-Plattform, einem Studentenprojekt zur Vermittlung von Handwerkern.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Nutzung der Plattform</h2>
        <p className="mb-4">
          Die Nutzung der Plattform ist kostenlos. Die Betreiber behalten sich das Recht vor, die Plattform jederzeit zu ändern oder einzustellen.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Profil-Regeln</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Handwerker garantieren, dass ihre Angaben korrekt und aktuell sind.</li>
          <li>Falschangaben (z.B. gefälschte Lizenznummern) führen zur Profil-Löschung.</li>
          <li>Die Plattform haftet nicht für die Richtigkeit der Profile.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Haftungsausschluss</h2>
        <p className="mb-4">
          Wir überprüfen Handwerker-Profile nicht auf Vollständigkeit/Richtigkeit.
          Nutzer kontaktieren Handwerker auf eigenes Risiko.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Konto-Kündigung</h2>
        <p className="mb-4">
          Wir behalten uns das Recht vor, Profile, die gegen diese Nutzungsbedingungen verstoßen, ohne Vorankündigung zu löschen.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Änderungen der Nutzungsbedingungen</h2>
        <p className="mb-4">
          Wir behalten uns vor, diese Nutzungsbedingungen jederzeit zu ändern. Die aktuellen Nutzungsbedingungen sind auf der Webseite einsehbar.
        </p>
      </div>
    </>
  );
}
