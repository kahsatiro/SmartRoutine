package dao;

import model.Registra;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RegistraDAO extends DAO {

    public RegistraDAO() {
        super();
        conectar();
    }

    /**
     * Insere um novo registro de compra
     */
    public boolean insert(Registra registra) {
        boolean status = false;
        String sql = "INSERT INTO registra (alimento_id, usuario_id, data_compra, data_validade, " +
                "unidade_medida, lote, quantidade) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, registra.getAlimentoId());
            ps.setInt(2, registra.getUsuarioId());
            ps.setDate(3, Date.valueOf(registra.getDataCompra()));
            ps.setDate(4, registra.getDataValidade() != null ? Date.valueOf(registra.getDataValidade()) : null);
            ps.setString(5, registra.getUnidadeMedida());
            ps.setString(6, registra.getLote());
            ps.setBigDecimal(7, registra.getQuantidade());

            ps.executeUpdate();
            ps.close();
            status = true;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir registro: " + e.getMessage());
        }
        return status;
    }

    /**
     * Lista todos os registros com informações de alimento e usuário
     */
    public List<Registra> getAll() {
        List<Registra> registros = new ArrayList<>();
        String sql = "SELECT r.*, a.nome as nome_alimento, u.nome as nome_usuario " +
                "FROM registra r " +
                "JOIN alimento a ON r.alimento_id = a.id " +
                "JOIN usuario u ON r.usuario_id = u.id " +
                "ORDER BY r.data_compra DESC";

        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                Registra registra = extractFromResultSet(rs);
                registros.add(registra);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar registros: " + e.getMessage());
        }
        return registros;
    }

    /**
     * Busca um registro por ID
     */
    public Registra get(int id) {
        Registra registra = null;
        String sql = "SELECT r.*, a.nome as nome_alimento, u.nome as nome_usuario " +
                "FROM registra r " +
                "JOIN alimento a ON r.alimento_id = a.id " +
                "JOIN usuario u ON r.usuario_id = u.id " +
                "WHERE r.id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                registra = extractFromResultSet(rs);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar registro: " + e.getMessage());
        }
        return registra;
    }

    /**
     * Lista registros por usuário
     */
    public List<Registra> getByUsuario(int usuarioId) {
        List<Registra> registros = new ArrayList<>();
        String sql = "SELECT r.*, a.nome as nome_alimento, u.nome as nome_usuario " +
                "FROM registra r " +
                "JOIN alimento a ON r.alimento_id = a.id " +
                "JOIN usuario u ON r.usuario_id = u.id " +
                "WHERE r.usuario_id = ? " +
                "ORDER BY r.data_compra DESC";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Registra registra = extractFromResultSet(rs);
                registros.add(registra);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar registros por usuário: " + e.getMessage());
        }
        return registros;
    }

    /**
     * Lista alimentos próximos do vencimento
     */
    public List<Registra> getProximosVencimento(int usuarioId, int dias) {
        List<Registra> registros = new ArrayList<>();
        String sql = "SELECT r.*, a.nome as nome_alimento, u.nome as nome_usuario " +
                "FROM registra r " +
                "JOIN alimento a ON r.alimento_id = a.id " +
                "JOIN usuario u ON r.usuario_id = u.id " +
                "WHERE r.usuario_id = ? " +
                "AND r.data_validade IS NOT NULL " +
                "AND r.data_validade BETWEEN CURRENT_DATE AND CURRENT_DATE + ? " +
                "ORDER BY r.data_validade ASC";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ps.setInt(2, dias);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Registra registra = extractFromResultSet(rs);
                registros.add(registra);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar alimentos próximos ao vencimento: " + e.getMessage());
        }
        return registros;
    }

    /**
     * Lista alimentos vencidos
     */
    public List<Registra> getVencidos(int usuarioId) {
        List<Registra> registros = new ArrayList<>();
        String sql = "SELECT r.*, a.nome as nome_alimento, u.nome as nome_usuario " +
                "FROM registra r " +
                "JOIN alimento a ON r.alimento_id = a.id " +
                "JOIN usuario u ON r.usuario_id = u.id " +
                "WHERE r.usuario_id = ? " +
                "AND r.data_validade < CURRENT_DATE " +
                "ORDER BY r.data_validade ASC";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Registra registra = extractFromResultSet(rs);
                registros.add(registra);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar alimentos vencidos: " + e.getMessage());
        }
        return registros;
    }

    /**
     * Atualiza um registro existente
     */
    public boolean update(Registra registra) {
        boolean status = false;
        String sql = "UPDATE registra SET alimento_id = ?, usuario_id = ?, data_compra = ?, " +
                "data_validade = ?, unidade_medida = ?, lote = ?, quantidade = ? WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, registra.getAlimentoId());
            ps.setInt(2, registra.getUsuarioId());
            ps.setDate(3, Date.valueOf(registra.getDataCompra()));
            ps.setDate(4, registra.getDataValidade() != null ? Date.valueOf(registra.getDataValidade()) : null);
            ps.setString(5, registra.getUnidadeMedida());
            ps.setString(6, registra.getLote());
            ps.setBigDecimal(7, registra.getQuantidade());
            ps.setInt(8, registra.getId());

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar registro: " + e.getMessage());
        }
        return status;
    }

    /**
     * Deleta um registro por ID
     */
    public boolean delete(int id) {
        boolean status = false;
        String sql = "DELETE FROM registra WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar registro: " + e.getMessage());
        }
        return status;
    }

    /**
     * Extrai dados do ResultSet para um objeto Registra
     */
    private Registra extractFromResultSet(ResultSet rs) throws SQLException {
        Registra registra = new Registra();
        registra.setId(rs.getInt("id"));
        registra.setAlimentoId(rs.getInt("alimento_id"));
        registra.setUsuarioId(rs.getInt("usuario_id"));
        registra.setDataCompra(rs.getDate("data_compra").toLocalDate());

        Date dataValidade = rs.getDate("data_validade");
        if (dataValidade != null) {
            registra.setDataValidade(dataValidade.toLocalDate());
        }

        registra.setUnidadeMedida(rs.getString("unidade_medida"));
        registra.setLote(rs.getString("lote"));
        registra.setQuantidade(rs.getBigDecimal("quantidade"));
        registra.setNomeAlimento(rs.getString("nome_alimento"));
        registra.setNomeUsuario(rs.getString("nome_usuario"));

        return registra;
    }
}
