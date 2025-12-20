# Authentification JWT - Implémentation

## 🔐 Vue d'ensemble

Cette implémentation suit le modèle de la correction du TP07 :
- **Access Token** envoyé dans le header `Authorization` par le serveur
- **Pas de refresh token** (approche simplifiée)
- Token stocké dans NGXS et persisté dans le localStorage
- Interceptor HTTP pour injection automatique du token
- Guards pour protection des routes

---

## 📡 BACKEND (API Node/Express)

### 1. Configuration (`api/config.js`)
```javascript
ACCESS_TOKEN_SECRET: "EMMA123"
```

### 2. Controller Login (`api/controllers/utilisateur.controllers.js`)
```javascript
// Génération du token JWT (expire en 30 minutes)
const accessToken = generateAccessToken(user);

// Retour du token dans le header HTTP
res.setHeader('Authorization', `Bearer ${accessToken}`);
res.status(200).send(user);
```

### 3. Middleware JWT (`api/routes/jwtMiddleware.js`)
- Extrait le token du header `Authorization: Bearer <token>`
- Vérifie la signature avec `ACCESS_TOKEN_SECRET`
- Bloque les requêtes non authentifiées (401)

### 4. Routes protégées
```javascript
// Pollution routes
router.post("/", checkJwt, pollution.create);
router.delete("/:id", checkJwt, pollution.delete);
router.put("/:id", checkJwt, pollution.update);

// Utilisateur routes
router.get("/", checkJwt, utilisateur.get);
router.delete("/:id", checkJwt, utilisateur.delete);
```

---

## 🎨 FRONTEND (Angular)

### Architecture NGXS

```
src/
├── shared/
│   ├── models/
│   │   ├── acces-token-model.ts      # Interface pour le token
│   │   ├── auth-state-model.ts       # Interface pour l'utilisateur
│   │   └── auth.ts                   # Interface User simplifié
│   ├── actions/
│   │   ├── acces-token-action.ts     # SetAccessToken, DeleteAccessToken
│   │   └── auth-action.ts            # AuthConnexion, AuthDeconnexion
│   └── states/
│       ├── acces-token-state.ts      # State NGXS pour le token
│       └── auth-state.ts             # State NGXS pour l'utilisateur
└── app/
    ├── http-interceptor.ts           # Interceptor HTTP
    └── guards/
        └── auth.guard.ts             # Guard de protection
```

### 1. States NGXS

#### **AccesTokenState** - Gestion du token
```typescript
@State<AccesTokenModel>({
  name: 'accesToken',
  defaults: { accessToken: undefined }
})
```

**Actions :**
- `SetAccessToken` : Stocke le token
- `DeleteAccessToken` : Supprime le token (logout)

**Selector :**
- `getAccessToken()` : Récupère le token

#### **AuthState** - Gestion de l'utilisateur
```typescript
@State<AuthStateModel>({
  name: 'auth',
  defaults: { utilisateur: undefined }
})
```

**Actions :**
- `AuthConnexion` : Stocke l'utilisateur
- `AuthDeconnexion` : Supprime l'utilisateur (logout)

**Selectors :**
- `isConnected()` : Boolean si utilisateur connecté
- `getConnectedUser()` : Récupère l'utilisateur

### 2. HTTP Interceptor

**Rôle :** Injection et extraction automatique du token

```typescript
intercept(req, next) {
  // 1. INJECTION : Ajoute le token à chaque requête sortante
  const token = this.store.selectSnapshot(AccesTokenState.getAccessToken);
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. EXTRACTION : Récupère le token du header de réponse
  return next.handle(req).pipe(
    tap(evt => {
      if (evt instanceof HttpResponse) {
        const authHeader = evt.headers.get('Authorization');
        if (authHeader) {
          const token = authHeader.split('Bearer ')[1];
          this.store.dispatch(new SetAccessToken(token));
        }
      }
    })
  );
}
```

### 3. Auth Guard

