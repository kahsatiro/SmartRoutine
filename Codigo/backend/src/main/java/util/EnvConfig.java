package util;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv;

    static {
        try {
            // Tenta carregar do arquivo .env
            dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar arquivo .env: " + e.getMessage());
        }
    }

    /**
     * Obtém uma variável de ambiente
     * Prioridade: 1. Variável do sistema, 2. Arquivo .env, 3. Valor padrão
     */
    public static String get(String key, String defaultValue) {
        // Primeiro tenta pegar da variável de ambiente do sistema
        String systemValue = System.getenv(key);
        if (systemValue != null && !systemValue.isEmpty()) {
            return systemValue;
        }

        // Depois tenta do arquivo .env
        String envValue = dotenv.get(key);
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }

        // Por último, retorna o valor padrão
        return defaultValue;
    }

    /**
     * Obtém uma variável de ambiente (sem valor padrão)
     */
    public static String get(String key) {
        return get(key, null);
    }

    /**
     * Obtém uma variável como inteiro
     */
    public static int getInt(String key, int defaultValue) {
        String value = get(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    // ==================== Configurações do Banco ====================

    public static String getDbHost() {
        return get("DB_HOST", "localhost");
    }

    public static String getDbPort() {
        return get("DB_PORT", "5432");
    }

    public static String getDbName() {
        return get("DB_NAME", "smart_routine_db");
    }

    public static String getDbUser() {
        return get("DB_USER", "postgres");
    }

    public static String getDbPassword() {
        return get("DB_PASSWORD", "");
    }

    public static String getDbUrl() {
        return String.format("jdbc:postgresql://%s:%s/%s",
                getDbHost(),
                getDbPort(),
                getDbName()
        );
    }

    // ==================== Configurações da API ====================
    
    public static int getApiPort() {
        // O ProcessBuilder nos ajuda a ler as variáveis de ambiente do sistema
        ProcessBuilder processBuilder = new ProcessBuilder();
        
        // O Azure define a variável de ambiente 'PORT'
        String portVar = processBuilder.environment().get("PORT");
        
        if (portVar != null && !portVar.isEmpty()) {
            try {
                // Se a variável existir, converte para inteiro e retorna
                return Integer.parseInt(portVar);
            } catch (NumberFormatException e) {
                // Se der erro na conversão, loga o erro e usa a porta padrão
                System.err.println("AVISO: A variável PORT ('" + portVar + "') não é um número válido. Usando porta padrão 6789.");
            }
        }
        
        // Se a variável PORT não existir (rodando localmente), retorna sua porta padrão
        return 6789;
    }
}
