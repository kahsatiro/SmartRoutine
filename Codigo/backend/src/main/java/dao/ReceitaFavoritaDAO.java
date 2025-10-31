package dao;

import model.ReceitaFavorita;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReceitaFavoritaDAO extends DAO {

    public ReceitaFavoritaDAO() {
        super();
        conectar();
    }

    /**
     * Adiciona uma receita aos favoritos
     */
    public boolean insert(ReceitaFavorita favorita) {
        boolean status = false;
        String sql = "INSERT INTO receitas_favoritas (usuario_id, receita_id) VALUES (?, ?)";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, favorita.getUsuarioId());
            ps.setInt(2, favorita.getReceitaId());

            ps.executeUpdate();
            ps.close();
            status = true;
        } catch (SQLException e) {
            // Verifica se é erro de duplicata
            if (e.getMessage().contains("duplicate key")) {
                System.err.println("Receita já está nos favoritos");
            } else {
                System.err.println("Erro ao adicionar favorito: " + e.getMessage());
            }
        }
        return status;
    }

    /**
     * Lista todas as receitas favoritas
     */
    public List<ReceitaFavorita> getAll() {
        List<ReceitaFavorita> favoritas = new ArrayList<>();
        String sql = "SELECT rf.*, u.nome as nome_usuario, r.titulo as titulo_receita " +
                "FROM receitas_favoritas rf " +
                "JOIN usuario u ON rf.usuario_id = u.id " +
                "JOIN receita r ON rf.receita_id = r.id " +
                "ORDER BY rf.data_adicao DESC";

        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                ReceitaFavorita favorita = extractFromResultSet(rs);
                favoritas.add(favorita);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar favoritas: " + e.getMessage());
        }
        return favoritas;
    }

    /**
     * Busca uma receita favorita por ID
     */
    public ReceitaFavorita get(int id) {
        ReceitaFavorita favorita = null;
        String sql = "SELECT rf.*, u.nome as nome_usuario, r.titulo as titulo_receita " +
                "FROM receitas_favoritas rf " +
                "JOIN usuario u ON rf.usuario_id = u.id " +
                "JOIN receita r ON rf.receita_id = r.id " +
                "WHERE rf.id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                favorita = extractFromResultSet(rs);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar favorita: " + e.getMessage());
        }
        return favorita;
    }

    /**
     * Lista receitas favoritas de um usuário
     */
    public List<ReceitaFavorita> getByUsuario(int usuarioId) {
        List<ReceitaFavorita> favoritas = new ArrayList<>();
        String sql = "SELECT rf.*, u.nome as nome_usuario, r.titulo as titulo_receita " +
                "FROM receitas_favoritas rf " +
                "JOIN usuario u ON rf.usuario_id = u.id " +
                "JOIN receita r ON rf.receita_id = r.id " +
                "WHERE rf.usuario_id = ? " +
                "ORDER BY rf.data_adicao DESC";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                ReceitaFavorita favorita = extractFromResultSet(rs);
                favoritas.add(favorita);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar favoritas por usuário: " + e.getMessage());
        }
        return favoritas;
    }

    /**
     * Lista usuários que favoritaram uma receita
     */
    public List<ReceitaFavorita> getByReceita(int receitaId) {
        List<ReceitaFavorita> favoritas = new ArrayList<>();
        String sql = "SELECT rf.*, u.nome as nome_usuario, r.titulo as titulo_receita " +
                "FROM receitas_favoritas rf " +
                "JOIN usuario u ON rf.usuario_id = u.id " +
                "JOIN receita r ON rf.receita_id = r.id " +
                "WHERE rf.receita_id = ? " +
                "ORDER BY rf.data_adicao DESC";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, receitaId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                ReceitaFavorita favorita = extractFromResultSet(rs);
                favoritas.add(favorita);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar favoritas por receita: " + e.getMessage());
        }
        return favoritas;
    }

    /**
     * Verifica se uma receita está nos favoritos do usuário
     */
    public boolean isFavorita(int usuarioId, int receitaId) {
        boolean favorita = false;
        String sql = "SELECT COUNT(*) FROM receitas_favoritas WHERE usuario_id = ? AND receita_id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ps.setInt(2, receitaId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                favorita = rs.getInt(1) > 0;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao verificar favorita: " + e.getMessage());
        }
        return favorita;
    }

    /**
     * Conta quantas vezes uma receita foi favoritada
     */
    public int countByReceita(int receitaId) {
        int count = 0;
        String sql = "SELECT COUNT(*) FROM receitas_favoritas WHERE receita_id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, receitaId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                count = rs.getInt(1);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao contar favoritas: " + e.getMessage());
        }
        return count;
    }

    /**
     * Remove uma receita dos favoritos por ID
     */
    public boolean delete(int id) {
        boolean status = false;
        String sql = "DELETE FROM receitas_favoritas WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar favorita: " + e.getMessage());
        }
        return status;
    }

    /**
     * Remove uma receita dos favoritos por usuário e receita
     */
    public boolean deleteByUsuarioReceita(int usuarioId, int receitaId) {
        boolean status = false;
        String sql = "DELETE FROM receitas_favoritas WHERE usuario_id = ? AND receita_id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, usuarioId);
            ps.setInt(2, receitaId);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar favorita: " + e.getMessage());
        }
        return status;
    }

    /**
     * Extrai dados do ResultSet para um objeto ReceitaFavorita
     */
    private ReceitaFavorita extractFromResultSet(ResultSet rs) throws SQLException {
        ReceitaFavorita favorita = new ReceitaFavorita();
        favorita.setId(rs.getInt("id"));
        favorita.setUsuarioId(rs.getInt("usuario_id"));
        favorita.setReceitaId(rs.getInt("receita_id"));

        Timestamp timestamp = rs.getTimestamp("data_adicao");
        if (timestamp != null) {
            favorita.setDataAdicao(timestamp.toLocalDateTime());
        }

        favorita.setNomeUsuario(rs.getString("nome_usuario"));
        favorita.setTituloReceita(rs.getString("titulo_receita"));

        return favorita;
    }
}
