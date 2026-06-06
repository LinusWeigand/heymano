import Head from 'next/head';
export default function Impressum() {
  return (
    <>
      <Head>
        <title>Impressum | Handwerker-Plattform</title>
        <meta name="description" content="Impressum der Handwerker-Plattform" />
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Impressum</h1>
        <p className="mb-4">
          Diese Webseite ist ein Studentenprojekt ohne kommerzielle Absichten.
        </p>
        <p className="mb-4">
          <strong>Verantwortlich für den Inhalt:</strong><br />
          Matteo Golisano<br />
          Belgradstraße 6<br />
          80796 München<br />
          Deutschland
        </p>
        <p className="mb-4">
          <strong>Kontakt:</strong><br />
          E-Mail: Matteo.levi.golisano@gmail.com
        </p>
        <p className="mb-4">
          <strong>Verwendete Ressourcen:</strong><br />
          Icons bereitgestellt von Lucide (https://lucide.dev) unter der ISC-Lizenz.
        </p>
      </div>
    </>
  );
}
