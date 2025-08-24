# 🌱 Lótus Landscaping E-commerce

> **Um e-commerce completo para produtos de paisagismo e jardinagem**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.16.0-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ **Sobre o Projeto**

Este é um **e-commerce completo** desenvolvido com as tecnologias mais modernas do mercado, seguindo as melhores práticas de **Clean Architecture** e **Domain Driven Design (DDD)**.

O projeto permite que usuários naveguem por um catálogo de produtos de paisagismo, adicionem itens ao carrinho e finalizem compras, enquanto administradores podem gerenciar produtos e pedidos.

### 🎯 **Funcionalidades Principais**

#### 👥 **Para Usuários**

- ✅ Cadastro e autenticação segura (JWT)
- ✅ Navegação no catálogo com filtros avançados
- ✅ Visualização detalhada de produtos
- ✅ Carrinho de compras inteligente
- ✅ Sistema de cupons de desconto
- ✅ Perfil do usuário e histórico de pedidos
- ✅ Design responsivo para mobile e desktop

#### 🔧 **Para Administradores**

- ✅ Painel de controle completo
- ✅ Gerenciamento de produtos
- ✅ Controle de estoque
- ✅ Gerenciamento de pedidos
- ✅ Dashboard com métricas

---

## 🏗️ **Arquitetura do Sistema**

### **Frontend (Next.js 14)**

```
apps/web/src/
├── app/                 # App Router (Next.js 14)
│   ├── (auth)/         # Grupo de rotas - Login/Register
│   ├── products/       # Catálogo e detalhes
│   ├── cart/           # Carrinho de compras
│   └── profile/        # Perfil do usuário
├── components/         # Componentes reutilizáveis
│   ├── ui/            # Componentes base (Button, Input)
│   ├── layout/        # Header, Footer, Layout
│   └── features/      # ProductCard, Cart, etc.
├── lib/               # Utilitários e configurações
│   ├── api.ts         # Cliente HTTP (Axios)
│   ├── store.ts       # Estado global (Zustand)
│   └── utils.ts       # Funções utilitárias
└── types/             # Definições TypeScript
```

### **Backend (Node.js + Express)**

```
apps/api/src/
├── application/        # Casos de uso e serviços
│   ├── use-cases/     # Regras de negócio
│   ├── services/      # Interfaces de serviços
│   └── dto/           # Data Transfer Objects
├── domain/            # Núcleo do negócio
│   ├── entities/      # Entidades do domínio
│   ├── repositories/  # Interfaces dos repositórios
│   └── value-objects/ # Objetos de valor
├── infrastructure/    # Implementações concretas
│   ├── database/      # Conexão com banco
│   ├── repositories/  # Implementação Prisma
│   └── services/      # Serviços externos
└── presentation/      # Camada de apresentação
    ├── controllers/   # Controllers REST
    ├── middlewares/   # Middlewares (auth, CORS)
    └── routes/        # Definição das rotas
```

---

## 🚀 **Tecnologias Utilizadas**

### **Frontend**

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos
- **[Zod](https://zod.dev/)** - Validação de esquemas TypeScript
- **[Axios](https://axios-http.com/)** - Cliente HTTP

### **Backend**

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para bancos de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação via tokens
- **[Bcrypt](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas
- **[Zod](https://zod.dev/)** - Validação de dados

---

## 🌐 **URLs Importantes**

| Serviço           | URL                              | Descrição            |
| ----------------- | -------------------------------- | -------------------- |
| **Frontend**      | http://localhost:3000            | Interface do usuário |
| **API**           | http://localhost:3001/api        | Backend REST         |
| **Health Check**  | http://localhost:3001/api/health | Status da API        |
| **Prisma Studio** | http://localhost:5555            | Interface do banco   |

### **📱 Páginas Principais**

- **Homepage**: `http://localhost:3000`
- **Produtos**: `http://localhost:3000/products`
- **Login**: `http://localhost:3000/login`
- **Registro**: `http://localhost:3000/register`
- **Carrinho**: `http://localhost:3000/cart`
- **Perfil**: `http://localhost:3000/profile`

---

## 🔐 **Autenticação**

### **Credenciais de Teste**

```
👤 Cliente:
Email: cliente@exemplo.com
Senha: customer123

🔧 Administrador:
Email: admin@paisagismo.com
Senha: admin123
```

### **Endpoints da API**

```bash
# Registrar usuário
POST /api/auth/register

# Fazer login
POST /api/auth/login

# Obter perfil (autenticado)
GET /api/auth/profile

# Listar produtos
GET /api/products

# Criar produto (apenas admin)
POST /api/products
```

---

## 📁 **Estrutura de Pastas**

```
paisagismo-ecommerce/
├── 📁 apps/
│   ├── 📁 web/              # Frontend Next.js
│   └── 📁 api/              # Backend Node.js
├── 📁 packages/
│   ├── 📁 database/         # Schema Prisma
│   └── 📁 shared/           # Código compartilhado
├── 📄 package.json          # Configuração do monorepo
├── 📄 pnpm-workspace.yaml   # Configuração pnpm
└── 📄 README.md            # Este arquivo
```

---

## 📝 **Licença**

Este projeto está sob a licença [MIT](LICENSE).

---

## 👨‍💻 **Autor**

Desenvolvido com ❤️ por **Othávio**

- 🌐 Website: [netunotech.com](https://netunotech.com)

- <img width="1905" height="911" alt="1" src="https://github.com/user-attachments/assets/338e78c6-6ed4-4efa-bd1e-b5cf7bbfbc5b" />
<img width="1905" height="911" alt="2" src="https://github.com/user-attachments/assets/da958076-dc89-4266-b5e2-2bcce80b98b9" />
<img width="1905" height="911" alt="3" src="https://github.com/user-attachments/assets/d334c040-750c-49b1-be87-fc8165d94f38" />
<img width="1905" height="911" alt="4" src="https://github.com/user-attachments/assets/8945ed3a-49e0-4762-8266-3530e1b34ff5" />
<img width="1905" height="911" alt="5" src="https://github.com/user-attachments/assets/cc57f615-cfe3-4495-99ae-5d49542e3a77" />
<img width="1905" height="911" alt="6" src="https://github.com/user-attachments/assets/4c91e961-d5ce-4e5d-82dc-559bb094c502" />
