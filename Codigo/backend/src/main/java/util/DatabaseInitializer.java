package util;

import dao.DAO;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseInitializer extends DAO {

    // Caminhos dos arquivos SQL
    private static final String SCHEMA_FILE = "src/main/java/db/schema.sql";
    private static final String SEED_FILE = "src/main/java/db/seed.sql";

    public DatabaseInitializer() {
        super();
        conectar();
    }

    /**
     * Método principal para executar a inicialização
     */
    public static void main(String[] args) {
        printHeader();

        DatabaseInitializer initializer = new DatabaseInitializer();

        try {
            // Verificar conexão
            if (!initializer.testConnection()) {
                System.err.println("❌ Não foi possível conectar ao banco de dados!");
                System.err.println("   Verifique se o PostgreSQL está rodando e as credenciais estão corretas.");
                System.exit(1);
            }

            System.out.println();

            // 1. Executar Schema
            System.out.println("📋 [1/2] Executando schema.sql...");
            initializer.executeScript(SCHEMA_FILE);
            System.out.println("✅ Schema criado com sucesso!");
            System.out.println();

            // 2. Executar Seed
            System.out.println("🌱 [2/2] Executando seed.sql...");
            initializer.executeScript(SEED_FILE);
            System.out.println("✅ Dados inseridos com sucesso!");
            System.out.println();

            // Exibir estatísticas
            initializer.showStatistics();

            System.out.println();
            System.out.println("╔════════════════════════════════════════════════════════════╗");
            System.out.println("║            BANCO DE DADOS INICIALIZADO! 🎉                 ║");
            System.out.println("╚════════════════════════════════════════════════════════════╝");

        } catch (Exception e) {
            System.err.println();
            System.err.println("❌ ERRO: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        } finally {
            initializer.close();
        }
    }

    /**
     * Executa um script SQL a partir de um arquivo
     */
    private void executeScript(String path) {
        try (BufferedReader br = new BufferedReader(new FileReader(path));
             Statement stmt = conexao.createStatement()) {

            StringBuilder sql = new StringBuilder();
            String linha;
            int comandosExecutados = 0;
            int linhaAtual = 0;

            System.out.println("   📄 Arquivo: " + path);
            System.out.print("   ▶️  Executando: ");

            while ((linha = br.readLine()) != null) {
                linhaAtual++;
                linha = linha.trim();

                // Ignorar linhas vazias e comentários
                if (linha.isEmpty() || linha.startsWith("--")) {
                    continue;
                }

                // Ignorar comandos específicos do psql
                if (linha.matches("\\\\c\\s+\\w+.*") ||
                        linha.equalsIgnoreCase("VACUUM ANALYZE;") ||
                        linha.equalsIgnoreCase("VACUUM ANALYZE")) {
                    continue;
                }

                // Acumular linha no comando SQL
                sql.append(linha).append(" ");

                // Se a linha termina com ponto e vírgula, executar o comando
                if (linha.endsWith(";")) {
                    String comando = sql.toString().trim();

                    if (!comando.isEmpty()) {
                        try {
                            stmt.execute(comando);
                            comandosExecutados++;

                            // Mostrar progresso visual
                            if (comandosExecutados % 5 == 0) {
                                System.out.print("█");
                            } else if (comandosExecutados % 2 == 0) {
                                System.out.print("▓");
                            }

                        } catch (SQLException e) {
                            // Ignorar alguns erros esperados
                            String errorMsg = e.getMessage().toLowerCase();
                            if (!errorMsg.contains("already exists") &&
                                    !errorMsg.contains("does not exist") &&
                                    !errorMsg.contains("duplicate")) {
                                System.err.println("\n   ⚠️  Aviso na linha " + linhaAtual + ": " + e.getMessage());
                            }
                        }
                    }

                    // Limpar StringBuilder para próximo comando
                    sql.setLength(0);
                }
            }

            System.out.println(" ✓");
            System.out.println("   ✓ Comandos executados: " + comandosExecutados);

        } catch (IOException e) {
            System.err.println("   ❌ Erro ao ler arquivo: " + e.getMessage());
            throw new RuntimeException("Erro ao ler arquivo SQL: " + path, e);
        } catch (SQLException e) {
            System.err.println("   ❌ Erro ao executar SQL: " + e.getMessage());
            throw new RuntimeException("Erro ao executar script SQL", e);
        }
    }

    /**
     * Testa a conexão com o banco de dados
     */
    private boolean testConnection() {
        System.out.print("🔌 Testando conexão com o banco de dados... ");
        try {
            if (conexao != null && !conexao.isClosed()) {
                System.out.println("✅ Conectado!");
                return true;
            } else {
                System.out.println("❌ Falhou!");
                return false;
            }
        } catch (SQLException e) {
            System.out.println("❌ Falhou!");
            System.err.println("   Erro: " + e.getMessage());
            return false;
        }
    }

    /**
     * Exibe estatísticas do banco de dados após inicialização
     */
    private void showStatistics() {
        String[] tables = {"usuario", "alimento", "receita", "registra", "receitas_favoritas"};

        System.out.println("📊 ESTATÍSTICAS DO BANCO DE DADOS:");
        System.out.println("─────────────────────────────────────");

        try (Statement stmt = conexao.createStatement()) {
            int totalRecords = 0;

            for (String table : tables) {
                String sql = "SELECT COUNT(*) FROM " + table;
                ResultSet rs = stmt.executeQuery(sql);
                if (rs.next()) {
                    int count = rs.getInt(1);
                    totalRecords += count;
                    String tableName = capitalize(table.replace("_", " "));
                    System.out.printf("   %-25s: %3d registros\n", tableName, count);
                }
                rs.close();
            }

            System.out.println("─────────────────────────────────────");
            System.out.printf("   %-25s: %3d registros\n", "TOTAL", totalRecords);

        } catch (SQLException e) {
            System.err.println("⚠️  Erro ao obter estatísticas: " + e.getMessage());
        }
    }

    /**
     * Capitaliza a primeira letra de cada palavra
     */
    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }

        String[] words = str.split(" ");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }

        return result.toString().trim();
    }

    /**
     * Imprime o cabeçalho do programa
     */
    private static void printHeader() {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║     SMART ROUTINE - INICIALIZAÇÃO DO BANCO DE DADOS       ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
    }
}
