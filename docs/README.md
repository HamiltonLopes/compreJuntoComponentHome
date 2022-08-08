
<h1 align="center">
    CompreJunto HomePage VtexIO ReactApp
</h1>

## 💻 Sobre o projeto

Projeto desenvolvido como desafio final no HiringCoders#3 Gama Academy VTEX.

Este projeto é um componente em VtexIO que mostra as melhores combinações de items para venda
de toda a loja na página principal, para chamar atenção do consumidor.

Componente na loja Vtex:

```"travellog.compre-junto-component-home": "0.x"```

---

## 🛠 Tecnologias/Ferramentas

As seguintes ferramentas foram usadas na construção do projeto:

- NodeJs
- JavaScript
- TypeScript
- GraphQL
- VtexIO
- ApolloClient

---
## 🚀 UseLazyQuery
Como diferencial neste componente foi necessário o uso do hook useLazyQuery para acesso do
catalogo da Vtex utilizando o GraphQL, pois faz-se necessário primeiro fazer uma consulta na
[Combinations API](https://github.com/HamiltonLopes/combinationsAPI) para depois fazer a query.

## 🚀 VtexIO

Principais Libs do VtexIO utilizadas:

```vtex.styleguide```

```vtex.order-items/OrderItems```

```vtex.format-currency```


## 🚀 ReactApp

Neste projeto foi utilizado a forma de componetização do React, sendo dividido o componente em duas partes, uma para renderizar um
produto e a outra para renderizar o componente por completo, chamando os produtos.

## 🚀 GraphQL

Neste projeto também foi utilizado de GraphQL para consumo de apis internas da Vtex como o catalogo:

![graphql query](https://user-images.githubusercontent.com/9729963/183326541-6a9e1e86-2286-43e5-94bd-abafee5e5022.jpg)

