package dao;

import model.Alimento;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AlimentoDAO extends DAO {

    public AlimentoDAO() {
        super();
        conectar();
    }

    /**
     * Insere um novo alimento no banco de dados
     */
    public boolean insert(Alimento alimento) {
        boolean status = false;
        String sql = "INSERT INTO alimento (nome, categoria) VALUES (?, ?)";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, alimento.getNome());
            ps.setString(2, alimento.getCategoria());

            ps.executeUpdate();
            ps.close();
            status = true;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir alimento: " + e.getMessage());
        }
        return status;
    }

    /**
     * Lista todos os alimentos
     */
    public List<Alimento> getAll() {
        List<Alimento> alimentos = new ArrayList<>();
        String sql = "SELECT * FROM alimento ORDER BY categoria, nome";

        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                Alimento alimento = new Alimento();
                alimento.setId(rs.getInt("id"));
                alimento.setNome(rs.getString("nome"));
                alimento.setCategoria(rs.getString("categoria"));
                alimentos.add(alimento);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar alimentos: " + e.getMessage());
        }
        return alimentos;
    }

    /**
     * Busca um alimento por ID
     */
    public Alimento get(int id) {
        Alimento alimento = null;
        String sql = "SELECT * FROM alimento WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                alimento = new Alimento();
                alimento.setId(rs.getInt("id"));
                alimento.setNome(rs.getString("nome"));
                alimento.setCategoria(rs.getString("categoria"));
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar alimento: " + e.getMessage());
        }
        return alimento;
    }

    /**
     * Lista alimentos por categoria
     */
    public List<Alimento> getByCategoria(String categoria) {
        List<Alimento> alimentos = new ArrayList<>();
        String sql = "SELECT * FROM alimento WHERE categoria = ? ORDER BY nome";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, categoria);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Alimento alimento = new Alimento();
                alimento.setId(rs.getInt("id"));
                alimento.setNome(rs.getString("nome"));
                alimento.setCategoria(rs.getString("categoria"));
                alimentos.add(alimento);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar alimentos por categoria: " + e.getMessage());
        }
        return alimentos;
    }

    /**
     * Busca alimentos por nome (LIKE)
     */
    public List<Alimento> searchByNome(String nome) {
        List<Alimento> alimentos = new ArrayList<>();
        String sql = "SELECT * FROM alimento WHERE LOWER(nome) LIKE LOWER(?) ORDER BY nome";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, "%" + nome + "%");
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Alimento alimento = new Alimento();
                alimento.setId(rs.getInt("id"));
                alimento.setNome(rs.getString("nome"));
                alimento.setCategoria(rs.getString("categoria"));
                alimentos.add(alimento);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar alimentos por nome: " + e.getMessage());
        }
        return alimentos;
    }

    /**
     * Lista todas as categorias distintas
     */
    public List<String> getCategorias() {
        List<String> categorias = new ArrayList<>();
        String sql = "SELECT DISTINCT categoria FROM alimento WHERE categoria IS NOT NULL ORDER BY categoria";

        try {
            Statement st = conexao.createStatement();
            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                categorias.add(rs.getString("categoria"));
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar categorias: " + e.getMessage());
        }
        return categorias;
    }

    /**
     * Atualiza um alimento existente
     */
    public boolean update(Alimento alimento) {
        boolean status = false;
        String sql = "UPDATE alimento SET nome = ?, categoria = ? WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, alimento.getNome());
            ps.setString(2, alimento.getCategoria());
            ps.setInt(3, alimento.getId());

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar alimento: " + e.getMessage());
        }
        return status;
    }

    /**
     * Deleta um alimento por ID
     */
    public boolean delete(int id) {
        boolean status = false;
        String sql = "DELETE FROM alimento WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar alimento: " + e.getMessage());
        }
        return status;
    }
}