Protège les routes nécessitant une authentification :

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const isConnected = store.selectSnapshot(AuthState.isConnected);
  
  if (isConnected) {
    return true;  // Accès autorisé
  } else {
    router.navigate(['/login']);  // Redirection vers login
    return false;
  }
};
```

**Usage dans les routes :**
```typescript
{
  path: 'pollutions',
  loadChildren: () => import('./pollutions/...'),
  canActivate: [authGuard]  // Route protégée
}
```

### 4. Service Utilisateur

```typescript
login(login: string, pass: string) {
  return this.http.post('/api/utilisateur/login', { login, pass })
    .pipe(
      tap(user => {
        // Stocke l'utilisateur dans le store
        this.store.dispatch(new AuthConnexion(user));
        // Le token est automatiquement extrait par l'interceptor
      })
    );
}

logout() {
  this.store.dispatch(new AuthDeconnexion());
  this.store.dispatch(new DeleteAccessToken());
}
```

### 5. Configuration (`app.config.ts`)

```typescript
providers: [
  // Interceptor HTTP
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiHttpInterceptor,
    multi: true
  },
  
  // States NGXS
  importProvidersFrom(
    NgxsModule.forRoot([FavorisState, AccesTokenState, AuthState]),
    NgxsStoragePluginModule.forRoot({
      keys: ['favoris', 'accesToken', 'auth']  // Persistance localStorage
    })
  )
]
```

---

## 🔄 Flux d'authentification

### 1. Login
```
User → Login Form
  ↓
POST /api/utilisateur/login { login, pass }
  ↓
Server vérifie credentials
  ↓
Server génère JWT token
  ↓
Response: 
  - Body: { id, login, nom, prenom }
  - Header: Authorization: Bearer <token>
  ↓
Interceptor extrait le token du header
  ↓
Store NGXS:
  - dispatch(SetAccessToken(token))
  - dispatch(AuthConnexion(user))
  ↓
Persistance automatique dans localStorage
```

### 2. Requête authentifiée
```
User → Action (create/delete pollution)
  ↓
HTTP Request
  ↓
Interceptor récupère le token du store
  ↓
Ajout header: Authorization: Bearer <token>
  ↓
Server vérifie le token (middleware checkJwt)
  ↓
Si valide → Action effectuée
Si invalide → 401 Unauthorized
```

### 3. Logout
```
User → Logout
  ↓
dispatch(AuthDeconnexion())
dispatch(DeleteAccessToken())
  ↓
Store NGXS effacé
  ↓
localStorage effacé
  ↓
Redirection vers /login
```

---

## 🛡️ Sécurité

### Points clés :
1. ✅ **Token dans header HTTP** (pas dans le body)
2. ✅ **Middleware checkJwt** protège les endpoints sensibles
3. ✅ **Guards Angular** empêchent l'accès aux routes protégées
4. ✅ **Expiration du token** : 30 minutes
5. ⚠️ **Pas de refresh token** : l'utilisateur doit se reconnecter après expiration

### Limitations (approche simplifiée) :
- Pas de gestion du renouvellement automatique du token
- Token stocké en clair dans localStorage (vulnérable au XSS)
- Pas de blacklist de tokens révoqués

---

## 📝 Utilisation

### Protection d'une route
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard]
}
```

### Vérifier si connecté dans un composant
```typescript
constructor(private store: Store) {}

ngOnInit() {
  this.isLoggedIn$ = this.store.select(AuthState.isConnected);
  this.user$ = this.store.select(AuthState.getConnectedUser);
}
```

### Logout manuel
```typescript
constructor(private userService: UserServiceService) {}

logout() {
  this.userService.logout();
  this.router.navigate(['/login']);
}
```

---

## 🧪 Test

### Backend
```bash
cd api
npm start
```

### Frontend
```bash
cd Front
ng serve
```

### Vérification
1. Ouvrir DevTools → Network
2. Se connecter via `/login`
3. Vérifier le header `Authorization: Bearer <token>` dans la réponse
4. Créer une pollution → Vérifier le token dans la requête
5. Se déconnecter → Vérifier que le token est supprimé
