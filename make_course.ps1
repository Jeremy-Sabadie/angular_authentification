
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$doc.PageSetup.LeftMargin = 56.7
$doc.PageSetup.RightMargin = 56.7
$doc.PageSetup.TopMargin = 56.7
$doc.PageSetup.BottomMargin = 56.7
$sel = $word.Selection

function SetFont($sel, $name, $size, $bold, $color) {
    $sel.Font.Name = $name; $sel.Font.Size = $size; $sel.Font.Bold = $bold; $sel.Font.Color = $color
}
function AddH1($sel, $text) {
    $sel.TypeParagraph()
    $sel.ParagraphFormat.SpaceBefore = 12; $sel.ParagraphFormat.SpaceAfter = 4
    SetFont $sel "Calibri Light" 18 $true 0x2F4F8F
    $sel.TypeText($text); $sel.TypeParagraph()
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 5
}
function AddH2($sel, $text) {
    $sel.ParagraphFormat.SpaceBefore = 8; $sel.ParagraphFormat.SpaceAfter = 3
    SetFont $sel "Calibri" 13 $true 0x1F5F8F
    $sel.TypeText($text); $sel.TypeParagraph()
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 4
}
function AddPara($sel, $text) {
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 4
    $sel.TypeText($text); $sel.TypeParagraph()
}
function AddBullet($sel, $text) {
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 2
    $sel.ParagraphFormat.LeftIndent = 28
    $sel.TypeText([char]0x2022 + "  " + $text); $sel.TypeParagraph()
    $sel.ParagraphFormat.LeftIndent = 0
}
function AddNote($sel, $text) {
    $sel.ParagraphFormat.SpaceBefore = 2; $sel.ParagraphFormat.SpaceAfter = 5
    $sel.ParagraphFormat.LeftIndent = 14
    SetFont $sel "Calibri" 10 $false 0x555555
    $sel.Font.Italic = $true
    $sel.TypeText([char]0x2139 + "  " + $text); $sel.TypeParagraph()
    $sel.Font.Italic = $false; $sel.ParagraphFormat.LeftIndent = 0
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 4
}
function AddCode($sel, $code) {
    $sel.ParagraphFormat.SpaceBefore = 2; $sel.ParagraphFormat.SpaceAfter = 5
    $sel.ParagraphFormat.LeftIndent = 14
    $sel.Font.Name = "Courier New"; $sel.Font.Size = 9; $sel.Font.Color = 0x1A1A1A
    try { $sel.Shading.BackgroundPatternColor = 0xF5F5F5 } catch {}
    $lines = $code -split "`n"
    for ($li = 0; $li -lt $lines.Count; $li++) {
        $sel.TypeText($lines[$li])
        if ($li -lt $lines.Count - 1) { $sel.TypeParagraph() }
    }
    $sel.TypeParagraph()
    try { $sel.Shading.BackgroundPatternColor = -1 } catch {}
    $sel.ParagraphFormat.LeftIndent = 0
    SetFont $sel "Calibri" 11 $false 0x000000
    $sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 4
}
function AddPageBreak($sel) { $sel.InsertBreak(7) }

# ── PAGE DE TITRE ─────────────────────────────────────────────────────────────
$sel.ParagraphFormat.SpaceBefore = 50; $sel.ParagraphFormat.SpaceAfter = 6
SetFont $sel "Calibri Light" 28 $true 0x2F4F8F
$sel.TypeText("Cours de renforcement"); $sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 0
SetFont $sel "Calibri Light" 22 $false 0x1F6F8F
$sel.TypeText("TP Authentification Angular"); $sel.TypeParagraph()
SetFont $sel "Calibri" 12 $false 0x888888
$sel.TypeText("Concepts developpement, architecture et tests  -  reference projet authentificationTP"); $sel.TypeParagraph()
$sel.TypeParagraph()
SetFont $sel "Calibri" 10 $false 0xAAAAAA
$sel.TypeText("Version 1.0  -  Mai 2026  -  Angular 17+  -  TypeScript  -  Playwright  -  Docker  -  GitHub Actions"); $sel.TypeParagraph()
AddPageBreak $sel

