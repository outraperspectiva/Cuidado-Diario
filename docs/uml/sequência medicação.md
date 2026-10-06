````mermaid
sequenceDiagram
    autonumber
    actor P as Paciente
    participant App as Frontend (Mobile/Web)
    participant API as Backend API
    participant DB as Banco de Dados
    
    P->>App: Acessa "Registrar Medicamento"
    App->>P: Exibe formulário de dosagem
    P->>App: Preenche dados e clica em Salvar
    
    rect rgb(240, 248, 255)
        Note right of App: Processo de Persistência
        App->>API: POST /api/rotinas/medicamento (Payload)
        API->>API: Valida payload e regras (Spec)
        API->>DB: INSERT dados de rotina
        DB-->>API: Confirmação e ID gerado
        API-->>App: HTTP 201 Created
    end
    
    App-->>P: Toast: "Registro salvo com sucesso"
    
    %% Processo Assíncrono
    rect rgb(255, 245, 238)
        Note left of API: Evento Assíncrono (Webhooks/Push)
        API->>P: Envia Push Notification
        P-->>App: Clica na notificação para ver detalhes
    end
