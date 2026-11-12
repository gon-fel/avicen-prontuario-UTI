# AVICEN

**AVICEN** é um projeto acadêmico de prontuário eletrônico voltado à Unidade de Terapia Intensiva (UTI). Nesta etapa, o repositório contém um **protótipo de alta fidelidade integrativo**, criado para representar telas, perfis profissionais e fluxos de trabalho assistenciais.

O projeto também é uma oportunidade de praticar Engenharia de Software e integrar, ao longo do curso de Análise e Desenvolvimento de Sistemas, os conhecimentos desenvolvidos nas diferentes disciplinas. A proposta é evoluir gradualmente: primeiro compreender o problema e validar a experiência por meio do protótipo; depois aprofundar a modelagem e implementar partes do sistema conforme os conteúdos do curso forem estudados.

> **Importante:** este protótipo é exclusivamente acadêmico e demonstrativo. Não é um prontuário eletrônico real e não deve ser utilizado para assistência, decisões clínicas ou armazenamento de dados reais de pacientes. Utilize apenas dados fictícios.

## Objetivos do protótipo

- Representar uma visão integrada das informações e atividades de uma UTI.
- Demonstrar fluxos entre os perfis de médico, enfermeiro e técnico de enfermagem.
- Explorar organização visual, usabilidade, regras de negócio e responsabilidades dos usuários.
- Servir como base para discussão, validação e evolução acadêmica do projeto.

## Funcionalidades demonstradas

- **Painel da UTI:** visão geral dos leitos, pacientes, prioridades e alertas.
- **Pacientes e prontuário:** consulta de pacientes e visualização de informações do atendimento, incluindo registro demonstrativo de sinais vitais.
- **Admissão e movimentação:** cadastro demonstrativo, alocação e movimentação entre leitos, riscos clínicos e encerramento de atendimento.
- **Prescrições:** registro demonstrativo de medicamentos e apresentação de alertas relacionados a alergias.
- **Aprazamento:** seleção e homologação demonstrativa de horários de medicamentos.
- **Checagem de enfermagem:** registro demonstrativo de administração ou não administração e marcação de itens da SAE.
- **Balanço hídrico:** lançamento de entradas e saídas e visualização de saldos calculados na tela.
- **Dispositivos invasivos:** acompanhamento demonstrativo de inserção, permanência e retirada.
- **Passagem de plantão:** compilação de informações, dispositivos e pendências para demonstrar a transição de cuidado.
- **Pendências:** visualização de tarefas atribuídas ao perfil demonstrativo selecionado.

Os fluxos e regras exibidos são exemplos para prototipação; não equivalem a protocolos clínicos validados.

## Tecnologias desta versão

O protótipo disponível neste repositório foi desenvolvido com:

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm para gerenciamento de dependências

Esta é a tecnologia da **versão de prototipação**. Python/Django, HTML/CSS, PostgreSQL e uma possível hospedagem em nuvem Azure são tecnologias consideradas para etapas futuras do projeto; não estão implementadas nesta versão.

## Como executar

### Pré-requisitos

- Node.js 22
- pnpm 10

As versões do ambiente do projeto também estão registradas em `.mise.toml`.

### Instalação e execução

Na pasta do projeto, execute:

```bash
pnpm install
pnpm dev
```

Abra no navegador o endereço local informado pelo Vite no terminal.

Para gerar uma versão de produção e testar a compilação:

```bash
pnpm build
```

### Acesso demonstrativo

Na tela inicial, selecione um perfil e preencha os campos de usuário e senha com valores fictícios. A autenticação é apenas demonstrativa; não há validação de credenciais reais.

## Persistência e limitações

- Algumas informações do protótipo são guardadas no `localStorage` do navegador. Isso permite demonstrar persistência local, mas não cria um banco de dados institucional nem sincroniza dados entre navegadores ou profissionais.
- Outros dados existem somente enquanto a tela ou sessão está aberta; por exemplo, os lançamentos do balanço hídrico não são persistidos após sair da tela ou recarregar a página.
- Não há backend, autenticação real, controle de acesso seguro, assinatura digital certificada, trilha de auditoria inviolável ou integração com dispositivos e sistemas hospitalares.
- Horários e regras clínicas são demonstrativos e podem depender do relógio e dos dados locais do navegador.
- O protótipo não substitui avaliação de profissionais, validação institucional, requisitos legais ou protocolos assistenciais.

## Estrutura principal

```text
src/
  App.tsx       Telas, fluxos e regras demonstrativas do protótipo
  index.css     Estilos globais e configuração visual
  main.tsx      Inicialização da aplicação React
public/         Arquivos públicos utilizados pela aplicação
```

## Documentação relacionada

- `DOC. AVICEN - PI.docx`: documento acadêmico do projeto, ainda em elaboração.
- `ATUALIZACOES_PRIORIDADE_2.md` e `ATUALIZACOES_PRIORIDADE_3.md`: registros de alterações e limitações dos fluxos demonstrativos.
- `AGENTS.md`: instruções de desenvolvimento e estrutura do projeto.

## Próximas etapas

As próximas etapas serão definidas pela equipe conforme a avaliação acadêmica e o avanço do curso. Entre os temas previstos para estudo e evolução estão aprofundar requisitos e modelagem, desenvolver componentes do sistema, persistência em banco de dados, segurança e implantação. As tecnologias e a arquitetura definitivas ainda precisam ser avaliadas e não são uma promessa de implementação ou prazo.

## Contexto acadêmico

Projeto Integrador do curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas da FATEC Taquaritinga. O AVICEN busca conectar a análise de um problema realista de software com o aprendizado progressivo de Engenharia de Software e das demais disciplinas do curso.