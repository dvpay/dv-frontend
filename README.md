# DV Pay Frontend

<h3 align="center">
  Accept Cryptocurrency payments
</h3>
<p align="center"> DV Pay is a free and open-source cryptocurrency payment processor which allows you to accept cryptocurrency without fees or intermediaries.
</p>

<p align="center">
<img src="https://i.ibb.co/DY3XJqV/payment-form.png" alt="payment-form" border="0">
</p>

## 💼 Overview

This repository is the frontend of DV Pay cryptocurrency payment service and is a classic single page application written using Vue 3 and Typescript.

## 🎨 Features

* Direct, peer-to-peer cryptocurrency payments
* No transaction fees (other than the network fee)
* No fees, middleman or KYC
* Non-custodial (complete control over the private key)
* Enhanced privacy & security
* Self-hosted
* Share your instance with friends (multi-tenant)
* Invoice management and Payment requests

## 🚀 Getting Started

1. Open terminal
2. Clone the repo: `git clone git@github.com:DvPayFrontend/DvPayFrontend.git`
3. run `npm i` to install node packages.
4. Make a copy of `.env.example` named `.env` and specify your variables.
5. run `npm run build`
6. preview `npm run serve`
7. App should be running in `http://localhost:8080`

## 🧑‍💻 Developers

1. Open terminal
2. Clone the repo: `git clone git@github.com:DvPayFrontend/DvPayFrontend.git`
3. run `git checkout dev`
4. run `npm i` to install node packages.
5. Make a copy of `.env.example` named `.env` and specify your variables.
6. development server `npm run dev`
7. App should be running in `http://localhost:8080`

### Folders Structure

1. `api` contains the wrapper class over the [axios](https://github.com/axios/axios)
2. `assets` contains all images and styles
3. `components` contains high-level components and `ui` subfolder with ui-kit components
4. `directives` helpful [vue custom directives](https://vuejs.org/guide/reusability/custom-directives.html)
5. `layouts` page components layouts
6. `plugins` contains plugins like [i18n](https://github.com/intlify/vue-i18n-next) with locales translations
7. `router` classic [vue spa navigation](https://router.vuejs.org/introduction.html)
8. `services` contains all api endpoints and their types
9. `store` global state manager [vuex](https://vuex.vuejs.org/)
10. `utils` helpers utilities
11. `views` contains pages

## 📝 License

DV Pay software, logo and designs are provided under MIT License.

