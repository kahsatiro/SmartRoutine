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
    private BigDecimal quantidade;

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
        this.quantidade = BigDecimal.ZERO;
    }

    // Construtor completo
    public Registra(int id, int alimentoId, int usuarioId, LocalDate dataCompra,
                    LocalDate dataValidade, String unidadeMedida, String lote, BigDecimal quantidade) {
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
                    LocalDate dataValidade, String unidadeMedida, String lote, BigDecimal quantidade) {
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

    public BigDecimal getQuantidade() {
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

    public void setQuantidade(BigDecimal quantidade) {
        this.quantidade = quantidade;
    }

    public void setNomeAlimento(String nomeAlimento) {
        this.nomeAlimento = nomeAlimento;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
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
