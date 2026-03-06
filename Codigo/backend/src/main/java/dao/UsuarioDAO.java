package dao;

import model.Usuario;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt; 

public class UsuarioDAO extends DAO {

    public UsuarioDAO() {
        super();
        conectar();
    }

    /**
     * Insere um novo usuário
     */
    public boolean insert(Usuario usuario) {
        boolean status = false;
        
        // Gera o HASH da senha antes de salvar
        String senhaHashed = BCrypt.hashpw(usuario.getSenha(), BCrypt.gensalt());

        // SQL Injection protegido com '?'
        String sql = "INSERT INTO usuario (nome, email, senha, data_nascimento, data_adicao) VALUES (?, ?, ?, ?, ?)";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, senhaHashed);
            ps.setDate(4, Date.valueOf(usuario.getDataNascimento()));
            ps.setDate(5, Date.valueOf(usuario.getDataAdicao()));

            ps.executeUpdate();
            ps.close();
            status = true;
        } catch (SQLException e) {
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
        }
        return status;
    }

    /**
     * Valida login de usuário (COMPARANDO HASH)
     */
    public Usuario authenticate(String email, String senhaDigitada) {
        Usuario usuario = null;
        
        // Busca APENAS pelo email (nunca pela senha)
        String sql = "SELECT * FROM usuario WHERE email = ?";

        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                // Pega a senha criptografada do banco
                String senhaDoBanco = rs.getString("senha");

                // O BCrypt verifica se a senha digitada bate com o Hash do banco
                if (BCrypt.checkpw(senhaDigitada, senhaDoBanco)) {
                    usuario = new Usuario();
                    usuario.setId(rs.getInt("id"));
                    usuario.setNome(rs.getString("nome"));
                    usuario.setEmail(rs.getString("email"));
                    usuario.setSenha(senhaDoBanco); 
                    usuario.setDataNascimento(rs.getDate("data_nascimento").toLocalDate());
                    usuario.setDataAdicao(rs.getDate("data_adicao").toLocalDate());
                }
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao autenticar usuário: " + e.getMessage());
        }
        return usuario;
    }

    /**
     * Lista todos os usuários
     */
    public List<Usuario> getAll() {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario ORDER BY id";
        try {
            Statement st = conexao.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = st.executeQuery(sql);
            while (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                usuario.setSenha(rs.getString("senha"));
                usuario.setDataNascimento(rs.getDate("data_nascimento").toLocalDate());
                usuario.setDataAdicao(rs.getDate("data_adicao").toLocalDate());
                usuarios.add(usuario);
            }
            st.close();
        } catch (SQLException e) {
            System.err.println("Erro ao listar: " + e.getMessage());
        }
        return usuarios;
    }
    
    /**
     * Busca um usuário por ID
     */
    public Usuario get(int id) {
        Usuario usuario = null;
        String sql = "SELECT * FROM usuario WHERE id = ?";
        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                usuario.setSenha(rs.getString("senha"));
                usuario.setDataNascimento(rs.getDate("data_nascimento").toLocalDate());
                usuario.setDataAdicao(rs.getDate("data_adicao").toLocalDate());
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar: " + e.getMessage());
        }
        return usuario;
    }
    
    /**
     * Busca um usuário por email
     */
    public Usuario getByEmail(String email) {
        Usuario usuario = null;
        String sql = "SELECT * FROM usuario WHERE email = ?";
        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                usuario.setSenha(rs.getString("senha"));
                usuario.setDataNascimento(rs.getDate("data_nascimento").toLocalDate());
                usuario.setDataAdicao(rs.getDate("data_adicao").toLocalDate());
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao buscar por email: " + e.getMessage());
        }
        return usuario;
    }
    
    /**
     * Atualiza um usuário existente
     */
    public boolean update(Usuario usuario) {
        boolean status = false;
        String sql = "UPDATE usuario SET nome = ?, email = ?, senha = ?, data_nascimento = ? WHERE id = ?";
        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getEmail());

            String novaSenha = usuario.getSenha();
            if (novaSenha != null && !novaSenha.startsWith("$2")) {
                    novaSenha = BCrypt.hashpw(novaSenha, BCrypt.gensalt());
            }

            ps.setString(3, novaSenha);
            ps.setDate(4, Date.valueOf(usuario.getDataNascimento()));
            ps.setInt(5, usuario.getId());
            int rows = ps.executeUpdate();
            if (rows > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
        }
        return status;
    }
    
    /**
     * Deleta um usuário por ID
     */
    public boolean delete(int id) {
        boolean status = false;
        String sql = "DELETE FROM usuario WHERE id = ?";
        try {
            PreparedStatement ps = conexao.prepareStatement(sql);
            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            if (rows > 0) {
                status = true;
            }
            ps.close();
        } catch (SQLException e) {
            System.err.println("Erro ao deletar usuário: " + e.getMessage());
        }
        return status;
    }
}
