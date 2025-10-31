package model;

public class Alimento {
    private int id;
    private String nome;
    private String categoria;

    // Construtor vazio
    public Alimento() {
        this.id = -1;
        this.nome = "";
        this.categoria = "";
    }

    // Construtor completo
    public Alimento(int id, String nome, String categoria) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
    }

    // Construtor sem ID (para inserção)
    public Alimento(String nome, String categoria) {
        this.nome = nome;
        this.categoria = categoria;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCategoria() {
        return categoria;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    @Override
    public String toString() {
        return "Alimento{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", categoria='" + categoria + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Alimento alimento = (Alimento) obj;
        return id == alimento.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}