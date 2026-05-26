# UNDERGROUND 🎸

> O maior ecossistema para músicos sérios.

Estética cyberpunk/industrial. Stack: React + Redux Toolkit + Firebase + Tailwind CSS.

---

## Pré-requisitos

- Node.js 18+
- Conta no [Firebase](https://console.firebase.google.com)

---

## Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure o Firebase (veja abaixo)

# 3. Rode em desenvolvimento
npm start
```

---

## Configuração do Firebase

### 1. Crie o projeto no Firebase Console
1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Dê um nome (ex: `underground-app`)

### 2. Ative o Google Auth
1. No painel do projeto: **Authentication → Sign-in method**
2. Ative **Google**
3. Defina o e-mail de suporte e salve

### 3. Crie o Firestore
1. No painel: **Firestore Database → Criar banco de dados**
2. Selecione **"Iniciar no modo de teste"** (para desenvolvimento)
3. Escolha a região mais próxima (ex: `us-east1`)

### 4. Cole as credenciais no projeto
1. No painel: **Configurações do projeto (⚙️) → Seus apps → Web**
2. Registre um app web e copie o objeto `firebaseConfig`
3. Abra o arquivo `src/firebase-config.js` e substitua os valores:

```js
const firebaseConfig = {
  apiKey:            'SUA_API_KEY',
  authDomain:        'SEU_AUTH_DOMAIN',
  projectId:         'SEU_PROJECT_ID',
  storageBucket:     'SEU_STORAGE_BUCKET',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId:             'SEU_APP_ID',
};
```

---

## Estrutura do projeto

```
src/
├── firebase-config.js          ← credenciais do Firebase
├── index.css                   ← Tailwind + Google Fonts
├── index.js                    ← ponto de entrada CRA
├── App.js                      ← Provider + BrowserRouter + Routes
├── store/
│   ├── index.js                ← configureStore (Redux)
│   └── authSlice.js            ← estado de autenticação
├── providers/
│   └── AuthProvider.js         ← ouve Firebase, sincroniza Redux
├── components/
│   └── Loading.js              ← tela de loading cyberpunk
└── pages/
    └── underground/
        ├── Underground.jsx     ← orquestrador dos 3 passos
        ├── Step1Login.jsx      ← O Portão (Google Auth)
        ├── Step2Arsenal.jsx    ← Seleção de arma e alma
        ├── Step3Radar.jsx      ← Inputs finais
        └── AccessGranted.jsx   ← Terminal de sucesso
```

---

## Fluxo de dados

```
Firebase onAuthStateChanged
        │
        ▼
  AuthProvider  ──dispatch──▶  authSlice (Redux)
                                     │
                              Underground.jsx
                              lê `status` e `user`
                                     │
          ┌──────────────────────────┼────────────────────────┐
          │                          │                        │
       'login'                  'arsenal'               'radar'
     Step1Login              Step2Arsenal             Step3Radar
          │                          │                        │
  signInWithPopup           onUpdate(formData)       setDoc(Firestore)
          │                          │                        │
    checkProfile()            setStep('radar')       setStep('granted')
          │                                                   │
  doc existe? ──SIM──▶ 'granted'                      AccessGranted
          └──NÃO──▶ 'arsenal'
```

---

## Dados salvos no Firestore

Cada documento em `users/{uid}` contém:

| Campo          | Tipo     | Descrição                        |
|----------------|----------|----------------------------------|
| `uid`          | string   | ID do usuário Firebase           |
| `displayName`  | string   | Nome do Google                   |
| `email`        | string   | E-mail do Google                 |
| `photoURL`     | string   | Foto do Google                   |
| `weapon`       | string   | Instrumento escolhido            |
| `soul`         | string   | `'hobby'` ou `'serio'`           |
| `location`     | string   | Região geográfica                |
| `age`          | string   | Faixa etária                     |
| `bandDna`      | string   | Banda de referência              |
| `firstSong`    | string   | Música para o 1º ensaio          |
| `mission`      | string   | Autoral / Cover / Ambos          |
| `registeredAt` | string   | ISO timestamp do cadastro        |
