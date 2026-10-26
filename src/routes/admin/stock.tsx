import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Plus, Minus, Search, RefreshCw, History, Package, LogOut, Pencil, Archive, X, ArrowLeft, CircleDot } from "lucide-react";
import { Brand } from "@/components/Brand";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSwitch, useLanguage } from "@/lib/i18n/context";
import { checkStockAccess, changeStock, loadStock, loadMovements, seasons, diameters, widths, ratios, tyreSize, tyreDetailsSchema, type TyreStock, type Movement, type Mutation, type Season } from "@/lib/tyre-stock";
import "@/stock.css";

export const Route = createFileRoute("/admin/stock")({ head: () => ({ meta: [{title:"Gestion du stock — Pneus du Bruch"},{name:"robots",content:"noindex,nofollow"}] }), component: StockPage });

function StockPage() {
  const { t } = useLanguage();
  const [session,setSession] = useState<Session|null>(null);
  const [checking,setChecking] = useState(true);
  const [allowed,setAllowed] = useState(false);
  const [error,setError] = useState("");
  const [rows,setRows] = useState<TyreStock[]>([]);
  const [movements,setMovements] = useState<Movement[]>([]);
  const [lastSync,setLastSync] = useState<Date|null>(null);
  const [loading,setLoading] = useState(false);
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  const [retry,setRetry] = useState<{payload:Mutation;id:string}|null>(null);
  const generation = useRef(0);
  const syncing = useRef(false);
  const refreshQueued = useRef(false);
  const pending = useRef(false);
  const reload = useCallback(async () => {
    if (syncing.current) { refreshQueued.current=true; return; }
    syncing.current = true;
    const token = generation.current;
    setLoading(true);
    try {
      if (!await checkStockAccess()) { if(token === generation.current){setAllowed(false);setRows([]);setMovements([]);setError("Cet espace est réservé aux administrateurs du garage.");} return; }
      const [stock,history] = await Promise.all([loadStock(),loadMovements()]);
      if(token !== generation.current) return;
      setAllowed(true);setRows(stock);setMovements(history);setLastSync(new Date());setError("");
    } catch(e) { if(token === generation.current)setError(e instanceof Error ? e.message : "Impossible de charger le stock."); }
    finally { syncing.current=false; if(token === generation.current){setLoading(false);setChecking(false);} if(refreshQueued.current){refreshQueued.current=false;void reload();} }
  },[]);
  useEffect(() => {
    let active=true;
    const update = (next:Session|null) => {
      if(!active)return;
      generation.current++;setSession(next);setAllowed(false);setRows([]);setMovements([]);setLastSync(null);setError("");setRetry(null);
      setChecking(false);
    };
    supabase.auth.getSession().then(({data,error})=>{if(error){setError("Impossible de vérifier votre session.");setChecking(false);}else update(data.session);}).catch(()=>{if(active){setError("Impossible de vérifier votre session.");setChecking(false);}});
    const {data} = supabase.auth.onAuthStateChange((_event,next)=>{update(next);});
    return ()=>{active=false;generation.current++;data.subscription.unsubscribe();};
  },[]);
  useEffect(()=>{
    if(!session)return;
    void reload();
    const tick=window.setInterval(()=>{if(!document.hidden && !pending.current)void reload();},15000);
    const focus=()=>{if(!pending.current)void reload();};
    window.addEventListener("focus",focus);window.addEventListener("online",focus);
    return ()=>{window.clearInterval(tick);window.removeEventListener("focus",focus);window.removeEventListener("online",focus);};
  },[session,reload]);

  async function mutate(payload:Mutation, existingId?:string) {
    if(pending.current || (retry && !existingId))return false;
    const id=existingId || crypto.randomUUID();
    pending.current=true;setBusy(true);setError("");setNotice("");
    try {
      await changeStock(payload,id);
      setRetry(null);setNotice("Modification enregistrée.");
      // Mutations are acknowledged by the database before success is shown.
      await reload();
      return true;
    } catch(e) {
      setError(e instanceof Error ? e.message : "Impossible de modifier le stock.");
      setRetry(e instanceof Error && e.message.startsWith("Connexion interrompue") ? {payload,id} : null);return false;
    } finally {pending.current=false;setBusy(false);}
  }
  return <div className="stock-app"><header className="stock-header"><Link to="/"><Brand/></Link><LanguageSwitch/><div className="stock-header-links"><Link to="/admin/atelier">{t("Devis & réservations")}</Link>{session&&<button onClick={()=>void supabase.auth.signOut()}><LogOut size={16}/>{t("Déconnexion")}</button>}</div></header>
    {checking ? <main className="stock-gate"><p>{t("Vérification du compte…")}</p></main> : !session ? <main className="stock-gate"><Package size={40}/><h1>{t("Le stock du garage.")}</h1><p>{t("Connectez-vous avec votre compte administrateur pour gérer vos pneus d’occasion depuis tous vos appareils.")}</p><Link to="/compte" className="stock-button">{t("Se connecter")}</Link></main> : !allowed ? <main className="stock-gate"><h1>{t("Accès au stock")}</h1><p role="alert">{error?t(error):t("Vérification des droits…")}</p><button className="stock-button" disabled={loading} onClick={()=>void reload()}>{t("Réessayer")}</button></main> : <InventoryView rows={rows} movements={movements} busy={busy} loading={loading} error={error} notice={notice} lastSync={lastSync} onRefresh={reload} onMutate={mutate} retry={retry ? ()=>mutate(retry.payload,retry.id) : undefined} onDismissRetry={()=>{setRetry(null);void reload();}}/>}
  </div>;
}