# ── 1. VUE D'ENSEMBLE ─────────────────────────────────────────────────────────
AddH1 $sel "1. Vue d'ensemble du projet"
AddPara $sel "Ce TP implemente une SPA (Single Page Application) Angular couvrant l'authentification d'un utilisateur et un tableau de bord CRUD de materiels. L'ensemble est automatiquement teste via une pipeline CI GitHub Actions basee sur Docker."
AddPara $sel "Architecture globale :"
AddBullet $sel "Frontend : Angular 17+ compile en production, servi par nginx"
AddBullet $sel "Backend mock : json-server expose une API REST depuis db.json"
AddBullet $sel "Tests : Playwright E2E (Chromium) dans un conteneur Docker dedie"
AddBullet $sel "CI : GitHub Actions orchestre Docker Compose pour builder, demarrer et tester"

AddH2 $sel "Structure des fichiers cles"
AddCode $sel @"
src/
  app/
    app.config.ts           # bootstrap standalone (sans NgModule)
    app.routes.ts           # declaration des routes + guards
    auth.guard.ts           # guard fonctionnel CanActivateFn
    auth-service.service.ts # login via HTTP
    smateriels.service.ts   # CRUD materiels via HTTP
    login-form/             # composant standalone login
    dashboard/              # composant standalone dashboard CRUD
  environments/
    environment.ts          # apiUrl dev (localhost:3000)
    environment.prod.ts     # apiUrl prod (/api)
tests/
  login.spec.ts             # tests Playwright authentification
  auth.guard.spec.ts        # tests protection des routes
  fixtures/auth.fixture.ts  # fixture Playwright loggedInPage
  utils/auth.ts             # helper login reutilisable
"@
AddPageBreak $sel

# ── 2. ANGULAR STANDALONE ─────────────────────────────────────────────────────
AddH1 $sel "2. Angular 17+ - Architecture Standalone"
AddH2 $sel "2.1 Fin des NgModule"
AddPara $sel "Depuis Angular 17, le modele Standalone supprime l'obligation de declarer chaque composant dans un NgModule. Chaque composant declare ses propres imports directement."
AddCode $sel @"
@Component({
  selector: 'app-login-form',
  standalone: true,                             // marque standalone
  imports: [CommonModule, ReactiveFormsModule], // imports directs
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent { }
"@
AddNote $sel "standalone: true remplace NgModule. Les modules partages (CommonModule, ReactiveFormsModule...) sont importes directement dans le composant qui en a besoin."

AddH2 $sel "2.2 Bootstrap via app.config.ts"
AddPara $sel "La configuration de l'application passe par un objet ApplicationConfig a la place d'un AppModule :"
AddCode $sel @"
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideHttpClient(), provideAnimations()... selon les besoins
  ],
};

// main.ts
bootstrapApplication(AppComponent, appConfig);
"@

AddH2 $sel "2.3 Injection de dependances avec inject()"
AddPara $sel "La fonction inject() (Angular 14+) remplace l'injection par constructeur. Elle est utilisee partout dans ce TP :"
AddCode $sel @"
// Ancienne syntaxe (constructeur)
constructor(private http: HttpClient, private router: Router) {}

// Nouvelle syntaxe (inject) - plus lisible, plus testable
private http   = inject(HttpClient);
private router = inject(Router);
private fb     = inject(FormBuilder);
"@
AddNote $sel "inject() doit etre appele dans un contexte d'injection (constructeur, champ de classe, factory). Il simplifie les tests unitaires car les dependances peuvent etre mockees sans 'new Component(dep1, dep2...)'."

AddH2 $sel "2.4 Cycle de vie - ngOnInit"
AddCode $sel @"
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    this.loadMateriels();  // appel HTTP au demarrage
  }
}
"@
AddNote $sel "Ne jamais faire d'appels HTTP dans le constructeur. Le constructeur est reserve a l'initialisation synchrone (inject, FormBuilder...). ngOnInit est le bon endroit pour les effets de bord."
AddPageBreak $sel

# ── 3. ROUTING ────────────────────────────────────────────────────────────────
AddH1 $sel "3. Routing Angular"
AddH2 $sel "3.1 Declaration des routes"
AddCode $sel @"
export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    loadComponent: () => import('./login-form/...') },
  { path: 'dashboard',
    loadComponent: () => import('./dashboard/...'),
    canActivate: [authGuard] },         // protection par guard
  { path: '**',       redirectTo: 'login' },  // wildcard fallback
];
"@

