package model;

import com.google.gson.JsonObject;

public class Receita {
    private int id;
    private String titulo;
    private String porcao;
    private int tempoPreparo;
    private JsonObject informacoes;

    // Construtor vazio
    public Receita() {
        this.id = -1;
        this.titulo = "";
        this.porcao = "";
        this.tempoPreparo = 0;
        this.informacoes = new JsonObject();
    }

    // Construtor completo
    public Receita(int id, String titulo, String porcao, int tempoPreparo, JsonObject informacoes) {
        this.id = id;
        this.titulo = titulo;
        this.porcao = porcao;
        this.tempoPreparo = tempoPreparo;
        this.informacoes = informacoes;
    }

    // Construtor sem ID (para inserção)
    public Receita(String titulo, String porcao, int tempoPreparo, JsonObject informacoes) {
        this.titulo = titulo;
        this.porcao = porcao;
        this.tempoPreparo = tempoPreparo;
        this.informacoes = informacoes;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getPorcao() {
        return porcao;
    }

    public int getTempoPreparo() {
        return tempoPreparo;
    }

    public JsonObject getInformacoes() {
        return informacoes;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setPorcao(String porcao) {
        this.porcao = porcao;
    }

    public void setTempoPreparo(int tempoPreparo) {
        this.tempoPreparo = tempoPreparo;
    }

    public void setInformacoes(JsonObject informacoes) {
        this.informacoes = informacoes;
    }

    @Override
    public String toString() {
        return "Receita{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", porcao='" + porcao + '\'' +
                ", tempoPreparo=" + tempoPreparo +
                ", informacoes=" + informacoes +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Receita receita = (Receita) obj;
        return id == receita.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}

