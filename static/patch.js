/* ==========================================================================
   Patch assistant-rp.com — 22/10/2026, mis à jour le 17/11/2026
   Ne modifie pas main.js. Injecte dans le DOM une fois le site React monté :
   1. Le composant "cibles" (3 profils à onglets) dans la section .promise
   2. Deux questions FAQ supplémentaires (Entreprise, engagement annuel)
   3. (17/11) Les vraies CGU dans la popin "Conditions générales d'utilisation"
      — l'ancien texte (LEGAL_CONTENT) était un premier jet jamais relu,
      resté sans rapport avec les CGU définitives désormais utilisées côté
      app (voir CGU_HTML plus bas). Fred s'en sert aussi comme adresse
      trackable pour Brevo : assistant-rp.com/#cgu.
   4. (17/11) Masque le bandeau "En complément" (livre aux Éditions Kawa) :
      un article de blog couvre déjà le sujet, demande de Bruno.
   (Le correctif forçant l'affichage de "42 modules" a été retiré le
   23/10/2026 : décision d'équipe de ne plus afficher de comptage précis.)
   ========================================================================== */
(function () {
  "use strict";

  var ICON_PLUS =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path>' +
    '<path d="M12 5v14"></path></svg>';

  var CIBLES_HTML = [
    '<div class="wrap"><div class="cibles-embed">',
    '<div class="head">',
    '<div>',
    '<div class="eyebrow">Conçu pour celles et ceux qui font les relations médias</div>',
    '<h2 id="cibles-title">Trois façons d’exercer le métier.<em>Les mêmes journées trop courtes.</em></h2>',
    '</div>',
    '<p class="lead">Choisissez votre quotidien. Voici ce qui vous prend du temps et ce que la plateforme prend en charge.</p>',
    '</div>',

    '<div class="tabs" role="tablist" aria-label="Profils">',
    '<button class="tab" role="tab" id="t-ind" aria-controls="p-ind" aria-selected="true">',
    '<span class="name">Indépendants</span><span class="tag">Toute la chaîne, en solo</span></button>',
    '<button class="tab" role="tab" id="t-ag" aria-controls="p-ag" aria-selected="false" tabindex="-1">',
    '<span class="name">Agences RP</span><span class="tag">Plusieurs clients, une même exigence</span></button>',
    '<button class="tab" role="tab" id="t-eq" aria-controls="p-eq" aria-selected="false" tabindex="-1">',
    '<span class="name">Équipes communication</span><span class="tag">La presse, et tout le reste</span></button>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-ind" aria-labelledby="t-ind">',
    '<div class="intro"><h3>Vous êtes l’agence entière.<br>Sans l’équipe.</h3>',
    '<p class="scene"><b>Un lundi ordinaire</b><br>8 h, un communiqué à boucler pour un client tech. 11 h, des relances pour un autre, dans l’agroalimentaire. 16 h, le reporting du troisième. Et la prospection, quand&nbsp;?</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>Personne à qui déléguer</h4>',
    '<p>Premier jet, mise en forme, déclinaisons&nbsp;: sans junior, tout passe par vous. Même ce qui ne demande pas votre expertise.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Titres et accroches presse</span><span class="chip">Communiqué décliné en posts</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Les heures que personne ne paie</h4>',
    '<p>Votre forfait est fixe. Chaque heure passée à compiler une revue de presse ou à rédiger des relances grignote votre marge.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Revue de presse</span><span class="chip">Relance presse</span><span class="chip">Analyse de notoriété</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>Changer de client, changer de tête</h4>',
    '<p>D’un secteur à l’autre, il faut retrouver le contexte, le vocabulaire, le ton. Le brief est dans un mail, les éléments dans un autre.</p>',
    '<div class="fix"><span class="lbl">La plateforme organise</span><div class="chips"><span class="chip">Un espace par client</span><span class="chip">Prise de brief</span><span class="chip">Dépôt de vos documents</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>La plateforme prend la fabrication. Vous gardez le conseil, celui que vos clients vous paient.</p>',
    '<a class="cta" href="#prix">Voir l’offre Indépendant <small>59&nbsp;€/mois</small><span>↗</span></a></div>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-ag" aria-labelledby="t-ag" hidden>',
    '<div class="intro"><h3>Vos seniors réécrivent.<br>Vos marges fondent.</h3>',
    '<p class="scene"><b>Un jeudi ordinaire</b><br>L’appel d’offres tombe pour lundi. Le junior livre un premier communiqué, la directrice conseil le reprend à 22&nbsp;h. Pendant ce temps, un client attend son angle sur l’actu du jour.</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>La qualité dépend de qui tient le stylo</h4>',
    '<p>Entre un junior et un senior, l’écart se voit sur chaque livrable. Et c’est le senior qui le comble, en relecture, le soir.</p>',
    '<div class="fix"><span class="lbl">Un cadre commun pour l’équipe</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Dossier de presse</span><span class="chip">Questions / réponses presse</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Les recos qu’on ne facture pas</h4>',
    '<p>Appels d’offres, recommandations, propositions d’angles&nbsp;: un travail lourd, souvent gratuit, toujours urgent.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Prise de brief</span><span class="chip">Stratégie RP</span><span class="chip">Priorisation 80/20</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>L’actu n’attend pas le brief</h4>',
    '<p>Un sujet émerge, le client veut réagir. Il faut un angle, un texte et des relances dans l’heure, sans lâcher les autres comptes.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Rebond à chaud</span><span class="chip">Signaux faibles et risques</span><span class="chip">Relance presse</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>Un espace distinct par client, un cadre commun pour toute l’équipe. Vos seniors reviennent au conseil.</p>',
    '<a class="cta" href="#prix">Voir l’offre Agence <small>dès 99&nbsp;€/mois · 2 comptes</small><span>↗</span></a></div>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-eq" aria-labelledby="t-eq" hidden>',
    '<div class="intro"><h3>Les relations presse,<br>entre deux validations.</h3>',
    '<p class="scene"><b>Un mardi ordinaire</b><br>Le communiqué en est à sa version 7. Le directeur général donne une interview jeudi et n’a pas encore lu son brief. Le juridique a des remarques. Et le post LinkedIn attend depuis lundi.</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>Un périmètre qui déborde</h4>',
    '<p>Presse, interne, réseaux sociaux, événements&nbsp;: une petite équipe couvre tout. Les RP passent après l’urgence du jour.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Post LinkedIn</span><span class="chip">Communiqué décliné en posts</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Des porte-parole pressés</h4>',
    '<p>Vos dirigeants ont vingt minutes avant l’interview. Il leur faut l’essentiel&nbsp;: qui est le journaliste, les messages clés, les questions qui fâchent.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Fiche interlocuteur</span><span class="chip">Média training</span><span class="chip">Simulation d’appel</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>Des experts qui écrivent pour des experts</h4>',
    '<p>La note technique fait quarante pages. Le journaliste veut une idée forte, trois chiffres et un exemple.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Dossier de presse</span><span class="chip">Tribune et avis d’expert</span><span class="chip">Titres et accroches presse</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>Vos sujets, votre contexte et vos références internes dans la même plateforme. Moins d’allers-retours, des porte-parole mieux préparés.</p>',
    '<a class="cta" href="#prix">Parler de l’offre Entreprise <span>↗</span></a></div>',
    '</div>',

    '</div></div>'
  ].join("");

  /* CGU définitives transmises par Bruno le 17/11 — remplacent le premier
     jet qui vivait jusqu'ici dans LEGAL_CONTENT (voir plus bas) et qui
     n'avait plus aucun rapport avec les CGU réellement en vigueur côté app
     (app.assistant-rp.com/index.html, vueCGU()). Un seul texte de référence
     maintenant, recopié ici tel quel plutôt que chargé à distance : pas de
     dépendance réseau supplémentaire pour une popin. Injecté en remplaçant
     tout .legal-content (pas seulement les h3/p existants comme pour les
     deux autres popins) : il y a plus d'articles ici que la mise en page
     d'origine n'en prévoyait. .legal-modal défile déjà (overflow:auto),
     donc la longueur du texte ne casse rien. */
  var CGU_HTML = [
    '<section><h3>1. Éditeur et objet</h3><p>Assistant RP est une application accessible à l’adresse app.assistant-rp.com. Elle est éditée par <b>FABS PARTNERS</b>, société par actions simplifiée dont le siège social est situé au 47 rue Vivienne, 75002 Paris, immatriculée au RCS de Paris sous le numéro 132 151 747. Son SIRET est le 132 151 747 00012. Elle est désignée ci-après comme « l’Éditeur ».</p> <p>Les présentes conditions régissent la souscription et l’utilisation d’Assistant RP, ci-après « le Service ». Le Service est réservé à un usage professionnel ou institutionnel.</p> <p>Le « Client » est la personne physique ou morale qui souscrit le Service dans le cadre de son activité. L’« Utilisateur » est la personne physique à laquelle un compte nominatif est attribué. Le Client peut être lui-même Utilisateur.</p></section>',
    '<section><h3>2. Souscription et accès au compte</h3><p>Le Client prend connaissance des présentes conditions et les accepte avant la souscription. Chaque Utilisateur accepte les conditions d’utilisation lors de l’activation de son compte. En cas de divergence, les stipulations du devis ou du contrat accepté prévalent sur les présentes conditions pour les points qu’elles règlent.</p> <p>L’accès se fait sur invitation. Chaque compte est nominatif. L’Utilisateur protège ses identifiants et signale sans délai tout accès suspect à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>. Le Client informe l’Éditeur lorsqu’un Utilisateur doit perdre son accès, notamment à la suite d’un départ ou d’un changement de mission.</p></section>',
    '<section><h3>3. Description du Service</h3><p>Assistant RP assiste ses Utilisateurs dans leurs activités de relations presse. Selon la formule, il propose notamment des fonctions de rédaction de communiqués, tribunes et dossiers de presse, de veille, de préparation d’interviews, d’appui à la diffusion et de bilan de campagne.</p> <p>Le Service utilise un modèle d’intelligence artificielle fourni par un prestataire tiers. Les fonctionnalités, volumes et accès compris dans chaque offre sont précisés lors de la souscription ou dans le devis accepté.</p></section>',
    '<section><h3>4. Formules, tarifs et paiement</h3><p>Les formules standard (Freelance et Agence) sont proposées en abonnement mensuel, sans durée minimale au-delà du mois en cours, ou en abonnement annuel avec une remise de 12 %, engageant le Client pour une durée de douze mois à compter de la souscription.</p> <table style="width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:13.5px"><thead><tr><th style="text-align:left;padding:7px 10px;border-bottom:1px solid #ddded7">Formule</th><th style="text-align:left;padding:7px 10px;border-bottom:1px solid #ddded7">Tarif et accès inclus</th></tr></thead><tbody><tr><td style="padding:7px 10px;border-bottom:1px solid #ddded7;font-weight:600">Freelance</td><td style="padding:7px 10px;border-bottom:1px solid #ddded7">59 € par mois pour un compte nominatif</td></tr><tr><td style="padding:7px 10px;border-bottom:1px solid #ddded7;font-weight:600">Agence</td><td style="padding:7px 10px;border-bottom:1px solid #ddded7">99 € par mois pour deux comptes nominatifs, puis 29 € par mois par compte supplémentaire</td></tr><tr><td style="padding:7px 10px;font-weight:600">Service intégré</td><td style="padding:7px 10px">Sur devis pour les grandes entreprises et les institutions publiques</td></tr></tbody></table> <p>Les tarifs des formules standard sont exprimés en euros hors taxe. Les modalités de paiement et l’échéance sont communiquées avant la souscription. Une formule mensuelle se renouvelle chaque mois jusqu’à résiliation, selon l’article 5. Une formule annuelle se renouvelle par tacite reconduction pour une nouvelle période de douze mois, sauf résiliation par le Client avant la date de renouvellement, selon l’article 5.</p> <p>Sauf désaccord exprès du Client, un essai gratuit se transforme automatiquement en abonnement payant — mensuel ou annuel, selon le choix fait à la souscription — après la période d’essai de 7 jours. Annulable par le client via le bouton de son compte.</p> <p>Lorsque l’article L. 441-10 du Code de commerce s’applique, tout retard de paiement entraîne, dans les 10 jours qui suivent et sans rappel préalable, une suspension du service.</p> <p>Pour les offres sur devis, le prix, la durée, les modalités de paiement et les éventuelles conditions particulières de résiliation figurent dans le devis ou le contrat accepté. Les règles applicables à la commande publique prévalent lorsqu’elles s’imposent.</p></section>',
    '<section><h3>5. Arrêt de l’abonnement et accès aux documents</h3><p>Le Client peut résilier une formule standard à tout moment en accédant à la gestion de son abonnement depuis l’application, sans préavis minimal à respecter.</p> <p>Pour une formule mensuelle, la résiliation empêche le renouvellement du mois suivant : le mois en cours au moment de la demande reste dû et n’est pas remboursé au prorata. Pour une formule annuelle, la résiliation empêche le renouvellement à l’échéance des douze mois en cours : la période annuelle déjà engagée reste due jusqu’à son terme et n’est pas remboursée au prorata. Dans les deux cas, sous réserve des recours prévus à l’article 11 et des règles impératives applicables, aucune période suivante n’est facturée.</p> <p>Après la date d’effet de la résiliation, le compte n’est plus accessible, il est de la responsabilité du client de sauvegarder et exporter les documents qu’il juge utiles de conserver. Le Client peut demander la clôture définitive de son compte. La clôture, la restitution des documents et leur suppression suivent les modalités prévues à l’article 13.</p></section>',
    '<section><h3>6. Documents et informations transmis</h3><p>Le Client conserve les droits qu’il détient sur les textes, documents, briefs et autres éléments transmis. Il s’assure qu’il dispose des droits, autorisations et, lorsque nécessaire, du fondement juridique requis pour les transmettre et les traiter dans le Service. Cette obligation s’applique notamment aux documents de ses propres clients et aux coordonnées de journalistes.</p> <p>Le Client et ses Utilisateurs s’abstiennent de transmettre des données de santé, des informations bancaires, des identifiants confidentiels ou des documents couverts par un secret dont les règles excluent le recours aux prestataires du Service. Avant de déposer un document sous embargo, ils vérifient que ses conditions de confidentialité autorisent ce traitement.</p></section>',
    '<section><h3>7. Confidentialité</h3><p>L’Éditeur protège la confidentialité des documents transmis et des résultats enregistrés. Il limite leur accès aux personnes habilitées et aux prestataires dont l’intervention est nécessaire à la fourniture, à la sécurisation ou au support du Service. Ces personnes et prestataires sont soumis à des obligations de confidentialité adaptées à leur intervention. Les communications imposées par la loi restent possibles.</p> <p>Si l’Éditeur constate un accès ou une divulgation non autorisés affectant les documents du Client, il l’en informe sans délai injustifié. Il prend les mesures relevant de son périmètre pour contenir l’incident et communique les informations disponibles utiles à sa gestion.</p></section>',
    '<section><h3>8. Résultats générés et validation avant diffusion</h3><p>Les résultats d’Assistant RP sont des propositions de rédaction ou d’analyse. Ils peuvent contenir des erreurs, des omissions, des informations obsolètes ou des références inexistantes. L’Éditeur ne garantit aucune publication, retombée médiatique ou performance de campagne.</p> <p>Avant tout envoi, partage externe ou publication, le Client s’assure qu’une personne habilitée vérifie et valide le contenu final. Cette vérification porte notamment sur les faits, chiffres, noms, sources, citations, droits des tiers et embargos. Une citation attribuée à un porte-parole doit être vérifiée à la source ou approuvée par une personne habilitée.</p> <p>Le Client décide du contenu final, des destinataires et de la date de diffusion. Lorsqu’un module offre une fonction d’envoi ou de publication, l’Utilisateur vérifie le contenu et les destinataires avant de déclencher l’action.</p> <p>Sous réserve des droits des tiers, le Client peut utiliser, modifier et diffuser les résultats générés pour lui, y compris à des fins commerciales. L’Éditeur ne revendique aucun droit exclusif sur ces résultats. Des résultats similaires peuvent être générés pour d’autres utilisateurs.</p></section>',
    '<section><h3>9. Règles d’utilisation et droits sur le Service</h3><p>Le Client et les Utilisateurs s’engagent à utiliser le Service à des fins licites. Ils s’abstiennent notamment de partager ou revendre un accès, de contourner une mesure de sécurité, d’accéder au compte ou aux documents d’un tiers, de procéder à des extractions abusives ou d’utiliser le Service pour diffuser des contenus illicites.</p> <p>L’Éditeur et ses concédants conservent leurs droits sur le logiciel, son interface et les éléments qui composent le Service. La souscription donne un droit d’accès et d’usage dans les limites de l’offre choisie.</p></section>',
    '<section><h3>10. Disponibilité, maintenance et signalement</h3><p>L’Éditeur met en œuvre des moyens raisonnables pour assurer la disponibilité et la sécurité du Service. Des interruptions peuvent survenir, notamment lors d’une maintenance ou d’un incident affectant un prestataire technique. L’Éditeur informe le Client à l’avance des maintenances programmées susceptibles d’affecter sensiblement son accès, lorsque les circonstances le permettent.</p> <p>Le Client peut signaler une erreur de génération, une indisponibilité ou un incident de diffusion à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>. L’Éditeur examine le signalement. Lorsqu’un dysfonctionnement est identifié, il met en œuvre des mesures raisonnables pour le corriger ou proposer une solution de contournement. Si un contenu erroné a déjà été diffusé, le Client décide des corrections ou demandes de retrait qui relèvent de lui.</p></section>',
    '<section><h3>11. Défaillance du Service et responsabilité</h3><p>Il est à la charge du client de valider que son infrastructure technique et ses règles techniques lui permettent bien d’utiliser le service dans les meilleures conditions sans entraver le bon fonctionnement de l’application. Si une fonctionnalité essentielle de l’offre payante reste inutilisable et qu’aucune solution équivalente n’est proposée dans un délai raisonnable après mise en demeure, le Client peut résilier l’abonnement concerné. L’Éditeur rembourse au prorata la période payée restant à courir à la date d’effet de la résiliation. Les autres recours prévus par la loi demeurent applicables.</p> <p>Chaque partie répond des dommages directs, certains et justifiés causés par ses manquements. Lorsqu’un défaut de vérification ou une diffusion contraire aux présentes conditions a contribué au dommage, il en est tenu compte à proportion de sa contribution.</p></section>',
    '<section><h3>12. Suspension de l’accès</h3><p>En cas de manquement, l’Éditeur informe le Client des faits reprochés et lui accorde un délai adapté pour y remédier. Si le manquement persiste, l’Éditeur peut suspendre l’accès concerné ou, en cas de manquement suffisamment grave, résilier le contrat dans les conditions prévues par la loi.</p> <p>L’Éditeur peut suspendre immédiatement l’accès si une mesure urgente est nécessaire pour protéger les données ou la sécurité du Service, ou pour satisfaire à une obligation légale. La suspension est limitée à ce qui est nécessaire. L’Éditeur en informe le Client dès que les circonstances le permettent.</p></section>',
    '<section><h3>13. Données personnelles et fin d’accès</h3><p>La politique de confidentialité décrit les traitements de données personnelles, leurs finalités, les destinataires, les durées de conservation et les modalités d’exercice des droits. Lorsque l’Éditeur traite des données personnelles pour le compte du Client, un accord de sous-traitance précise les conditions de ce traitement conformément à l’article 28 du RGPD.</p> <p>Le Client peut demander la suppression de ses données à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>. La clôture définitive met fin à l’accès au compte, sous réserve des modalités de restitution applicables et des obligations légales de conservation.</p></section>',
    '<section><h3>14. Modification des conditions et des tarifs</h3><p>L’Éditeur informe le Client de toute modification substantielle des conditions ou des tarifs avant son entrée en vigueur. Les offres sur devis suivent les règles de modification prévues dans le contrat applicable.</p></section>',
    '<section><h3>15. Droit applicable, litiges et contact</h3><p>Les présentes conditions sont soumises au droit français. En cas de différend, les parties peuvent rechercher une solution amiable. Cette démarche ne fait pas obstacle aux mesures urgentes ni au respect des délais applicables.</p> <p>La juridiction compétente est déterminée selon les règles légales applicables, y compris celles qui régissent les contrats administratifs.</p> <p>Les demandes relatives au Service ou aux présentes conditions sont à adresser à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>.</p></section>',
  ].join("");

  /* Mentions légales et « Confidentialité » — texte définitif transmis par
     Bruno le 17/11, qui remplace le premier jet (LEGAL_CONTENT, qui vivait
     ici avant et qui citait un président et un capital social inventés).
     Même mécanique que CGU_HTML au-dessus : remplacement intégral de
     .legal-content, recopié ici tel quel (pas de dépendance réseau).
     Le capital social reste un placeholder visible — Bruno l'a lui-même
     laissé entre crochets dans son texte, donc pas de montant inventé ici
     non plus. Le lien vers les CGU dans "Accès à l'application" utilise la
     vraie adresse publique (assistant-rp.com/#cgu) et non
     app.assistant-rp.com/cgu, qui n'existe pas (voir patchOuvrirDepuisHash
     plus bas pour le mécanisme de cette ancre). "Confidentialité" reprend
     le texte "Ce que deviennent vos données" de Bruno, identique à
     vueDonnees() côté app (index.html) — un seul texte de référence pour
     les deux. */
  var MENTIONS_HTML = [
    '<section><h3>Éditeur</h3><p>L’application app.assistant-rp.com est éditée par <b>FABS PARTNERS</b>, société par actions simplifiée au capital de <span style="color:#b34700;font-weight:600">[montant à préciser]</span> €, dont le siège social est situé au 47 rue Vivienne, 75002 Paris, France. La société est immatriculée au RCS de Paris sous le numéro 132 151 747. Son SIRET est le 132 151 747 00012.</p></section>',
    '<section><h3>Contact et publication</h3><p>Contact de l’éditeur — <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>. Directeur de la publication — Augustin Garcia. Hébergeur — Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, États-Unis.</p></section>',
    '<section><h3>Accès à l’application</h3><p>L’accès à l’application est réservé aux titulaires d’un compte nominatif. Les conditions générales d’utilisation et de vente sont accessibles sur <a href="/#cgu">assistant-rp.com/#cgu</a>.</p></section>',
    '<section><h3>Propriété intellectuelle</h3><p>L’ensemble des contenus présents sur ce site (textes, visuels, logos, structure, code) est, sauf mention contraire, la propriété de FABS PARTNERS ou de ses partenaires, et protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou réutilisation, totale ou partielle, sans autorisation écrite préalable, est interdite.</p></section>',
  ].join("");

  var DONNEES_HTML = [
    '<section><h3>Qui traite vos données et pourquoi</h3><p>FABS PARTNERS est responsable des traitements nécessaires à la gestion des comptes, au support, à la sécurité de l’application, à la gestion des abonnements et à la facturation. Les données concernées comprennent les informations d’identification et de contact professionnel, les données de compte et d’abonnement, les informations de facturation et les données techniques nécessaires à la sécurité.</p> <p>Si vous souscrivez en votre nom, la gestion du compte et de l’abonnement repose sur l’exécution du contrat. Si votre organisation vous attribue un accès, la gestion du compte repose sur l’intérêt légitime de FABS PARTNERS à fournir le service convenu avec votre organisation. Le support et la sécurité reposent sur l’intérêt légitime d’assurer le fonctionnement du service et de protéger les comptes. La conservation des factures répond à une obligation légale. Les informations signalées comme obligatoires sont nécessaires à la création du compte ou à la gestion de l’abonnement, selon le cas.</p> <p>Lorsque FABS PARTNERS traite des données personnelles contenues dans les briefs et documents pour le compte d’un client, elle agit sur ses instructions, en qualité de sous-traitant, conformément à l’accord prévu à l’article 28 du RGPD.</p></section>',
    '<section><h3>Ce qui est transmis au prestataire d’IA</h3><p>Lorsque vous lancez une génération, Assistant RP transmet au fournisseur du modèle le contenu du brief et le texte extrait des documents de référence utilisés pour la demande. L’extraction a lieu dans votre navigateur. Le fichier d’origine reste sur votre appareil. Le texte extrait est transmis et peut contenir des données personnelles ou des informations confidentielles.</p> <p>Pour les générations effectuées avec l’API commerciale d’Anthropic, ce prestataire indique que les données transmises et les résultats générés ne sont pas utilisés par défaut pour entraîner ses modèles. Selon ses conditions standard, Anthropic supprime les entrées et les sorties sous 30 jours, sauf exceptions prévues, notamment pour respecter la loi ou appliquer sa politique d’utilisation. L’option de conservation nulle n’est pas activée pour Assistant RP.</p></section>',
    '<section><h3>Paiements et abonnements</h3><p>Stripe traite les paiements et les renouvellements d’abonnement. Les informations de carte saisies dans le parcours de paiement Stripe sont traitées par Stripe. FABS PARTNERS reçoit les informations nécessaires à la gestion de l’abonnement et à la facturation, notamment le montant, le statut du paiement et sa référence. Stripe décrit le traitement de ces données dans sa politique de confidentialité.</p></section>',
    '<section><h3>Hébergement et transferts internationaux</h3><p>Les données de compte, les historiques et les bases documentaires sont hébergés chez Netlify aux États-Unis, selon la configuration d’Assistant RP. Les échanges avec l’application sont chiffrés en transit. Des administrateurs habilités disposent d’un accès technique pour l’exploitation, la sécurité et le support.</p> <p>Les requêtes de génération utilisent un routage mondial. Assistant RP ne garantit pas un traitement exclusivement dans l’Union européenne.</p> <p>Certains traitements impliquent des transferts de données personnelles hors de l’Espace économique européen. Vous pouvez demander des précisions ou une copie des garanties applicables à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>.</p></section>',
    '<section><h3>Conservation et suppression</h3><p>Vous pouvez supprimer une production, un document ou un projet depuis l’application. À la date d’effet de la résiliation, l’accès au compte et aux documents prend fin. Exportez avant cette date les documents que vous souhaitez conserver. Les droits légaux ou contractuels de restitution restent applicables.</p> <p>Après la fermeture du compte, les documents sont supprimés de l’espace actif le lendemain, sous réserve des obligations légales ou contractuelles de restitution ou de conservation. Les durées applicables aux autres données de compte, aux journaux techniques et aux éventuelles sauvegardes sont de 15 jours. Les factures sont conservées pendant dix ans. Les données déjà transmises au fournisseur d’IA suivent les durées de conservation précisées ci-dessus.</p></section>',
    '<section><h3>Cookies et mesure d’audience</h3><p>Le cookie de session maintient votre connexion pendant douze heures. Le panneau de gestion des cookies mémorise vos préférences.</p> <p>PostHog mesure, avec votre consentement, les contenus consultés et les étapes d’utilisation sur le site et dans l’application. Après connexion, les événements de navigation et d’utilisation peuvent être associés à votre compte pour analyser l’activation et la souscription. Cette mesure s’effectue sans enregistrement vidéo de session ni collecte du contenu de vos briefs, prompts ou documents.</p> <p>Vous pouvez refuser cette mesure ou retirer votre consentement à tout moment dans le panneau de gestion des cookies. Les durées de conservation de vos choix et des données de mesure d’audience sont de 12 mois.</p></section>',
    '<section><h3>Vos droits</h3><p>Selon le traitement, vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement ou leur portabilité. Vous pouvez vous opposer à un traitement fondé sur un intérêt légitime ou retirer votre consentement à tout moment.</p> <p>Adressez votre demande à <a href="mailto:contact@assistant-rp.com">contact@assistant-rp.com</a>. Si elle concerne des données confiées par une organisation cliente qui en est responsable, adressez-vous à cette organisation. FABS PARTNERS l’assiste conformément à l’accord de sous-traitance. Vous pouvez également déposer une réclamation auprès de la CNIL.</p></section>',
    '<section><h3>Avant de déposer un document</h3><p>Limitez les informations transmises à ce qui est nécessaire à votre demande. Pour un document sous embargo ou couvert par un accord de confidentialité, vérifiez que vos engagements autorisent la transmission de son texte à un prestataire externe. En cas de doute, utilisez une version expurgée ou travaillez sans document de référence.</p></section>',
  ].join("");

  // Les trois popins (CGU, Mentions légales, Confidentialité) utilisent
  // désormais toutes le même mécanisme : remplacement intégral de
  // .legal-content plutôt que la boucle h3/p sur des <section> déjà en
  // place (LEGAL_CONTENT et son découpage par paires [titre, texte] sont
  // devenus obsolètes le 17/11 et ont été retirés).
  var WHOLESALE_HTML = {
    "Conditions générales d’utilisation": CGU_HTML,
    "Mentions légales": MENTIONS_HTML,
    "Confidentialité": DONNEES_HTML
  };

  function patchLegalContent() {
    var titre = document.getElementById("legal-title");
    if (!titre) return false;
    var libelle = titre.textContent.trim();
    var corps = titre.closest(".legal-content");
    if (!corps || corps.getAttribute("data-legal-patched") === "1") return false;

    var html = WHOLESALE_HTML[libelle];
    if (!html) return false;
    corps.innerHTML = html;
    corps.setAttribute("data-legal-patched", "1");
    return true;
  }

  // Bug signalé (3/11) : "Confidentialité" ne fait rien quand on y arrive
  // par un lien externe. Cause : les mentions légales ne sont qu'un état
  // React ouvert au clic (onClick:()=>o("confidentialite")) — il n'existe
  // aucune vraie ancre #confidentialite dans la page, donc /#confidentialite
  // (utilisé par le bandeau de cookies comme lien "Politique de
  // confidentialité", et par le pied de page du blog) ne fait que recharger
  // l'accueil sans rien ouvrir. Plutôt que de modifier main.js, on détecte le
  // hash au chargement et on déclenche un vrai clic sur le bon bouton du pied
  // de page : React reçoit l'évènement comme si l'utilisateur avait cliqué.
  var HASH_VERS_LIBELLE = {
    "#mentions": "Mentions légales",
    "#confidentialite": "Confidentialité",
    "#cgu": "Conditions générales d’utilisation"
  };

  function patchOuvrirDepuisHash() {
    if (document.documentElement.getAttribute("data-hash-legal-done") === "1") return false;
    var libelle = HASH_VERS_LIBELLE[location.hash];
    if (!libelle) return false;
    var boutons = document.querySelectorAll("footer button.legal-link");
    var cible = null;
    for (var i = 0; i < boutons.length; i++) {
      if (boutons[i].textContent.trim() === libelle) { cible = boutons[i]; break; }
    }
    if (!cible) return false; // pied de page pas encore monté : on retente au prochain passage
    document.documentElement.setAttribute("data-hash-legal-done", "1");
    cible.click();
    return true;
  }

  // Bug signalé (7/11) : cliquer le logo (lien vers #top) depuis le bas de
  // la page ne remonte pas en haut, sur Firefox. Même cause que le bug
  // "Confidentialité" ci-dessus : #top ne correspond à aucune vraie ancre
  // du DOM. React gère #apercu/#modules/#prix par un clic interne qui
  // défile vers la bonne section ; le logo, lui, s'appuie sur la
  // navigation native du navigateur vers un fragment qui n'existe nulle
  // part, ce que les moteurs ne traitent pas tous pareil. On intercepte le
  // clic et on force le défilement, sans toucher à main.js.
  function patchLogoScrollTop() {
    if (document.documentElement.getAttribute("data-top-patched") === "1") return false;
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href="#top"], a[href="/#top"]');
      if (!a) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.pushState) history.pushState(null, "", location.pathname);
    });
    document.documentElement.setAttribute("data-top-patched", "1");
    return true;
  }

  // Bug signalé (13/11) : les boutons qui mènent à la création de compte
  // ("Créer un compte" en navigation et en pied de page, "Choisir
  // Freelance", "Choisir Agence") pointent tous vers la racine de l'appli
  // (https://app.assistant-rp.com/), qui affiche l'écran de connexion — pas
  // vers /__souscrire. Cause : main.js n'a qu'une seule constante d'URL
  // (oI) partagée par ces boutons ET par "Se connecter", donc on ne peut
  // pas la corriger sans casser "Se connecter". On repère les boutons par
  // leur texte visible (comme patchCtaTracking le fait déjà) et on
  // réécrit leur href, sans toucher à main.js. "Demander une démo" et
  // "Nous consulter" (mailto) ne sont pas dans la liste : ils doivent
  // rester tels quels.
  var LIBELLES_SOUSCRIPTION = ["Créer un compte", "Choisir Freelance", "Choisir Agence"];
  var URL_SOUSCRIRE = "https://app.assistant-rp.com/__souscrire";

  function patchLiensSouscription() {
    var changed = false;
    var liens = document.querySelectorAll("a.button");
    for (var i = 0; i < liens.length; i++) {
      var a = liens[i];
      var texte = (a.textContent || "").trim();
      if (LIBELLES_SOUSCRIPTION.indexOf(texte) === -1) continue;
      if (a.getAttribute("href") === URL_SOUSCRIRE) continue;
      a.setAttribute("href", URL_SOUSCRIRE);
      changed = true;
    }
    return changed;
  }

  var FAQ_EXTRA = [
    {
      q: "Un engagement annuel est-il proposé&nbsp;?",
      a: "Facturation mensuelle sans durée minimale, ou annuelle avec 12&nbsp;% de remise."
    },
    {
      q: "Une offre existe-t-elle pour les grandes entreprises&nbsp;?",
      a: "Oui, l’offre Entreprise, sur devis&nbsp;: un service RP intégré à votre échelle, un accompagnement sur mesure."
    }
  ];

  function patchCibles() {
    var promise = document.querySelector(".promise");
    if (!promise || promise.querySelector(".cibles-embed")) return false;
    promise.innerHTML = CIBLES_HTML;
    wireTabs(promise);
    return true;
  }

  function wireTabs(scope) {
    var tabs = Array.prototype.slice.call(scope.querySelectorAll('[role="tab"]'));
    function select(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute("aria-controls"));
        if (!p) return;
        p.hidden = !on;
        if (on) {
          p.classList.remove("enter");
          void p.offsetWidth;
          p.classList.add("enter");
        }
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          var n = tabs[(i + d + tabs.length) % tabs.length];
          n.focus();
          select(n);
        }
      });
    });
  }

  function patchFaq() {
    var faqSection = document.querySelector("section.faq");
    if (!faqSection) return false;
    var list = faqSection.querySelector("div");
    if (!list || list.getAttribute("data-patched") === "1") return false;
    FAQ_EXTRA.forEach(function (item) {
      var d = document.createElement("details");
      var summary = document.createElement("summary");
      summary.innerHTML = item.q + ICON_PLUS;
      var p = document.createElement("p");
      p.innerHTML = item.a;
      d.appendChild(summary);
      d.appendChild(p);
      list.appendChild(d);
    });
    list.setAttribute("data-patched", "1");
    return true;
  }

  /* ------------------------------------------------------------------
     Mission de tracking v2.1 (lot A) : pageview + cta_clicked.
     Rien ici ne dépend de assistant-rp-tracking.js pour fonctionner sans
     lui — window.arpAnalytics est simplement absent tant que le script
     n'a pas chargé, et chaque appel est gardé en conséquence.
     ------------------------------------------------------------------ */

  function patchPageview() {
    if (document.documentElement.getAttribute("data-pv-patched") === "1") return false;
    if (!window.arpAnalytics) return false;
    // Même bundle, deux pages statiques : on les distingue par le chemin,
    // comme le fait déjà main.js lui-même pour choisir quoi rendre.
    var surAtelier = location.pathname === "/atelier.html";
    window.arpAnalytics.page({
      content_id: surAtelier ? "atelier" : "accueil",
      content_type: "page",
      content_theme: surAtelier ? "interne" : "produit"
    });
    document.documentElement.setAttribute("data-pv-patched", "1");
    return true;
  }

  // Un identifiant technique dérivé du texte visible du bouton/lien, pas un
  // libellé marketing à maintenir à la main : il suit le bouton si son texte
  // change, sans qu'il faille revenir ici.
  function ctaId(el) {
    var texte = (el.textContent || "").trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
    return texte || "cta";
  }

  // La section englobante donne la position sans qu'il faille lister à la
  // main chaque emplacement de bouton — robuste à une réorganisation de la
  // page tant que les sections gardent un nom de classe.
  function ctaPosition(el) {
    var conteneur = el.closest("header, footer, section[class], .cibles-embed, .hero-cta, .final-cta");
    if (!conteneur) return "non_classe";
    var tag = conteneur.tagName;
    if (tag === "HEADER") return "navigation";
    if (tag === "FOOTER") return "pied_de_page";
    var premiere = (conteneur.className || "").toString().trim().split(/\s+/)[0];
    return premiere || "non_classe";
  }

  function patchCtaTracking() {
    if (document.documentElement.getAttribute("data-cta-patched") === "1") return false;
    // Un seul écouteur délégué, posé une fois pour toute la vie de la page :
    // il couvre aussi les boutons injectés plus tard (patchCibles, FAQ...).
    document.addEventListener("click", function (e) {
      if (!window.arpAnalytics) return;
      var el = e.target.closest(".login, .nav-signup, .button-citron, .button, .cta");
      if (!el) return;
      window.arpAnalytics.capture("cta_clicked", {
        cta_id: ctaId(el),
        position: ctaPosition(el)
      });
    }, true);
    document.documentElement.setAttribute("data-cta-patched", "1");
    return true;
  }

  function patchBlogNavLink() {
    var navLinks = document.querySelector(".nav-links");
    if (!navLinks || navLinks.querySelector('a[href="/blog/"]')) return false;
    var a = document.createElement("a");
    a.href = "/blog/";
    a.textContent = "Blog";
    navLinks.appendChild(a);
    return true;
  }

  // Mission de tracking v2.1 (§5.1) : « Gérer mes cookies » sur le site aussi
  // (déjà posé côté blog, dans base.njk). Le pied de page React n'a pas de
  // sélecteur dédié : on repère le groupe de liens légaux par la classe des
  // boutons qu'il contient déjà, et on y glisse un bouton de plus, au même
  // gabarit — sans toucher à main.js.
  function patchCookiesFooter() {
    var legal = document.querySelector("footer .legal-link");
    if (!legal) return false;
    var groupe = legal.parentElement;
    if (groupe.querySelector(".legal-link-cookies")) return false;
    var btn = document.createElement("button");
    btn.className = "legal-link legal-link-cookies";
    btn.type = "button";
    btn.textContent = "Gérer mes cookies";
    btn.onclick = function () {
      if (window.tarteaucitron && window.tarteaucitron.userInterface) {
        window.tarteaucitron.userInterface.openPanel();
      }
    };
    var contact = groupe.querySelector('a[href^="mailto:"]');
    groupe.insertBefore(btn, contact || null);
    return true;
  }

  // Demande de Bruno (17/11) : retirer le bandeau "En complément" (le livre
  // aux Éditions Kawa) — un article de blog couvre déjà le sujet. Le bloc a
  // un id stable (#pour-aller-plus-loin), repéré en inspectant la page en
  // ligne plutôt que deviné : plus sûr qu'un couplage au texte visible, qui
  // changerait si le livre ou la mise en avant changent. On masque plutôt
  // que de supprimer, pour pouvoir le faire réapparaître d'un coup en CSS.
  function patchMasquerLivre() {
    var bandeau = document.getElementById("pour-aller-plus-loin");
    if (!bandeau || bandeau.style.display === "none") return false;
    bandeau.style.display = "none";
    return true;
  }

  // Demande de Bruno (17/11) : intégrer les deux comptes créés pour
  // Assistant-RP — LinkedIn (présence/crédibilité, discrète) et YouTube (les
  // tutos produit, qui méritent mieux qu'une icône qu'on ne clique jamais).
  // Pictos passés en revue : Lucide (déjà utilisé ailleurs sur le site pour
  // la flèche et le menu) ne couvre pas les logos de marque. Récupérés sur
  // Font Awesome Free (licence CC BY 4.0, usage libre) à la place — glyphes
  // pleins "currentColor", cohérents avec l'esprit du reste du site.
  var ICON_LINKEDIN = '<svg viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"/></svg>';
  var ICON_YOUTUBE = '<svg viewBox="0 0 576 512" aria-hidden="true"><path fill="currentColor" d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"/></svg>';

  // Icônes dans le footer, à côté du logo/copyright (pas mélangées aux liens
  // légaux de droite) : présence de base, cohérente sur toutes les pages.
  function patchFooterSocial() {
    var brand = document.querySelector("footer .brand");
    if (!brand) return false;
    var groupe = brand.parentElement;
    if (!groupe || groupe.querySelector(".footer-social")) return false;
    if (!document.getElementById("footer-social-style")) {
      var style = document.createElement("style");
      style.id = "footer-social-style";
      style.textContent = ".footer-social{display:inline-flex;align-items:center;gap:12px;margin-left:4px}" +
        ".footer-social a{display:inline-flex;color:var(--secondary,#60615b)}" +
        ".footer-social a:hover{color:var(--ink,#1a1a1a)}" +
        ".footer-social svg{width:20px;height:20px}";
      document.head.appendChild(style);
    }
    var conteneur = document.createElement("span");
    conteneur.className = "footer-social";
    conteneur.innerHTML =
      '<a href="https://www.linkedin.com/company/assistant-rp/" target="_blank" rel="noopener noreferrer" aria-label="Assistant-RP sur LinkedIn">' + ICON_LINKEDIN + '</a>' +
      '<a href="https://www.youtube.com/@assistant-rp" target="_blank" rel="noopener noreferrer" aria-label="Assistant-RP sur YouTube">' + ICON_YOUTUBE + '</a>';
    groupe.appendChild(conteneur);
    return true;
  }

  // Bandeau "Nos tutos en vidéo" sur le blog seulement (pas le footer tout
  // seul : une icône en pied de page ne fait cliquer personne). Repris du
  // même habillage que #pour-aller-plus-loin (masqué plus haut) — classes
  // .book-banner déjà stylées, juste le contenu change. Inséré juste avant
  // le footer, comme l'était le bandeau livre.
  function patchBannerTutos() {
    if (location.pathname.indexOf("/blog") !== 0) return false;
    if (document.getElementById("tutos-video-banner")) return false;
    var footer = document.querySelector("footer");
    if (!footer || !footer.parentElement) return false;
    var bandeau = document.createElement("aside");
    bandeau.id = "tutos-video-banner";
    bandeau.className = "book-banner";
    bandeau.setAttribute("aria-label", "Ressource complémentaire");
    bandeau.innerHTML =
      '<div class="wrap book-banner-row">' +
      '<span class="book-banner-cover" aria-hidden="true" style="display:flex;align-items:center;justify-content:center;height:34px;color:#FF0000;box-shadow:none">' + ICON_YOUTUBE.replace('viewBox="0 0 576 512"', 'viewBox="0 0 576 512" width="26" height="23"') + '</span>' +
      '<p><strong>Envie de voir plutôt que de lire&nbsp;? — </strong>nos tutos pour prendre en main Assistant RP sont sur notre chaîne YouTube.</p>' +
      '<a class="book-banner-link" href="https://www.youtube.com/@assistant-rp" target="_blank" rel="noopener noreferrer">Voir les tutos <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>' +
      '</div>';
    footer.parentElement.insertBefore(bandeau, footer);
    return true;
  }

  function runAll() {
    patchCibles();
    patchFaq();
    patchBlogNavLink();
    patchCookiesFooter();
    patchLegalContent();
    patchOuvrirDepuisHash();
    patchLogoScrollTop();
    patchLiensSouscription();
    patchPageview();
    patchCtaTracking();
    patchMasquerLivre();
    patchFooterSocial();
    patchBannerTutos();
  }

  // Le site est une SPA React : le contenu n'existe pas encore au chargement du script.
  // On observe le montage puis on réapplique si React re-rend ces zones.
  var root = document.getElementById("root") || document.body;
  var observer = new MutationObserver(function () {
    runAll();
  });
  observer.observe(root, { childList: true, subtree: true });

  runAll();
  // Filet de sécurité : si l'observer rate quelque chose (hydratation tardive), on retente.
  [300, 800, 1500, 3000].forEach(function (ms) {
    setTimeout(runAll, ms);
  });
})();
