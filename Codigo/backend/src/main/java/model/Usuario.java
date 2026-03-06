package model;

import java.time.LocalDate;

public class Usuario {
    private int id;
    private String nome;
    private String email;
    private String senha;
    private LocalDate dataNascimento;
    private LocalDate dataAdicao;

    // Construtor vazio
    public Usuario() {
        this.id = -1;
        this.nome = "";
        this.email = "";
        this.senha = "";
        this.dataNascimento = LocalDate.now();
        this.dataAdicao = LocalDate.now();
    }

    // Construtor completo
    public Usuario(int id, String nome, String email, String senha, LocalDate dataNascimento, LocalDate dataAdicao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.dataAdicao = dataAdicao;
    }

    // Construtor sem ID (para inserção)
    public Usuario(String nome, String email, String senha, LocalDate dataNascimento) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public LocalDate getDataAdicao() {
        return dataAdicao;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public void setDataAdicao(LocalDate dataAdicao) {
        this.dataAdicao = dataAdicao;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", dataNascimento=" + dataNascimento +
                ", dataAdicao=" + dataAdicao +
                ", senha=" + senha +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Usuario usuario = (Usuario) obj;
        return id == usuario.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}
