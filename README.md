# PartyShop - Aplicativo de E-commerce

## Sobre o Projeto

O PartyShop é um aplicativo de e-commerce desenvolvido em React Native com Expo, focado na venda de pacotes para festas. Este projeto foi criado como projeto final do curso de programação para dispositivos móveis do Senac.

## Funcionalidades Principais

### Autenticação de Usuários
- Login com e-mail e senha
- Registro de novos usuários
- Persistência de sessão entre usos do aplicativo

### Catálogo de Pacotes
- Visualização de pacotes disponíveis
- Interface para navegação entre categorias

### Carrinho de Compras
- Adição de pacotes ao carrinho
- Persistência do carrinho entre sessões usando AsyncStorage
- Gerenciamento de itens (adicionar, remover)

### Perfil de Usuário
- Gerenciamento de dados pessoais (nome, CPF, telefone)
- Cadastro e edição de endereço completo
- Integração com API ViaCEP para autopreenchimento de endereço
- Operações CRUD completas no Firestore (coleção 'usuarios')
- Formatação automática para CPF e telefone

### Navegação
- Menu lateral (Drawer Navigator) para acesso rápido às funcionalidades
- Navegação entre telas
- Rotas protegidas para usuários autenticados

## Tecnologias Utilizadas

### Frontend
- React Native 0.79.2
- Expo 53.0.9
- React Navigation 7 (Drawer, Stack, Bottom Tabs)
- React Native Reanimated

### Backend e Armazenamento
- Firebase Authentication (autenticação de usuários)
- Firebase Firestore (banco de dados NoSQL)
- AsyncStorage (armazenamento local)

### Integrações
- API ViaCEP (consulta de endereços)

## Estrutura do Projeto

```
ProjetoFinalReactNative/
├── assets/              # Imagens e recursos estáticos
├── components/          # Componentes reutilizáveis
├── context/             # Contextos React (AuthContext)
├── navigation/          # Configuração de navegação
├── screens/             # Telas do aplicativo
├── services/            # Serviços (Firebase)
├── utils/               # Funções utilitárias
├── App.js               # Componente principal
└── package.json         # Dependências do projeto
```

Desenvolvido usando React Native e Expo.
