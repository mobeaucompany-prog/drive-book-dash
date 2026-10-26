import { useLanguage, LanguageSwitch } from "@/lib/i18n/context";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Brand } from "@/components/Brand";
import { createQuoteRequest } from "@/lib/quote-requests";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/devis")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Demande de devis automobile — Pneus du Bruch Forbach" },
      {
        name: "description",
        content:
          "Demandez un devis automobile à Pneus du Bruch Forbach en renseignant votre véhicule, l’intervention et vos dates souhaitées.",
      },
    ],
    links: [{ rel: "canonical", href: "https://centreautooccasion57.com/devis" }],
  }),
  component: QuotePage,
});

const interventions = [
  "Entretien / vidange",
  "Freinage",
  "Pneus d’occasion",
  "Pneus neufs",
  "Montage & équilibrage",
  "Suspension",
  "Batterie",
  "Diagnostic électronique",
  "Climatisation / refroidissement",
  "Électricité",
  "Échappement / antipollution",
  "Autre intervention",
];

function QuotePage() {
  const { t, locale } = useLanguage();
  const { service } = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const values = new FormData(form);
    const preferredDates = ["preferredDate1", "preferredDate2", "preferredDate3"]
      .map((key) => String(values.get(key) || ""))
      .filter(Boolean);

    try {
      const result = await createQuoteRequest({
        data: {
          customerName: String(values.get("customerName") || ""),
          customerPhone: String(values.get("customerPhone") || ""),
          customerEmail: String(values.get("customerEmail") || ""),
          registrationPlate: String(values.get("registrationPlate") || ""),
          vehicleMake: String(values.get("vehicleMake") || ""),
          vehicleModel: String(values.get("vehicleModel") || ""),
          vehicleYear: String(values.get("vehicleYear") || "") || undefined,
          mileage: Number(values.get("mileage")),
          fuelType: String(values.get("fuelType") || "") || undefined,
          transmission: String(values.get("transmission") || "") || undefined,
          interventionType: String(values.get("interventionType") || ""),
          description: String(values.get("description") || ""),
          preferredDates,
        },
      });
      setWhatsappUrl(result.whatsappUrl);
      setEmailSent(result.emailSent);
      setSuccess(true);
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Impossible d’envoyer la demande.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-smoke text-ink">
      <header className="border-b border-border bg-carbon">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center">
            <Brand />
          </Link>
          <div className="flex items-center gap-4"><LanguageSwitch />
            <Link
              to="/compte"
              className="rounded-sm bg-carbon px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
            >{t(" Connexion ")}</Link>
            <Link to="/" className="text-sm font-semibold text-white/70 hover:text-racing">{t(" ← Retour ")}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-carbon text-white">
          <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-racing">
              Pneus du Bruch · Forbach
            </p>
            <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">{t("Demande de devis")}</h1>
            <p className="mt-4 max-w-2xl text-white/70">{t(" Décrivez votre véhicule et l’intervention souhaitée. Le garage recevra votre demande complète et vous recontactera rapidement. ")}</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <form
            onSubmit={submit}
            className="space-y-8 rounded-md border border-border bg-white p-6 shadow-sm sm:p-10"
          >
            <FormSection
              title={t("Vos coordonnées")}
              description={t("Pour que le garage puisse vous répondre.")}
            >
              <Field label={t("Nom et prénom")} required>
                <input
                  required
                  name="customerName"
                  autoComplete="name"
                  className="input"
                  placeholder={t("Prénom Nom")}
                />
              </Field>
              <Field label={t("Téléphone")} required>
                <input
                  required
                  name="customerPhone"
                  type="tel"
                  autoComplete="tel"
                  className="input"
                  placeholder="06 XX XX XX XX"
                />
              </Field>
              <Field label="E-mail" required wide>
                <input
                  required
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  className="input"
                  placeholder="vous@exemple.fr"
                />
              </Field>
            </FormSection>

            <FormSection
              title={t("Votre véhicule")}
              description={t("Les informations indispensables pour préparer le devis.")}
            >
              <Field label={t("Plaque d’immatriculation")} required>
                <input
                  required
                  name="registrationPlate"
                  className="input uppercase"
                  placeholder="AA-123-AA"
                />
              </Field>
              <Field label={t("Kilométrage")} required>
                <input
                  required
                  name="mileage"
                  type="number"
                  min="0"
                  max="2000000"
                  className="input"
                  placeholder="125000"
                />
              </Field>
              <Field label={t("Marque")} required>
                <input required name="vehicleMake" className="input" placeholder="Peugeot" />
              </Field>
              <Field label={t("Modèle")} required>
                <input required name="vehicleModel" className="input" placeholder="308" />
              </Field>
              <Field label={t("Année (facultatif)")}>
                <input
                  name="vehicleYear"
                  inputMode="numeric"
                  maxLength={4}
                  className="input"
                  placeholder="2018"
                />
              </Field>
              <Field label={t("Carburant (facultatif)")}>
                <select name="fuelType" className="input">
                  <option value="">{t("Non renseigné")}</option>
                  <option value="Essence">{t("Essence")}</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">{t("Hybride")}</option>
                  <option value="Électrique">{t("Électrique")}</option>
                  <option value="GPL">{t("GPL")}</option>
                </select>
              </Field>
              <Field label={t("Boîte de vitesses (facultatif)")}>
                <select name="transmission" className="input">
                  <option value="">{t("Non renseignée")}</option>
                  <option value="Manuelle">{t("Manuelle")}</option>
                  <option value="Automatique">{t("Automatique")}</option>
                </select>
              </Field>
            </FormSection>

            <FormSection
              title={t("Intervention souhaitée")}
              description={t("Donnez suffisamment de détails pour obtenir une réponse précise.")}
            >
              <Field label={t("Type d’intervention")} required wide>
                <select
                  name="interventionType"
                  required
                  defaultValue={service || ""}
                  className="input"
                >
                  <option value="" disabled>{t(" Sélectionnez une intervention ")}</option>
                  {interventions.map((item) => (
                    <option key={item} value={item}>{t(item)}</option>
                  ))}
                  {service && !interventions.includes(service) && <option value={service}>{t(service)}</option>}
                </select>
              </Field>
              <Field label={t("Détails de la demande")} required wide>
                <textarea
                  required
                  name="description"
                  rows={6}
                  minLength={10}
                  className="input resize-y"
                  placeholder={t("Pour des pneus : dimensions (ex. 205/55 R16), quantité, été/hiver/4 saisons. Pour la mécanique : décrivez les travaux ou symptômes…")}
                />
              </Field>
            </FormSection>

            <FormSection
              title={t("Dates souhaitées")}
              description={t("Indiquez jusqu’à trois disponibilités. La première est obligatoire.")}
            >
              <Field label={t("Premier choix")} required>
                <input required name="preferredDate1" type="date" className="input" />
              </Field>
              <Field label={t("Deuxième choix (facultatif)")}>
                <input name="preferredDate2" type="date" className="input" />
              </Field>
              <Field label={t("Troisième choix (facultatif)")}>
                <input name="preferredDate3" type="date" className="input" />
              </Field>
            </FormSection>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {t(error)}
              </div>
            )}

            <label className="flex gap-3 text-sm leading-relaxed text-steel">
              <input required type="checkbox" className="mt-1 size-4" />
              <span>{t(" J’accepte que mes informations soient utilisées par Pneus du Bruch uniquement pour traiter cette demande de devis. ")}</span>
            </label>

            <button
              disabled={submitting}
              className="w-full rounded-sm bg-racing px-7 py-4 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-racing/90 disabled:opacity-50"
            >
              {submitting ? t("Envoi en cours…") : t("Envoyer ma demande de devis →")}
            </button>
          </form>
        </section>
      </main>

      {success && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/65 px-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-md bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
              ✓
            </div>
            <h2 className="mt-5 font-display text-3xl font-black">{t("Demande envoyée")}</h2>
            <p className="mt-3 text-steel">
              {emailSent
                ? t("Votre demande a été enregistrée et transmise au garage par e-mail.")
                : t("Votre demande a été enregistrée. Vous pouvez aussi appeler le garage au 06 20 43 11 91 pour la suivre.")}
            </p>
            {whatsappUrl && (
              <>
                <p className="mt-3 text-sm text-steel">{t(" Vous pouvez également transmettre votre demande au garage sur WhatsApp. ")}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full justify-center rounded-sm bg-[#25D366] px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white"
                >{t(" Transmettre aussi sur WhatsApp ")}</a>
              </>
            )}
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-3 rounded-sm border border-border px-7 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-smoke"
            >{t(" Fermer ")}</button>
          </div>
        </div>
      )}

      <footer className="bg-ink px-6 py-8 text-center text-xs text-white/60">
        Pneus du Bruch · Forbach · 06 20 43 11 91
      </footer>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { t, locale } = useLanguage();
  return (
    <fieldset className="border-b border-border pb-8 last:border-0 last:pb-0">
      <legend className="font-display text-xl font-bold">{t(title)}</legend>
      <p className="mt-1 text-sm text-steel">{t(description)}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const { t, locale } = useLanguage();
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-steel">
        {t(label)}
        {required && <span className="text-racing"> *</span>}
      </span>
      {children}
    </label>
  );
}