AddH2 $sel "3.2 Lazy Loading des composants"
AddPara $sel "loadComponent() charge le fichier JS du composant uniquement au moment de la navigation. Avantages :"
AddBullet $sel "Reduction du bundle initial (Code Splitting automatique par esbuild)"
AddBullet $sel "Temps de premier chargement ameliore"
AddBullet $sel "Isolation : un probleme dans Dashboard ne bloque pas le chargement de Login"
AddCode $sel @"
loadComponent: () =>
  import('./dashboard/dashboard.component')
    .then(m => m.DashboardComponent)
"@

AddH2 $sel "3.3 Guards fonctionnels (CanActivateFn)"
AddPara $sel "Un guard est une fonction qui autorise ou bloque une navigation. La syntaxe moderne utilise le type CanActivateFn :"
AddCode $sel @"
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!localStorage.getItem('user')) {
    return router.createUrlTree(['/login']); // redirection
  }
  return true;                              // acces autorise
};
"@
AddNote $sel "Retourner un UrlTree depuis un guard equivaut a une redirection. C'est la facon recommandee depuis Angular 15+. Les guards Angular sont cote client : la vraie protection est toujours l'API."

AddH2 $sel "3.4 Navigation programmatique"
AddCode $sel @"
private router = inject(Router);

// Apres login reussi
this.router.navigate(['/dashboard']);

// Deconnexion
localStorage.removeItem('user');
this.router.navigate(['/login']);
"@
AddPageBreak $sel

# ── 4. FORMULAIRES REACTIFS ───────────────────────────────────────────────────
AddH1 $sel "4. Formulaires reactifs (Reactive Forms)"
AddH2 $sel "4.1 FormBuilder et FormGroup"
AddCode $sel @"
private fb = inject(FormBuilder);

loginForm: FormGroup = this.fb.group({
  email:    ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
});
"@
AddNote $sel "Le tableau est [valeurInitiale, validators]. On peut passer un seul validator ou un tableau de validators."

AddH2 $sel "4.2 Validators disponibles"
AddBullet $sel "Validators.required - champ obligatoire"
AddBullet $sel "Validators.email - format email valide"
AddBullet $sel "Validators.minLength(n) / maxLength(n) - longueur"
AddBullet $sel "Validators.pattern(regex) - expression reguliere"
AddBullet $sel "Validators personnalises : function(control) => ValidationErrors | null"

AddH2 $sel "4.3 Liaison template"
AddCode $sel @"
<form [formGroup]=""loginForm"" (ngSubmit)=""onSubmit()"">

  <input formControlName=""email""
         [class.invalid]=""email?.invalid && email?.touched"" />

  <small *ngIf=""email?.errors?.['required']"">Email requis</small>
  <small *ngIf=""email?.errors?.['email']"">Format invalide</small>

  <button type=""submit"" [disabled]=""isLoading"">
    {{ isLoading ? 'Connexion...' : 'Se connecter' }}
  </button>
</form>
"@
AddNote $sel "[class.invalid] ajoute la classe CSS conditionnellement. email?.touched empeche l'affichage de l'erreur avant que l'utilisateur n'ait interagi avec le champ."

AddH2 $sel "4.4 Gestion de l'etat du formulaire"
AddCode $sel @"
// Accesseurs pour les controles individuels
get email()    { return this.loginForm.get('email'); }
get password() { return this.loginForm.get('password'); }

// Forcer l'affichage de toutes les erreurs (soumission invalide)
this.loginForm.markAllAsTouched();

// Reinitialiser le formulaire
this.loginForm.reset();

// Pre-remplir pour l'edition
this.form.patchValue(materiel);  // proprietes partielles OK
this.form.setValue(materiel);    // toutes les proprietes requises
"@
AddPageBreak $sel

# ── 5. SERVICES HTTP RXJS ─────────────────────────────────────────────────────
AddH1 $sel "5. Services, HttpClient et RxJS"
AddH2 $sel "5.1 Service injectable"
AddCode $sel @"
@Injectable({ providedIn: 'root' })  // singleton application-wide
export class AuthServiceService {
  private http = inject(HttpClient);
  private url  = environment.apiUrl + '/users';

  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(this.url + '?email=' + email);
  }
}
"@
AddNote $sel "providedIn: 'root' cree un singleton au niveau de l'application. Pas besoin de declarer le service dans un providers[] quelconque."

AddH2 $sel "5.2 HttpClient et Observables RxJS"
AddPara $sel "Les methodes HttpClient retournent des Observable<T>. Un Observable est un flux paresseux : rien ne s'execute tant qu'on ne s'y abonne pas (.subscribe())."
AddCode $sel @"
// Dans le service : declare l'Observable (lazy, pas encore execute)
getAll(): Observable<Materiel[]> {
  return this.http.get<Materiel[]>(this.url);
}

