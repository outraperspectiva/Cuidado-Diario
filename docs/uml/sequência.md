````mermaid
sequenceDiagram
    autonumber
    
    actor U as Usuário
    participant F as Frontend (App/Web)
    participant A as API REST (Backend)
    participant D as Banco de Dados

    U->>F: Preenche/Confirma dados e clica "Salvar"
    activate F
    
    F->>A: POST /api/registros (JSON estruturado)
    activate A

    Note right of A: Validação de schema e<br>regras de negócio
    A->>A: Validar Payload

    A->>D: INSERT INTO registros (...)
    activate D
    D-->>A: Confirmação e ID do novo registro
    deactivate D

    A-->>F: 201 Created (Registro salvo)
    deactivate A

    Note left of F: Aplicativo atualiza os<br>dados da tela inicial
    F->>A: GET /api/dashboard/hoje
    activate A

    A->>D: SELECT métricas agregadas do dia
    activate D
    D-->>A: Retorna totalizadores (tempo, séries, etc)
    deactivate D

    A-->>F: 200 OK (Dados atualizados)
    deactivate A

    F-->>U: Renderiza Dashboard atualizado com sucesso
    deactivate F