type InventoryProps = { rows:TyreStock[];movements:Movement[];busy:boolean;loading:boolean;error:string;notice:string;lastSync:Date|null;onRefresh:()=>Promise<void>;onMutate:(p:Mutation)=>Promise<boolean>;retry?:()=>Promise<boolean>;onDismissRetry?:()=>void };
export function InventoryView({rows,movements,busy,loading,error,notice,lastSync,onRefresh,onMutate,retry,onDismissRetry}:InventoryProps) {
  const {t,locale}=useLanguage();
  const [season,setSeason]=useState("");
  const [diameter,setDiameter]=useState("");
  const [width,setWidth]=useState("");
  const [ratio,setRatio]=useState("");
  const [brand,setBrand]=useState("");
  const [search,setSearch]=useState("");
  const [onlyAvailable,setOnlyAvailable]=useState(false);
  const [history,setHistory]=useState(false);
  const [editor,setEditor]=useState<TyreStock|"new"|null>(null);
  const [adjust,setAdjust]=useState<{row:TyreStock;sign:1|-1}|null>(null);
  const [archive,setArchive]=useState<TyreStock|null>(null);
  const resume=async()=>{if(await retry?.()){setEditor(null);setAdjust(null);setArchive(null);}};
  const filtered=rows.filter(row=>(!season||row.season===season)&&(!diameter||row.diameter===Number(diameter))&&(!width||row.width===Number(width))&&(!ratio||row.aspect_ratio===Number(ratio))&&(!brand||row.brand.toLowerCase()===brand)&&(!onlyAvailable||row.pairs>0)&&`${tyreSize(row)} ${row.brand} ${row.model} ${row.tyre_year}`.toLowerCase().includes(search.toLowerCase().trim()));
  const pairs=rows.reduce((sum,r)=>sum+r.pairs,0);
  const shownPairs=filtered.reduce((sum,r)=>sum+r.pairs,0);
  const brandOptions=[...new Map(rows.map(r=>[r.brand.toLowerCase(),r.brand])).entries()].sort((a,b)=>a[1].localeCompare(b[1]));
  const reset=()=>{setSeason("");setDiameter("");setWidth("");setRatio("");setBrand("");setSearch("");setOnlyAvailable(false);};
  return <main className="stock-main">
    <div className="stock-title"><div><p className="stock-eyebrow">{t("ESPACE GARAGE / PNEUS D’OCCASION")}</p><h1>{t("Votre stock. En clair.")}</h1><p>{t("Des paires qui entrent, des paires qui roulent.")}</p></div><button className="stock-button" disabled={busy} onClick={()=>setEditor("new")}><Plus size={18}/>{t("Ajouter des pneus")}</button></div>
    <div className="stock-stats"><article><span>{t("PAIRES EN STOCK")}</span><strong>{pairs.toLocaleString(locale)}</strong><small>{pairs*2} {t("pneus au total")}</small></article><article><span>{t("RÉFÉRENCES")}</span><strong>{rows.length}</strong><small>{t("Marque, modèle, dimensions et année")}</small></article><article className="stock-sync"><span>{t("STOCK PARTAGÉ")}</span><p className={error?"sync-error":""}><span/>{error?t("Synchronisation à vérifier"):t("Téléphone & ordinateur")}</p><small>{lastSync?`${t("Dernière lecture :")} ${lastSync.toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}`:t("Chargement…")}</small><button disabled={loading||busy} onClick={()=>void onRefresh()}><RefreshCw size={14}/>{loading?t("Actualisation…"):t("Actualiser")}</button></article></div>
    {error&&<div className="stock-alert" role="alert"><p>{t(error)}</p>{retry&&<div><button disabled={busy} onClick={()=>void resume()}>{t("Vérifier / réessayer la même opération")}</button><button onClick={onDismissRetry}>{t("Fermer et relire le stock")}</button></div>}</div>}
    {notice&&<p className="stock-notice" role="status">{t(notice)}</p>}
    <div className="stock-tabs"><button aria-pressed={!history} onClick={()=>setHistory(false)}><Package size={17}/>{t("Stock actuel")}</button><button aria-pressed={history} onClick={()=>setHistory(true)}><History size={17}/>{t("Historique")}</button></div>
    {history ? <section className="stock-history"><h2>{t("Les 100 derniers mouvements")}</h2>{movements.length===0?<p>{t("Aucun mouvement pour le moment.")}</p>:movements.map(m=><article key={m.id}><span className={m.delta<0?"movement-minus":"movement-plus"}>{m.delta>0?"+":""}{m.delta || "—"}</span><div><strong>{tyreSize(m.reference)} · {m.reference.brand} {m.reference.model}</strong><p>{t(seasons[m.reference.season])} · {m.reference.tyre_year} · {t({add:"Ajout",adjust:"Ajustement",edit:"Fiche modifiée",archive:"Référence archivée"}[m.action])}{m.reason?` · ${m.reason}`:""}</p><small>{new Date(m.created_at).toLocaleString(locale)}</small></div><span>{t("Solde :")} <b>{m.balance}</b> {t("paires")}</span></article>)}</section> : <>
    <section className="stock-filters" aria-label={t("Filtrer le stock")}><div className="season-tabs" role="group" aria-label={t("Saison")}><button aria-pressed={season===""} onClick={()=>setSeason("")}>{t("Toutes saisons")}</button>{Object.entries(seasons).map(([value,label])=><button key={value} aria-pressed={season===value} onClick={()=>setSeason(value)}>{t(label)}</button>)}</div><div className="stock-filter-grid"><label>{t("Largeur")}<select value={width} onChange={e=>setWidth(e.target.value)}><option value="">{t("Toutes")}</option>{[...new Set([...widths,...rows.map(r=>r.width)])].sort((a,b)=>a-b).map(w=><option key={w} value={w}>{w}</option>)}</select></label><label>{t("Hauteur")}<select value={ratio} onChange={e=>setRatio(e.target.value)}><option value="">{t("Toutes")}</option>{ratios.map(r=><option key={r} value={r}>{r}</option>)}</select></label><label>{t("Diamètre")}<select value={diameter} onChange={e=>setDiameter(e.target.value)}><option value="">{t("Tous les pouces")}</option>{diameters.map(d=><option key={d} value={d}>{d}″</option>)}</select></label><label>{t("Marque")}<select value={brand} onChange={e=>setBrand(e.target.value)}><option value="">{t("Toutes")}</option>{brandOptions.map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label></div><div className="stock-search-row"><label className="stock-search"><Search size={18}/><input aria-label={t("Rechercher dans le stock")} placeholder={t("Modèle, marque, année ou dimensions…")} value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="stock-checkbox"><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)}/>{t("En stock uniquement")}</label><button className="stock-reset" onClick={reset}>{t("Réinitialiser")}</button></div></section>
    <div className="stock-results-heading"><h2>{t("Les pneus disponibles")}</h2><span>{filtered.length} {t("références")} · <b>{shownPairs} {t("paires")}</b> · {shownPairs*2} {t("pneus")}</span></div>
    {!filtered.length&&<div className="stock-empty"><CircleDot size={40}/><h3>{rows.length?t("Aucun résultat avec ces filtres."):t("Votre premier pneu commence ici.")}</h3><p>{rows.length?t("Essayez un autre diamètre ou réinitialisez les filtres."):t("Ajoutez une référence et son nombre de paires. Elle sera accessible sur tous vos appareils.")}</p><button className="stock-button" onClick={()=>rows.length?reset():setEditor("new")}>{rows.length?t("Réinitialiser"):t("Ajouter des pneus")}</button></div>}
    {diameters.map(d=>{const group=filtered.filter(r=>r.diameter===d).sort((a,b)=>a.width-b.width||a.aspect_ratio-b.aspect_ratio||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model)||b.tyre_year-a.tyre_year);return group.length>0&&<section className="stock-diameter" key={d}><h3>{d}<span>″</span> <small>{group.reduce((s,r)=>s+r.pairs,0)} {t("paires")}</small></h3><div className="stock-card-grid">{group.map(row=><article className={`stock-card ${row.pairs===0?"stock-zero":""}`} key={row.id}><div className="stock-card-top"><span className={`season-badge ${row.season}`}>{t(seasons[row.season])}</span><span>{t("Année")} {row.tyre_year}</span></div><h4>{tyreSize(row)}</h4><p className="stock-model"><b>{row.brand}</b> {row.model}</p><div className="stock-quantity"><strong>{row.pairs}<small>{t(row.pairs===1?"paire":"paires")}</small></strong><span>{row.pairs*2} {t("pneus")}{row.pairs===0&&` · ${t("Épuisé")}`}</span></div><div className="stock-actions"><button disabled={busy||row.pairs===0} aria-label={`${t("Retirer des paires")} · ${tyreSize(row)} ${row.brand} ${row.model}`} onClick={()=>setAdjust({row,sign:-1})}><Minus size={16}/>{t("Retirer")}</button><button disabled={busy} aria-label={`${t("Ajouter des paires")} · ${tyreSize(row)} ${row.brand} ${row.model}`} onClick={()=>setAdjust({row,sign:1})}><Plus size={16}/>{t("Ajouter")}</button></div><div className="stock-card-bottom"><button disabled={busy} onClick={()=>setEditor(row)}><Pencil size={13}/>{t("Modifier la fiche")}</button>{row.pairs===0&&<button disabled={busy} onClick={()=>setArchive(row)}><Archive size={13}/>{t("Archiver")}</button>}</div></article>)}</div></section>;})}</>}
    {editor&&<StockDialog title={t(editor==="new"?"Ajouter des pneus":"Modifier la fiche")} onClose={()=>setEditor(null)} locked={busy}><TyreEditor row={editor==="new"?undefined:editor} busy={busy} onSave={async payload=>{if(await onMutate(payload))setEditor(null);}}/>{error&&<p className="stock-alert" role="alert">{t(error)}</p>}{retry&&<button disabled={busy} onClick={()=>void resume()}>{t("Vérifier / réessayer la même opération")}</button>}</StockDialog>}
    {adjust&&<StockDialog title={t(adjust.sign===1?"Ajouter des paires":"Retirer des paires")} onClose={()=>setAdjust(null)} locked={busy}><p><b>{tyreSize(adjust.row)} · {adjust.row.brand} {adjust.row.model}</b><br/>{t(seasons[adjust.row.season])} · {adjust.row.tyre_year}</p><p>{t("Stock affiché :")} {adjust.row.pairs} {t("paires")}</p><form onSubmit={async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const count=Number(f.get("pairs"));if(!Number.isInteger(count)||count<1||count>10000)return;if(await onMutate({action:"adjust",id:adjust.row.id,delta:adjust.sign*count,reason:String(f.get("reason")||"")}))setAdjust(null);}}><label>{t("Nombre de paires")}<input name="pairs" type="number" min="1" max={adjust.sign===-1?adjust.row.pairs:10000} step="1" defaultValue="1" required autoFocus/></label><label>{t("Motif (facultatif)")}<input name="reason" maxLength={300} placeholder={t("Vente, livraison, correction…")}/></label><p className="stock-help">{t("1 paire = 2 pneus. Le stock disponible sera vérifié au moment de l’enregistrement.")}</p><button className="stock-button" disabled={busy}>{busy?t("Enregistrement…"):t(adjust.sign===1?"Confirmer l’ajout":"Confirmer le retrait")}</button></form>{error&&<p role="alert" className="stock-alert">{t(error)}</p>}{retry&&<button disabled={busy} onClick={()=>void resume()}>{t("Vérifier / réessayer la même opération")}</button>}</StockDialog>}
    {archive&&<StockDialog title={t("Archiver la référence")} onClose={()=>setArchive(null)} locked={busy}><p>{tyreSize(archive)} · {archive.brand} {archive.model}</p><p>{t("Cette référence vide sera masquée du stock. Son historique sera conservé.")}</p><button className="stock-button" disabled={busy} onClick={async()=>{if(await onMutate({action:"archive",id:archive.id,version:archive.version}))setArchive(null);}}>{t("Archiver")}</button>{error&&<p role="alert" className="stock-alert">{t(error)}</p>}{retry&&<button disabled={busy} onClick={()=>void resume()}>{t("Vérifier / réessayer la même opération")}</button>}</StockDialog>}
  </main>;
}

