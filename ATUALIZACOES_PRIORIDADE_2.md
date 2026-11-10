# AVICEN — Prioridade 2: Integração assistencial

Esta versão mantém a interface original e acrescenta fluxos demonstrativos integrados:

- Aferições individuais e em lote passam a ser persistidas por identificador de atendimento no `localStorage`.
- A resposta clínica é exigida quando há três aferições consecutivas fora dos limites demonstrativos ou quando há valor extremo; alterações isoladas geram aviso informativo.
- Prescrições são separadas por leito. A prescrição do leito selecionado alimenta a grade de aprazamento e, após homologação, a lista de checagem do mesmo leito.
- A checagem de medicamentos e os itens da SAE são persistidos por leito no navegador.
- O horário exibido na checagem acompanha o relógio local.

## Teste rápido

1. Execute `npm install` e `npm run dev` na pasta que contém `package.json`.
2. Entre como médico, selecione o leito e registre uma prescrição.
3. Troque para enfermeiro, acesse Aprazamento no mesmo leito, selecione os horários e homologue.
4. Troque para técnico, acesse Checagem de enfermagem no mesmo leito e confirme uma administração ou registre não administração.
5. Na mesma tela, marque itens da SAE e recarregue a página para verificar a persistência local.
6. Abra o prontuário, registre sinais vitais; três aferições consecutivas alteradas ou um valor extremo geram resposta clínica obrigatória.

## Limites

Os limites de sinais vitais são regras demonstrativas configuráveis, não protocolos clínicos validados. A persistência é local ao navegador e não representa banco de dados institucional. Não há assinatura digital certificada, backend, auditoria inviolável ou integração com dispositivos médicos. Não utilizar para assistência real.
