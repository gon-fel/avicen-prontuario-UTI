# AVICEN — Prioridade 3: Rastreabilidade

## Alterações
- Pendências agora possuem profissional e perfil responsáveis, são filtradas para o profissional conectado e registram data/hora e executor da conclusão. Estado persistido em `localStorage`.
- Contador do sino acompanha apenas pendências abertas atribuídas ao profissional/perfil atual.
- Registros novos de dispositivos usam data/hora local do sistema e profissional selecionado; dispositivos são vinculados ao ID de atendimento, compartilhados com a passagem de plantão e persistidos no navegador.
- A tela de passagem de plantão lista pacientes atualmente internados, deriva status de prontidão de aferições, dispositivos e pendências reais do protótipo, compila os dispositivos ativos por atendimento e importa a última aferição registrada.
- Transmissão e aceite usam data/hora atual e exigem resumo clínico e revisão dos dados disponíveis.
- Datas/horários fixos em alguns campos de ação foram substituídos pelo relógio local do sistema.

## Limitações
Este é um protótipo local: `localStorage` não oferece trilha de auditoria inviolável, autenticação real, sincronização multiusuário ou relógio de servidor. Identidade e assinatura são demonstrativas. Dados clínicos e regras de prontidão precisam de validação institucional antes de qualquer uso assistencial.
