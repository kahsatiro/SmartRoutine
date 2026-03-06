package model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Registra {
    private int id;
    private int alimentoId;
    private int usuarioId;
    private LocalDate dataCompra;
    private LocalDate dataValidade;
    private String unidadeMedida;
    private String lote;
    private int quantidade;

    // Atributos extras para joins
    private String nomeAlimento;
    private String nomeUsuario;

    // Construtor vazio
    public Registra() {
        this.id = -1;
        this.alimentoId = 0;
        this.usuarioId = 0;
        this.dataCompra = LocalDate.now();
        this.dataValidade = null;
        this.unidadeMedida = "";
        this.lote = "";
        this.quantidade = 0;
    }

    // Construtor completo
    public Registra(int id, int alimentoId, int usuarioId, LocalDate dataCompra,
                    LocalDate dataValidade, String unidadeMedida, String lote, int quantidade) {
        this.id = id;
        this.alimentoId = alimentoId;
        this.usuarioId = usuarioId;
        this.dataCompra = dataCompra;
        this.dataValidade = dataValidade;
        this.unidadeMedida = unidadeMedida;
        this.lote = lote;
        this.quantidade = quantidade;
    }

    // Construtor sem ID (para inserção)
    public Registra(int alimentoId, int usuarioId, LocalDate dataCompra,
                    LocalDate dataValidade, String unidadeMedida, String lote, int quantidade) {
        this.alimentoId = alimentoId;
        this.usuarioId = usuarioId;
        this.dataCompra = dataCompra;
        this.dataValidade = dataValidade;
        this.unidadeMedida = unidadeMedida;
        this.lote = lote;
        this.quantidade = quantidade;
    }

    // Getters
    public int getId() {
        return id;
    }

    public int getAlimentoId() {
        return alimentoId;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public LocalDate getDataCompra() {
        return dataCompra;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public String getLote() {
        return lote;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public String getNomeAlimento() {
        return nomeAlimento;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setAlimentoId(int alimentoId) {
        this.alimentoId = alimentoId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setDataCompra(LocalDate dataCompra) {
        this.dataCompra = dataCompra;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public void setNomeAlimento(String nomeAlimento) {
        this.nomeAlimento = nomeAlimento;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public void mergeWith(Registra outro) {
        if (outro.getUsuarioId() > 0) {
            this.usuarioId = outro.getUsuarioId();
        }

        if (outro.getAlimentoId() > 0) {
            this.alimentoId = outro.getAlimentoId();
        }

        if (outro.getDataCompra() != null) {
            this.dataCompra = outro.getDataCompra();
        }

        if (outro.getDataValidade() != null) {
            this.dataValidade = outro.getDataValidade();
        }

        if (outro.getUnidadeMedida() != null && !outro.getUnidadeMedida().isEmpty()) {
            this.unidadeMedida = outro.getUnidadeMedida();
        }

        if (outro.getLote() != null && !outro.getLote().isEmpty()) {
            this.lote = outro.getLote();
        }

        if (outro.getQuantidade() > 0) {
            this.quantidade = outro.getQuantidade();
        }
    }

    @Override
    public String toString() {
        return "Registra{" +
                "id=" + id +
                ", alimentoId=" + alimentoId +
                ", usuarioId=" + usuarioId +
                ", dataCompra=" + dataCompra +
                ", dataValidade=" + dataValidade +
                ", unidadeMedida='" + unidadeMedida + '\'' +
                ", lote='" + lote + '\'' +
                ", quantidade=" + quantidade +
                '}';
    }
}