// Dans le composant : s'abonne et traite le resultat
this.service.getAll().subscribe((data) => {
  this.materiels = data;
});
"@

AddH2 $sel "5.3 Pattern next / error"
AddCode $sel @"
this.authService.login(email, password).subscribe({
  next: (users: User[]) => {
    // HTTP 200 reussi (meme si tableau vide = mauvais credentials)
    if (users.length > 0) {
      localStorage.setItem('user', JSON.stringify(users[0]));
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = 'Email ou mot de passe incorrect';
    }
  },
  error: () => {
    // erreur reseau, HTTP 4xx/5xx
    Swal.fire({ icon: 'error', title: 'Erreur serveur' });
  }
});
"@
AddNote $sel "Distinguer une reponse 200 avec tableau vide (credentials invalides) d'une vraie erreur reseau est essentiel pour des messages d'erreur pertinents."

AddH2 $sel "5.4 CRUD complet dans MaterielsService"
AddCode $sel @"
getAll()                { return this.http.get<Materiel[]>(this.url); }
create(m: Materiel)     { return this.http.post<Materiel>(this.url, m); }
update(id: number, m)   { return this.http.put(this.url+'/'+id, m); }
delete(id: number)      { return this.http.delete(this.url+'/'+id); }
"@

AddH2 $sel "5.5 Variables d'environnement Angular"
AddCode $sel @"
// environment.ts (dev)
export const environment = { production: false, apiUrl: 'http://localhost:3000' };

// environment.prod.ts (prod)  <-- remplace environment.ts au build prod
export const environment = { production: true,  apiUrl: '/api' };
"@
AddNote $sel "angular.json configure fileReplacements : au build de production, environment.ts est remplace par environment.prod.ts. L'URL relative /api fonctionne quel que soit le domaine de deploiement."
AddPageBreak $sel

# ── 6. AUTH ET PERSISTANCE ────────────────────────────────────────────────────
AddH1 $sel "6. Authentification et persistance de session"
AddH2 $sel "6.1 Strategie localStorage"
AddCode $sel @"
// Stocker la session
localStorage.setItem('user', JSON.stringify(users[0]));

// Lire la session (guard, dashboard)
const stored = localStorage.getItem('user');
if (stored) this.currentUser = JSON.parse(stored);

// Supprimer (logout)
localStorage.removeItem('user');
"@

AddH2 $sel "6.2 Comparaison des strategies de session"
AddBullet $sel "localStorage - persistant entre onglets et rechargements. Accessible en JS (risque XSS)."
AddBullet $sel "sessionStorage - efface a la fermeture de l'onglet. Plus isole."
AddBullet $sel "Cookie HttpOnly - non accessible depuis JS, protege contre XSS. Standard en production."
AddBullet $sel "JWT (JSON Web Token) - token signe cote client. Contient des claims (roles, expiration)."
AddNote $sel "Pour un TP ou prototype, localStorage est acceptable. En production : cookies HttpOnly avec backend qui gere les sessions, ou JWT avec rotation de tokens."

AddH2 $sel "6.3 Flux d'authentification complet"
AddCode $sel @"
Navigation vers /dashboard
  authGuard verifie localStorage.getItem('user')
  → null    : redirection vers /login
  → trouve  : composant Dashboard charge

Formulaire login soumis
  HTTP GET /api/users?email=...
  → 200 []  (vide)  : loginError = 'Email ou mot de passe incorrect'
  → 200 [{...}]     : localStorage.setItem + navigate('/dashboard')
  → erreur reseau   : SweetAlert2 'Erreur serveur'
"@
AddPageBreak $sel

# ── 7. TESTS E2E PLAYWRIGHT ───────────────────────────────────────────────────
AddH1 $sel "7. Tests E2E avec Playwright"
AddH2 $sel "7.1 Concepts fondamentaux"
AddPara $sel "Playwright controle un vrai navigateur (Chromium, Firefox, WebKit). Contrairement aux tests unitaires, il teste le comportement reel vu par l'utilisateur, navigateur inclus."
AddBullet $sel "test() - declare un test"
AddBullet $sel "expect() - assertions"
AddBullet $sel "page - objet representant un onglet du navigateur"
AddBullet $sel "page.goto() - navigue vers une URL"
AddBullet $sel "page.getByTestId() - selecteur par data-testid (robuste aux refactors)"

