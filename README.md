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

- **Interface:** temas claro e escuro, ajuste de tamanho de texto e layout adaptável.
- **Painel da UTI:** ocupação, prioridades e Safety Huddle demonstrativo de pacientes, exames, equipamentos e infraestrutura.
- **Pacientes e prontuário:** busca, filtros e prontuário em abas, com alertas de alergias e comorbidades e registro demonstrativo de sinais vitais.
- **Admissão e movimentação:** admissão a partir de dados fictícios da Recepção ou do NIR, alocação e transferência entre leitos. Na alta, o médico registra a decisão, o enfermeiro organiza o destino e o técnico confirma o transporte; no óbito, o prontuário fica restrito à consulta da evolução de óbito.
- **Prescrições:** médico registra itens de dietas, medicamentos, exames e cuidados especiais; o protótipo verifica correspondências demonstrativas com alergias. A prescrição tem versões locais e histórico de consulta.
- **Aprazamento e checagem:** o enfermeiro define e homologa horários. Após a homologação, os três perfis podem checar ou registrar a não administração na grade; esta exige motivo e justificativa. Itens suspensos e prescrições suspensas ou expiradas ficam bloqueados para checagem.
- **Balanço hídrico:** grade horária de entradas e saídas, totais realizados e previstos e homologação pelo enfermeiro. Valores previstos exigem confirmação para se tornarem realizados.
- **Dispositivos invasivos:** registros demonstrativos de inserção e retirada e consulta de dispositivos ativos ou retirados.
- **Evoluções:** anotações por perfil, filtro de histórico e validação demonstrativa da anamnese pelo enfermeiro.
- **Exames:** tabela de consulta de resultados e laudos, com hemograma e ilustrações fictícias de exames de imagem. O registro de resultados e laudos ainda não está disponível.
- **Passagem de plantão:** revisão por paciente, rascunhos locais e relatório único para impressão ou PDF com dados dos pacientes ativos e anotações manuais. A transmissão e o aceite continuam sendo simulações opcionais.
- **Pendências:** tarefas demonstrativas atribuídas ao perfil e profissional selecionados.

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

No PowerShell do Windows, caso a execução de scripts esteja bloqueada, use `pnpm.cmd install` e `pnpm.cmd dev`.

Para gerar uma versão de produção e testar a compilação:

```bash
pnpm build
```

### Acesso demonstrativo

Na tela inicial, use uma das contas fictícias abaixo. O perfil é definido pela conta; a validação é apenas demonstrativa e não oferece segurança real.

| Perfil | Usuário | Senha demonstrativa |
| --- | --- | --- |
| Médico | `medico` | `medico123` |
| Enfermeiro | `enfermeiro` | `enfermeiro123` |
| Técnico | `tecnico` | `tecnico123` |

## Persistência e limitações

- Algumas informações, incluindo lançamentos e homologações do balanço hídrico, são guardadas no `localStorage` do navegador. Isso permite demonstrar persistência local, mas não cria um banco de dados institucional nem sincroniza dados entre navegadores ou profissionais.
- Outros dados existem somente enquanto a tela ou sessão está aberta, como a resposta clínica aos alertas e a simulação de transmissão e aceite do plantão. O rascunho do plantão pode ser salvo localmente.
- Para exportar a passagem, revise e salve o rascunho de cada paciente ativo durante a visita à tela. A revisão é reiniciada ao sair da tela, mas os rascunhos permanecem no navegador. Medicações em infusão e pendências do relatório são anotações manuais; os dados apresentados devem ser conferidos.
- Não há backend, autenticação real, controle de acesso seguro, assinatura digital certificada, trilha de auditoria inviolável ou integração com dispositivos e sistemas hospitalares.
- Os exemplos de exames e imagens são fictícios e não diagnósticos; o histórico de prescrição não reconstrói os horários de versões anteriores.
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