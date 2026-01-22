# UX-Feedback-Punkte (Unangenehmigkeiten)

## 1. ❌ Fehlende Bestätigungsdialog beim Löschen von Anmeldungen
**Problem:** Beim Klick auf "Anmeldung löschen" wird die Anmeldung sofort gelöscht ohne Bestätigung.
**Auswirkung:** Hohes Risiko für versehentliche Löschungen, keine Möglichkeit zur Rücknahme.
**Lösung:** MatDialog mit Bestätigungsdialog implementieren (z.B. "Möchten Sie diese Anmeldung wirklich löschen?").

---

## 2. ❌ Keine Erfolgs-/Fehlermeldungen für Benutzeraktionen
**Problem:** Nach dem Hinzufügen einer Anmeldung oder beim Löschen gibt es kein visuelles Feedback.
**Auswirkung:** Benutzer wissen nicht, ob die Aktion erfolgreich war oder fehlgeschlagen ist.
**Lösung:** MatSnackBar für Erfolgs- und Fehlermeldungen implementieren (z.B. "Anmeldung erfolgreich hinzugefügt!").

---

## 3. ❌ Geburtsdatum wird nicht formatiert angezeigt
**Problem:** In der Registrierungsliste wird `registration.birthdate` roh angezeigt.
**Auswirkung:** Schlechte Lesbarkeit für Benutzer (z.B. "2024-01-15T00:00:00.000Z" statt "15.01.2024").
**Lösung:** DatePipe verwenden, um das Datum benutzerfreundlich zu formatieren.

---

## 4. ❌ Keine leeren Zustände (Empty States)
**Problem:** Wenn keine Kurse oder Anmeldungen vorhanden sind, wird nichts angezeigt - nur leere Grids.
**Auswirkung:** Benutzer wissen nicht, ob die Seite geladen wurde oder ob wirklich keine Daten vorhanden sind.
**Lösung:** Informative Meldungen hinzufügen (z.B. "Keine Kurse vorhanden" oder "Noch keine Anmeldungen").

---

## 5. ❌ Keine lokalen Loading-States bei Hinzufügen von Anmeldungen
**Problem:** Beim Hinzufügen von Anmeldungen gibt es keinen lokalen Loading-Indikator.
**Auswirkung:** Benutzer wissen nicht, ob die Aktion noch läuft oder ob die Seite hängt.
**Lösung:** Lokale Loading-States für Button oder kleine Spinner bei der Aktion hinzufügen.

---

## 6. ❌ Fehlende Validierung für Geburtsdatum
**Problem:** Das Geburtsdatum kann in der Zukunft liegen oder unrealistisch alt sein (z.B. 1900).
**Auswirkung:** Ungültige Daten können erfasst werden, was zu Problemen führt.
**Lösung:** Custom Validator hinzufügen, der prüft, ob das Datum in der Vergangenheit liegt und realistisch ist.

---

## 7. ❌ About-Seite ist unvollständig
**Problem:** Die About-Seite zeigt nur "about works!" - keine nützlichen Informationen.
**Auswirkung:** Schlechter erster Eindruck, unprofessionell.
**Lösung:** Sinnvollen Inhalt hinzufügen oder die Seite entfernen, wenn nicht benötigt.

---

## 8. ❌ Fehlende Suche/Filter-Funktionalität
**Problem:** Bei vielen Kursen oder Anmeldungen gibt es keine Möglichkeit zu suchen oder zu filtern.
**Auswirkung:** Bei größeren Datenmengen wird die Übersicht verloren.
**Lösung:** Suchfelder und Filter-Optionen hinzufügen.

---

## 9. ❌ Unterschiedliche Schriftarten zwischen Daten und anderen UI-Komponenten
**Problem:** Die Daten in den Grids verwenden möglicherweise eine andere Schriftart als die restlichen UI-Komponenten (Formulare, Header, Buttons).
**Auswirkung:** Inkonsistentes Design, wirkt unprofessionell und stört die visuelle Einheitlichkeit der Anwendung.
**Lösung:** Einheitliche Schriftart-Familie für die gesamte Anwendung definieren (z.B. in `styles.scss` oder über Material Design Typography).

---

## Zusammenfassung der Prioritäten

### 🔴 Hoch (Kritisch für Benutzererfahrung):
1. Bestätigungsdialog beim Löschen
2. Erfolgs-/Fehlermeldungen
4. Leere Zustände

### 🟡 Mittel (Wichtig für Professionalität):
3. Formatierung des Geburtsdatums
5. Lokale Loading-States
9. Unterschiedliche Schriftarten

### 🟢 Niedrig (Verbesserungen):
6. Geburtsdatum-Validierung
7. About-Seite
8. Suche/Filter

### Behoben sind:
1. Bestätigungsdialog beim Löschen
2. Erfolgs-/Fehlermeldungen
3. Formatierung des Geburtsdatums
4. Leere Zustände
6. Geburtsdatum-Validierung
9. Unterschiedliche Schriftarten
