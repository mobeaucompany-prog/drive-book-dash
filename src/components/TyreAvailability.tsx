import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowUpRight, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

type AvailableTyre = {season: "summer" | "winter" | "all_season"; brand:string; model:string; tyre_year:number; pairs:number};
const seasons = {summer:"Été",winter:"Hiver",all_season:"4 saisons"};
export function TyreAvailability({diameter}:{diameter:number}) {
  const {t}=useLanguage();
  const [width,setWidth]=useState("205");
  const [ratio,setRatio]=useState("55");
  const [result,setResult]=useState<{key:string; rows:AvailableTyre[]}|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const request=useRef(0);
  const key=`${width}/${ratio} R${diameter}`;
  const visible=result?.key===key ? result.rows : null;
  return <div className="public-tyre-search">
    <form onSubmit={async e=>{
      e.preventDefault(); const id=++request.current;setBusy(true);setError("");setResult(null);
      try {
        const {data,error}=await (supabase as unknown as SupabaseClient).rpc("get_tyre_availability",{p_width:Number(width),p_ratio:Number(ratio),p_diameter:diameter});
        if(error)throw error;
        if(id===request.current)setResult({key,rows:data as AvailableTyre[]});
      } catch {if(id===request.current)setError(t("Le stock ne peut pas être consulté pour le moment. Appelez-nous pour vérifier la disponibilité."));}
      finally {if(id===request.current)setBusy(false);}
    }}>
      <div className="public-tyre-fields">
        <label>{t("Largeur")}<select value={width} onChange={e=>{setWidth(e.target.value);setError("");setResult(null);}}>{Array.from({length:47},(_,i)=>125+i*5).map(n=><option key={n}>{n}</option>)}</select></label>
        <label>{t("Hauteur")}<select value={ratio} onChange={e=>{setRatio(e.target.value);setError("");setResult(null);}}>{Array.from({length:14},(_,i)=>20+i*5).map(n=><option key={n}>{n}</option>)}</select></label>
      </div>
      <p>{t("Dimensions recherchées :")} <b>{key}</b></p>
      <button className="bruch-button blue" disabled={busy}><Search size={17}/>{t(busy?"Recherche…":"Vérifier le stock d’occasion")}</button>
    </form>
    <div aria-live="polite" aria-busy={busy}>
      {error&&<p role="alert">{error} <a href="tel:+33620431191">06 20 43 11 91</a></p>}
      {visible&&<div className="public-tyre-results"><h4>{t("Stock d’occasion disponible")} · {key}</h4>
        {visible.length ? <><ul>{visible.map((row,i)=><li key={i}><strong>{row.brand} {row.model}</strong><span>{t(seasons[row.season])} · {t("Année")} {row.tyre_year}</span><b>{row.pairs} {t(row.pairs===1?"paire":"paires")} · {row.pairs*2} {t("pneus")}</b></li>)}</ul><p>{t("Stock consulté à l’instant, sous réserve de vente. Appelez-nous pour confirmer avant de vous déplacer.")}</p></> : <p>{t("Aucune paire disponible dans cette dimension pour le moment.")}</p>}
        <a href="tel:+33620431191" className="text-link">{t("Appeler le garage")}</a>
      </div>}
    </div>
    <aside className="new-tyre-order"><h4>{t("Vous préférez des pneus neufs ?")}</h4><p>{t("Commandez sur CentralePneus et renseignez notre adresse pour la livraison :")}</p><address><strong>Pneus du Bruch</strong><br/>2 Allée des Cyprès<br/>57600 Forbach — France</address><p>{t("Indiquez votre nom et votre numéro de commande pour que nous puissions identifier vos pneus. Contactez-nous pour organiser le montage après réception.")}</p><a className="bruch-button blue" href="https://www.centralepneus.fr/" target="_blank" rel="noopener noreferrer">{t("Commander sur CentralePneus")}<ArrowUpRight size={17}/></a><small>{t("Nouvel onglet. Commande et paiement sur CentralePneus. Dimensions et adresse de livraison à saisir sur leur site. Montage à régler au garage.")}</small></aside>
  </div>;
}
