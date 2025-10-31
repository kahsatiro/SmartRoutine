package dao;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import model.Receita;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReceitaDAO extends DAO {

    private Gson gson;

    public ReceitaDAO() {
        super();
        conectar();
        this.gson = new Gson();
    }

    /**
     * Insere uma nova receita no banco de dados
     */
    public boolean insert(Receita receita) {
        boolean status = false;
        String sql = "INSERT INTO receita (titulo, porcao, tempo_preparo, informacoes) VALUES (?, ?, ?, ?::jsonb)";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, receita.getTitulo());
            ps.setString(2, receita.getPorcao());
            ps.setInt(3, receita.getTempoPreparo());
            ps.setString(4, receita.getInformacoes().toString());

            ps.executeUpdate();
            ps.close();
            status = true;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir receita: " + e.getMessage());
        }
        return status;
    }

    /**
     * Lista todas as receitas
     */
    public List<Receita> getAll() {
        List<Receita> receitas = new ArrayList<>();
        String sql = "SELECT * FROM receita ORDER BY titulo";

        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                Receita receita = new Receita();
                receita.setId(rs.getInt("id"));
                receita.setTitulo(rs.getString("titulo"));
                receita.setPorcao(rs.getString("porcao"));
                receita.setTempoPreparo(rs.getInt("tempo_preparo"));

                String jsonString = rs.getString("informacoes");
                JsonObject jsonObj = gson.fromJson(jsonString, JsonObject.class);
                receita.setInformacoes(jsonObj);

                receitas.add(receita);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar receitas: " + e.getMessage());
        }
        return receitas;
    }

    /**
     * Busca uma receita por ID
     */
    public Receita get(int id) {
        Receita receita = null;
        String sql = "SELECT * FROM receita WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                receita = new Receita();
                receita.setId(rs.getInt("id"));
                receita.setTitulo(rs.getString("titulo"));
                receita.setPorcao(rs.getString("porcao"));
                receita.setTempoPreparo(rs.getInt("tempo_preparo"));

                String jsonString = rs.getString("informacoes");
                JsonObject jsonObj = gson.fromJson(jsonString, JsonObject.class);
                receita.setInformacoes(jsonObj);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar receita: " + e.getMessage());
        }
        return receita;
    }

    /**
     * Busca receitas por título (LIKE)
     */
    public List<Receita> searchByTitulo(String titulo) {
        List<Receita> receitas = new ArrayList<>();
        String sql = "SELECT * FROM receita WHERE LOWER(titulo) LIKE LOWER(?) ORDER BY titulo";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, "%" + titulo + "%");
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Receita receita = new Receita();
                receita.setId(rs.getInt("id"));
                receita.setTitulo(rs.getString("titulo"));
                receita.setPorcao(rs.getString("porcao"));
                receita.setTempoPreparo(rs.getInt("tempo_preparo"));

                String jsonString = rs.getString("informacoes");
                JsonObject jsonObj = gson.fromJson(jsonString, JsonObject.class);
                receita.setInformacoes(jsonObj);

                receitas.add(receita);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar receitas por título: " + e.getMessage());
        }
        return receitas;
    }

    /**
     * Busca receitas por tempo de preparo máximo
     */
    public List<Receita> getByTempoMaximo(int tempoMaximo) {
        List<Receita> receitas = new ArrayList<>();
        String sql = "SELECT * FROM receita WHERE tempo_preparo <= ? ORDER BY tempo_preparo";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, tempoMaximo);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Receita receita = new Receita();
                receita.setId(rs.getInt("id"));
                receita.setTitulo(rs.getString("titulo"));
                receita.setPorcao(rs.getString("porcao"));
                receita.setTempoPreparo(rs.getInt("tempo_preparo"));

                String jsonString = rs.getString("informacoes");
                JsonObject jsonObj = gson.fromJson(jsonString, JsonObject.class);
                receita.setInformacoes(jsonObj);

                receitas.add(receita);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar receitas por tempo: " + e.getMessage());
        }
        return receitas;
    }

    /**
     * Busca receitas por tag usando operador JSONB
     */
    public List<Receita> getByTag(String tag) {
        List<Receita> receitas = new ArrayList<>();
        String sql = "SELECT * FROM receita WHERE informacoes->'tags' @> ?::jsonb ORDER BY titulo";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, "[\"" + tag + "\"]");
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Receita receita = new Receita();
                receita.setId(rs.getInt("id"));
                receita.setTitulo(rs.getString("titulo"));
                receita.setPorcao(rs.getString("porcao"));
                receita.setTempoPreparo(rs.getInt("tempo_preparo"));

                String jsonString = rs.getString("informacoes");
                JsonObject jsonObj = gson.fromJson(jsonString, JsonObject.class);
                receita.setInformacoes(jsonObj);

                receitas.add(receita);
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar receitas por tag: " + e.getMessage());
        }
        return receitas;
    }

    /**
     * Atualiza uma receita existente
     */
    public boolean update(Receita receita) {
        boolean status = false;
        String sql = "UPDATE receita SET titulo = ?, porcao = ?, tempo_preparo = ?, informacoes = ?::jsonb WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, receita.getTitulo());
            ps.setString(2, receita.getPorcao());
            ps.setInt(3, receita.getTempoPreparo());
            ps.setString(4, receita.getInformacoes().toString());
            ps.setInt(5, receita.getId());

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar receita: " + e.getMessage());
        }
        return status;
    }

    /**
     * Deleta uma receita por ID
     */
    public boolean delete(int id) {
        boolean status = false;
        String sql = "DELETE FROM receita WHERE id = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar receita: " + e.getMessage());
        }
        return status;
    }
}