function StockDialog({title,onClose,locked,children}:{title:string;onClose:()=>void;locked:boolean;children:React.ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  const {t}=useLanguage();
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;ref.current?.showModal();return()=>{ref.current?.close();previous?.focus();};},[]);
  return <dialog ref={ref} className="stock-dialog" aria-labelledby="stock-dialog-title" onCancel={e=>{e.preventDefault();if(!locked)onClose();}}><div className="stock-dialog-title"><h2 id="stock-dialog-title">{title}</h2><button type="button" aria-label={t("Fermer")} disabled={locked} onClick={onClose}><X/></button></div>{children}</dialog>;
}
function TyreEditor({row,busy,onSave}:{row?:TyreStock;busy:boolean;onSave:(p:Mutation)=>Promise<void>}) {
  const {t}=useLanguage();const [error,setError]=useState("");
  const submit=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setError("");const values=Object.fromEntries(new FormData(e.currentTarget));const parsed=tyreDetailsSchema.safeParse(values);const pairs=Number(values.pairs);if(!parsed.success||(!row&&(!Number.isInteger(pairs)||pairs<1||pairs>10000))){setError("Vérifiez les dimensions, l’année et le nombre entier de paires.");return;}await onSave(row?{action:"edit",id:row.id,version:row.version,...parsed.data}:{action:"add",pairs,...parsed.data});};
  return <form onSubmit={submit}><p className="stock-help">{t(row?"La quantité se modifie avec les boutons Ajouter et Retirer.":"Une référence identique sera regroupée automatiquement. Les quantités sont toujours en paires.")}</p><div className="stock-editor-grid"><label>{t("Saison")}<select name="season" defaultValue={row?.season||"summer"} required>{Object.entries(seasons).map(([v,s])=><option key={v} value={v}>{t(s)}</option>)}</select></label><label>{t("Diamètre")}<select name="diameter" defaultValue={row?.diameter||16} required>{diameters.map(d=><option key={d} value={d}>{d}″</option>)}</select></label><label>{t("Largeur")}<input name="width" type="number" list="tyre-widths" min="125" max="355" step="5" defaultValue={row?.width||205} required/><datalist id="tyre-widths">{widths.map(w=><option key={w} value={w}/>)}</datalist></label><label>{t("Hauteur")}<select name="aspect_ratio" defaultValue={row?.aspect_ratio||55} required>{ratios.map(r=><option key={r} value={r}>{r}</option>)}</select></label><label>{t("Marque")}<input name="brand" placeholder="Michelin" maxLength={80} defaultValue={row?.brand} required/></label><label>{t("Modèle")}<input name="model" placeholder="Alpin 6" maxLength={100} defaultValue={row?.model} required/></label><label>{t("Année du pneu")}<input name="tyre_year" type="number" min="1980" max={new Date().getFullYear()} step="1" placeholder="2023" defaultValue={row?.tyre_year} required/></label>{!row&&<label>{t("Nombre de paires")}<input name="pairs" type="number" min="1" max="10000" step="1" defaultValue="1" required/></label>}</div><p className="stock-help">{t("Exemple : 205 / 55 / 16. Pour l’année, les deux derniers chiffres du code DOT indiquent l’année de fabrication.")}</p>{error&&<p role="alert" className="stock-alert">{t(error)}</p>}<button className="stock-button" disabled={busy}>{busy?t("Enregistrement…"):t(row?"Enregistrer la fiche":"Ajouter au stock")}</button></form>;
}
