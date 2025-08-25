export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Widerrufsbelehrung</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Widerrufsrecht</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Ausübung des Widerrufsrechts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. ein mit der Post
              versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Kontaktdaten für Widerruf:</h3>
              <p className="text-muted-foreground">
                MenuBase
                <br />
                E-Mail: widerruf@menubase.at
                <br />
                Adresse: [Ihre Geschäftsadresse]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Widerrufsfolgen</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
              unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
              Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Vorzeitiges Erlöschen des Widerrufsrechts</h2>
            <p className="text-muted-foreground leading-relaxed">
              Das Widerrufsrecht erlischt vorzeitig, wenn Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung
              der Dienstleistung vor Ablauf der Widerrufsfrist beginnen, und Sie Ihre Kenntnis davon bestätigt haben,
              dass Sie durch Ihre Zustimmung mit Beginn der Ausführung der Dienstleistung Ihr Widerrufsrecht verlieren.
            </p>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800">Muster-Widerrufsformular</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>
                Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es
                zurück:
              </p>
              <div className="bg-white p-4 rounded border text-gray-700">
                <p>An MenuBase, widerruf@menubase.at:</p>
                <p>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der
                  folgenden Dienstleistung:
                </p>
                <p>Bestellt am (*)/erhalten am (*):</p>
                <p>Name des/der Verbraucher(s):</p>
                <p>Anschrift des/der Verbraucher(s):</p>
                <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                <p>Datum:</p>
                <p className="text-xs">(*) Unzutreffendes streichen.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Stand: Dezember 2024 | MenuBase | Kontakt: widerruf@menubase.at
          </p>
        </div>
      </div>
    </div>
  )
}
