````mermaid
flowchart TD
    Inicio([Início]) --> Auth{Autenticação}
    
    Auth -->|Falha| Recuperacao[Recuperar Senha / Cadastro]
    Recuperacao --> Auth
    
    Auth -->|Sucesso JWT| Painel[Dashboard Principal]

    Painel --> Modulo1[Módulo de Rotinas]
    Painel --> Modulo2[Módulo de Saúde]
    Painel --> Modulo3[Módulo de Relatórios]

    %% Detalhamento do Módulo de Rotinas
    Modulo1 --> R1[Higiene e Banho]
    Modulo1 --> R2[Alimentação e Dieta]
    Modulo1 --> R3[Atividades Físicas]

    %% Detalhamento do Módulo de Saúde
    Modulo2 --> S1[Controle de Medicamentos]
    Modulo2 --> S2[Aferição de Sinais Vitais]
    S1 -->|Dispara Alerta| Notificacao((Serviço de Mensageria))

    %% Detalhamento do Módulo de Relatórios
    Modulo3 --> Rel1[Exportar Histórico Mensal]
    Modulo3 --> Rel2[Gráficos de Evolução]
    
    %% Fim de fluxos de ação
    R1 & R2 & R3 & S2 & Rel1 & Rel2 --> Fim([Ação Concluída])
    class SalvaDB db