AddH2 $sel "7.2 Selecteurs data-testid"
AddPara $sel "Regle fondamentale : jamais de selecteurs CSS ou XPath dans les tests E2E."
AddCode $sel @"
<!-- Template Angular -->
<input         data-testid=""login-email""    formControlName=""email"" />
<button        data-testid=""login-submit""   type=""submit"">Se connecter</button>
<div           data-testid=""login-error"">{{ loginError }}</div>
<table         data-testid=""materials-table""></table>
<span          data-testid=""topbar-user"">Bonjour {{ currentUser.email }}</span>

<!-- Test Playwright -->
await page.getByTestId('login-email').fill('user1@example.com');
await page.getByTestId('login-submit').click();
await expect(page.getByTestId('login-error')).toBeVisible();
await expect(page.getByTestId('topbar-user')).toContainText('Bonjour');
"@
AddNote $sel "data-testid decouple les tests du style et de la structure DOM. Une refonte CSS ou HTML ne casse pas les tests si les testid sont conserves."

AddH2 $sel "7.3 Structure d'un test et gestion des races"
AddCode $sel @"
test('Connexion reussie', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('pass1234');

  // Promise.all evite la race condition entre clic et navigation
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.getByTestId('login-submit').click(),
  ]);

  await expect(page).toHaveURL(/dashboard/);
});
"@
AddNote $sel "Sans Promise.all, waitForURL pourrait etre appele apres que la navigation soit deja terminee et 'manquer' l'evenement. Les two promises doivent demarrer simultanement."

AddH2 $sel "7.4 Fixtures - partager l'etat entre tests"
AddCode $sel @"
// fixtures/auth.fixture.ts
export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await login(page);                          // helper de connexion
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('materials-table')).toBeVisible();
    await use(page);                            // fournit la page au test
  },
});

// dashboard.spec.ts - utilise la fixture
import { test, expect } from './fixtures/auth.fixture';

test('Affichage dashboard', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();
});
"@

AddH2 $sel "7.5 Helper login reutilisable"
AddCode $sel @"
// utils/auth.ts
export async function login(page: Page) {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('pass1234');
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.getByTestId('login-submit').click(),
  ]);
}
"@
AddNote $sel "Centraliser la logique de login dans un helper : si les credentials ou la procedure changent, on modifie un seul fichier."
AddPageBreak $sel

# ── 8. TYPESCRIPT ─────────────────────────────────────────────────────────────
AddH1 $sel "8. TypeScript - concepts cles du TP"
AddH2 $sel "8.1 Interfaces"
AddCode $sel @"
export interface User {
  id: number;
  email: string;
}

export interface Materiel {
  id?: number;              // ? = optionnel (absent a la creation)
  serialNumber: string;
  dateMiseEnService: string;
  dateFinGarantie: string;
}
"@
AddNote $sel "Les interfaces TypeScript sont effacees a la compilation. Elles n'existent qu'au developpement pour guider l'IDE et le compilateur."

AddH2 $sel "8.2 Generiques"
AddCode $sel @"
// HttpClient est generique : on precise le type de la reponse
this.http.get<User[]>(url)           // retourne Observable<User[]>
this.http.post<Materiel>(url, body)  // retourne Observable<Materiel>
this.http.delete(url)                // retourne Observable<Object>
"@

AddH2 $sel "8.3 Operateurs TypeScript utiles"
AddCode $sel @"
// Optional chaining ?.
const stored = localStorage.getItem('user');
this.currentUser = stored ? JSON.parse(stored) : null;

// Non-null assertion ! (je garantis que ce n'est pas null)
this.service.update(this.currentId!, this.form.value);

// Nullish coalescing ??
const id = m.id ?? null;    // si m.id est undefined ou null -> null

// Operateur typeof (type guard)
typeof stored === 'string'  // true si stored est une chaine
"@

AddH2 $sel "8.4 Decorateurs Angular"
AddBullet $sel "@Component - declare un composant (selector, template, imports)"
AddBullet $sel "@Injectable - marque une classe comme injectable dans le DI container"
AddBullet $sel "@Input / @Output - communication parent vers enfant et inverse"
AddPageBreak $sel

