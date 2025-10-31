package model;

import java.time.LocalDateTime;

public class ReceitaFavorita {
    private int id;
    private int usuarioId;
    private int receitaId;
    private LocalDateTime dataAdicao;

    // Atributos extras para joins
    private String nomeUsuario;
    private String tituloReceita;

    // Construtor vazio
    public ReceitaFavorita() {
        this.id = -1;
        this.usuarioId = 0;
        this.receitaId = 0;
        this.dataAdicao = LocalDateTime.now();
    }

    // Construtor completo
    public ReceitaFavorita(int id, int usuarioId, int receitaId, LocalDateTime dataAdicao) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.receitaId = receitaId;
        this.dataAdicao = dataAdicao;
    }

    // Construtor sem ID (para inserção)
    public ReceitaFavorita(int usuarioId, int receitaId) {
        this.usuarioId = usuarioId;
        this.receitaId = receitaId;
        this.dataAdicao = LocalDateTime.now();
    }

    // Getters
    public int getId() {
        return id;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public int getReceitaId() {
        return receitaId;
    }

    public LocalDateTime getDataAdicao() {
        return dataAdicao;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public String getTituloReceita() {
        return tituloReceita;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setReceitaId(int receitaId) {
        this.receitaId = receitaId;
    }

    public void setDataAdicao(LocalDateTime dataAdicao) {
        this.dataAdicao = dataAdicao;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public void setTituloReceita(String tituloReceita) {
        this.tituloReceita = tituloReceita;
    }

    @Override
    public String toString() {
        return "ReceitaFavorita{" +
                "id=" + id +
                ", usuarioId=" + usuarioId +
                ", receitaId=" + receitaId +
                ", dataAdicao=" + dataAdicao +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ReceitaFavorita that = (ReceitaFavorita) obj;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}
