import Head from 'next/head';

export default function Datenschutz() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung | Handwerker-Plattform</title>
        <meta name="description" content="Datenschutzerklärung der Handwerker-Plattform" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Allgemeine Informationen</h2>
        <p className="mb-4">
          Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie über die Erhebung, Verarbeitung und Nutzung Ihrer Daten bei der Nutzung unserer Plattform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Verantwortliche Stelle</h2>
        <p className="mb-4">
          Verantwortlich für die Datenverarbeitung ist:<br />
          Linus Weigand<br />
          kontakt@heymano.com
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Handwerker-Profile</h2>
        <p className="mb-4">
          Die von Handwerkern eingetragenen Profildaten (Name, Kontaktdaten, Fotos, etc.) werden öffentlich angezeigt,
          um die Vermittlung zu ermöglichen. Rechtsgrundlage ist Art. 6 Abs. 1b DSGVO (Vertragserfüllung).
          Nutzer können ihr Profil jederzeit löschen (Kontakt: kontakt@heymano.com).
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">3.1 Spezielle Kategorien von Daten</h3>
        <p className="mb-4">
          Profilfotos werden auf unserem Server gespeichert und öffentlich im Profil angezeigt.
        </p>
        <p className="mb-4">
          Handwerkskarten-Nummern werden zur Verifizierung gespeichert und nicht öffentlich angezeigt.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">3.2 Datenfreigabe</h3>
        <p className="mb-4">
          Die Profildaten der Handwerker sind öffentlich sichtbar und können von Suchmaschinen indexiert werden.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">3.3 Betroffenenrechte</h3>
        <p className="mb-4">
          Handwerker können ihre Profildaten jederzeit einsehen, ändern oder löschen lassen. Für eine Löschung kontaktieren Sie uns bitte per E-Mail an kontakt@heymano.com.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies</h2>
        <p className="mb-4">
          Wir verwenden ausschließlich Session-Cookies, die für den Betrieb der Webseite technisch erforderlich sind. Diese werden nach einer Woche automatisch gelöscht.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Ihre Rechte</h2>
        <p className="mb-4">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten gemäß Art. 15-18 DSGVO. Außerdem haben Sie ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde.
        </p>
      </div>
    </>
  );
}