# ── 9. DOCKER ET NGINX ────────────────────────────────────────────────────────
AddH1 $sel "9. Docker, nginx et production"
AddH2 $sel "9.1 Multi-stage build"
AddCode $sel @"
# Stage 1 : compilation Angular (image ~1 Go)
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build       # produit dist/authentification-tp/browser/

# Stage 2 : serveur de fichiers (image finale ~25 Mo)
FROM nginx:alpine
COPY --from=build /app/dist/authentification-tp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
"@
AddNote $sel "L'image finale ne contient pas node_modules ni le code source. Seuls les fichiers HTML/JS/CSS compiles et nginx sont presents. Resultat : image 40x plus petite, surface d'attaque reduite."

AddH2 $sel "9.2 nginx - SPA routing et proxy API"
AddCode $sel @"
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA : toute route non trouvee -> index.html
    location / {
        try_files `$uri `$uri/ /index.html;
    }

    # Proxy API -> json-server (reseau Docker interne)
    location /api/ {
        proxy_pass http://json-server:3000/;
    }
}
"@
AddBullet $sel "try_files : nginx cherche le fichier, puis le dossier, puis sert index.html (Angular gere le routing cote client)"
AddBullet $sel "proxy_pass : /api/* est redirige vers json-server dans le reseau Docker - le navigateur n'a pas besoin de connaitre l'adresse de l'API"

AddH2 $sel "9.3 Angular 17 - chemin de build specifique"
AddNote $sel "Angular 17+ avec le builder 'application' (esbuild) genere les fichiers dans dist/NOM/browser/ (sous-dossier browser/). Les versions precedentes generaient dans dist/NOM/. Le Dockerfile doit copier le bon chemin sinon nginx sert un dossier vide."

AddH2 $sel "9.4 URL relative vs absolue"
AddCode $sel @"
// Dev (localhost:4200) appelle localhost:3000 directement
environment.ts      : apiUrl: 'http://localhost:3000'

// Prod Docker : localhost:3000 est inaccessible depuis un autre conteneur
// Solution : URL relative + proxy nginx
environment.prod.ts : apiUrl: '/api'
// nginx proxifie /api/* vers http://json-server:3000/
"@
AddPageBreak $sel

# ── 10. SWEETALERT2 ───────────────────────────────────────────────────────────
AddH1 $sel "10. SweetAlert2 - UX des notifications"
AddPara $sel "SweetAlert2 remplace les alert() natifs du navigateur par des modales elegantes et configurables."
AddCode $sel @"
// Notification succes (auto-fermeture, puis action)
Swal.fire({
  icon: 'success', title: 'Connexion reussie',
  timer: 1500, showConfirmButton: false,
}).then(() => {
  this.router.navigate(['/dashboard']);
});

// Confirmation avant action destructive
Swal.fire({
  title: 'Supprimer ce materiel ?',
  text: 'Cette action est irreversible',
  icon: 'warning',
  showCancelButton: true, confirmButtonText: 'Oui',
}).then((result) => {
  if (result.isConfirmed) {
    this.service.delete(id).subscribe(() => { this.loadMateriels(); });
  }
});
"@
AddNote $sel "SweetAlert2 retourne une Promise. .then() permet d'executer du code apres que l'utilisateur a interagi (confirmation, fermeture auto...)."
AddPageBreak $sel

# ── 11. SYNTHESE TABLEAU ──────────────────────────────────────────────────────
AddH1 $sel "11. Synthese - correspondance code / concept"

$rows = @(
  @("Fichier / Element",        "Concept mis en oeuvre"),
  @("app.config.ts",            "Bootstrap Standalone sans NgModule - provideRouter, provideZoneChangeDetection"),
  @("app.routes.ts",            "Routing declaratif, lazy loading (loadComponent), wildcard, redirectTo"),
  @("auth.guard.ts",            "Guard fonctionnel CanActivateFn, inject(), createUrlTree (redirection)"),
  @("auth-service.service.ts",  "@Injectable root, HttpClient, Observable<T>, interface User"),
  @("smateriels.service.ts",    "CRUD complet : GET / POST / PUT / DELETE, typage generique"),
  @("login-form.component.ts",  "Reactive Forms, FormBuilder, Validators, subscribe next/error, SweetAlert2"),
  @("login-form.component.html","formGroup, formControlName, ngSubmit, [class.x], *ngIf, data-testid"),
  @("dashboard.component.ts",   "OnInit, patchValue, Swal.fire confirmation, localStorage, navigation"),
  @("environment.*.ts",         "Configuration par environnement, URL relative vs absolue"),
  @("Dockerfile",               "Multi-stage build, image finale nginx:alpine, chemin dist/browser/"),
  @("nginx.conf",               "SPA routing (try_files), reverse proxy API (/api/ vers json-server:3000)"),
  @("tests/login.spec.ts",      "Playwright test, getByTestId, waitForURL, Promise.all"),
  @("tests/fixtures/",          "Playwright fixtures (base.extend), etat partage entre tests"),
  @("tests/utils/auth.ts",      "Helper reutilisable, pattern DRY pour les tests E2E"),
  @(".github/workflows/ci.yml", "GitHub Actions, declencheur push/PR, etapes sequentielles Docker")
)

