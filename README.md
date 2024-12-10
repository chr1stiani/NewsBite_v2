# NewsBite - AI nástroj pro sumarizaci zpráv

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> Inteligentní webová aplikace pro rychlou a přesnou sumarizaci zpravodajských článků pomocí umělé inteligence.

![NewsBite Demo](demo.gif)

## 🚀 Hlavní funkce

- ✨ **Inteligentní sumarizace** - Automatické vytváření výstižných shrnutí z dlouhých textů
- 🔗 **URL podpora** - Přímá sumarizace článků z webových stránek
- 🎨 **Moderní design** - Čisté a intuitivní uživatelské rozhraní
- ⚡ **Rychlé zpracování** - Okamžitá zpětná vazba v reálném čase
- 🔒 **Zabezpečený přístup** - Systém autentizace pro bezpečné použití

## 🛠️ Technologie

### Frontend
- HTML5, CSS3, JavaScript
- PIXI.js pro pokročilé animace
- Responzivní design

### Backend
- Node.js + Express
- Hugging Face's BART-large-CNN
- Session-based autentizace

## ⚙️ Požadavky

- Node.js 14+
- NPM nebo Yarn
- Hugging Face API klíč

## 📦 Instalace

1. **Klonování repozitáře**
   - git clone https://github.com/chr1stiani/newsbite.git

2. **Instalace závislostí**
   - npm install express cors dotenv openai axios jsdom

3. **Konfigurace prostředí**
   - Vytvořte soubor `.env`:
HF_API_KEY=vas_huggingface_api_klic
PORT=3000


4. **Spuštění aplikace**
   - node server.js


## 🔑 Přihlášení do aplikace

Uživatelské jméno: Chris
Heslo: Chris
(funkce pro grafické přidávání účtů zatím není implementována)

## 🔜 Plánovaná vylepšení

- [ ] Vylepšená mobilní responzivita
- [ ] Vícejazyčná podpora
- [ ] Rozšířené možnosti sumarizace
- [ ] Uživatelské profily

## 🤝 Přispívání

Příspěvky jsou vítány! Pro větší změny prosím nejdříve otevřete issue.

## 📝 Licence

Tento projekt je licencován pod [ISC licencí](LICENSE).

## 👤 Autor

Vytvořeno jako školní projekt.

---

💡 **Tip**: Pro vývoj je nutný vlastní Hugging Face API klíč.
