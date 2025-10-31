package dao;

import util.EnvConfig;
import java.sql.*;

public class DAO {
    protected Connection conexao;

    // Configurações carregadas do .env
    private static final String URL = EnvConfig.getDbUrl();
    private static final String USUARIO = EnvConfig.getDbUser();
    private static final String SENHA = EnvConfig.getDbPassword();

    public DAO() {
        conexao = null;
    }

    /**
     * Estabelece conexão com o banco de dados
     */
    public boolean conectar() {
        String driverName = "org.postgresql.Driver";
        try {
            Class.forName(driverName);
            conexao = DriverManager.getConnection(URL, USUARIO, SENHA);
            return true;
        } catch (ClassNotFoundException e) {
            System.err.println("Driver não encontrado: " + e.getMessage());
            return false;
        } catch (SQLException e) {
            System.err.println("Erro ao conectar: " + e.getMessage());
            return false;
        }
    }

    /**
     * Fecha a conexão com o banco de dados
     */
    public boolean close() {
        try {
            if (conexao != null && !conexao.isClosed()) {
                conexao.close();
            }
            return true;
        } catch (SQLException e) {
            System.err.println("Erro ao fechar conexão: " + e.getMessage());
            return false;
        }
    }
}