$table = $doc.Tables.Add($sel.Range, $rows.Count, 2)
try { $table.Style = "Table Grid" } catch { try { $table.Style = "Grille de tableau" } catch {} }
$table.Borders.InsideLineStyle = 1
$table.Borders.OutsideLineStyle = 1

for ($r = 0; $r -lt $rows.Count; $r++) {
    for ($c = 0; $c -lt 2; $c++) {
        $cell = $table.Cell($r + 1, $c + 1)
        $cell.Range.Text = $rows[$r][$c]
        $cell.Range.Font.Name = "Calibri"
        if ($r -eq 0) {
            $cell.Range.Font.Size = 10; $cell.Range.Font.Bold = $true
            $cell.Range.Font.Color = 0xFFFFFF
            $cell.Shading.BackgroundPatternColor = 0x2F4F8F
        } else {
            $cell.Range.Font.Size = 9; $cell.Range.Font.Bold = ($c -eq 0)
            if ($r % 2 -eq 0) { $cell.Shading.BackgroundPatternColor = 0xF0F4FA }
        }
    }
    $table.Columns(1).SetWidth(130, 2)
    $table.Columns(2).SetWidth(330, 2)
}

$sel.MoveDown(5, $rows.Count + 2)
$sel.TypeParagraph()
SetFont $sel "Calibri" 11 $false 0x000000
$sel.ParagraphFormat.SpaceBefore = 0; $sel.ParagraphFormat.SpaceAfter = 4
AddPageBreak $sel

# ── 12. BONNES PRATIQUES ──────────────────────────────────────────────────────
AddH1 $sel "12. Bonnes pratiques et points de vigilance"
AddH2 $sel "12.1 Securite (ce TP est un prototype)"
AddBullet $sel "Ne jamais stocker un mot de passe en clair dans localStorage"
AddBullet $sel "En production : authentification par JWT ou session cookie HttpOnly cote serveur"
AddBullet $sel "Le filtrage par email seul (sans verification password cote serveur) ne vaut que pour un TP json-server"
AddBullet $sel "Les guards Angular sont contournables cote client - la vraie protection est toujours l'API"
AddH2 $sel "12.2 Performance"
AddBullet $sel "Lazy loading : chaque route est un chunk JS separe - ne charger que ce qui est necessaire"
AddBullet $sel "Eviter les subscribe imbriques - preferer les operateurs RxJS (switchMap, combineLatest...)"
AddBullet $sel "OnPush change detection : Angular ne verifie le composant que si une Input change ou un Observable emet"
AddH2 $sel "12.3 Tests"
AddBullet $sel "Toujours utiliser data-testid - jamais de classes CSS ou selecteurs structurels dans les tests E2E"
AddBullet $sel "Promise.all([waitForURL, click]) pour eviter les race conditions sur les navigations"
AddBullet $sel "Les fixtures Playwright evitent de repeter la procedure de login dans chaque test"
AddBullet $sel "CI=true dans l'environnement de test active le mode retries de Playwright (moins de flakiness)"
AddH2 $sel "12.4 Qualite de code"
AddBullet $sel "inject() plutot que l'injection par constructeur - code plus lisible et testable"
AddBullet $sel "Interfaces TypeScript pour toutes les entites - le compilateur detecte les erreurs de structure"
AddBullet $sel "Un service = une responsabilite (AuthService pour l'auth, MaterielsService pour le CRUD)"
AddBullet $sel "Variables d'environnement pour les URLs - jamais de valeur hardcodee dans les services"

# ── SAUVEGARDE ────────────────────────────────────────────────────────────────
$path = "C:\Users\Admin\Desktop\TP_Angular_Concepts.docx"
$doc.SaveAs([ref]$path, 16)
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output "OK : $path"
