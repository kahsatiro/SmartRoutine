package service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.RegistraDAO;
import model.Registra;
import spark.Request;
import spark.Response;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class RegistraService {

    private RegistraDAO registraDAO;
    private Gson gson;

    public RegistraService() {
        this.registraDAO = new RegistraDAO();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .create();
    }

    /**
     * GET /registra
     * Lista todos os registros
     */
    public Object getAll(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(registraDAO.getAll());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar registros: " + e.getMessage()));
        }
    }

    /**
     * GET /registra/:id
     * Busca registro por ID
     */
    public Object get(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Registra registra = registraDAO.get(id);

            if (registra != null) {
                response.status(200);
                return gson.toJson(registra);
            } else {
                response.status(404);
                return gson.toJson(new ErrorResponse("Registro não encontrado"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar registro: " + e.getMessage()));
        }
    }

    /**
     * GET /registra/usuario/:usuarioId
     * Lista registros por usuário
     */
    public Object getByUsuario(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            return gson.toJson(registraDAO.getByUsuario(usuarioId));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID de usuário inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar registros: " + e.getMessage()));
        }
    }

    /**
     * GET /registra/usuario/:usuarioId/vencimento/:dias
     * Lista alimentos próximos do vencimento
     */
    public Object getProximosVencimento(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            int dias = Integer.parseInt(request.params(":dias"));
            return gson.toJson(registraDAO.getProximosVencimento(usuarioId, dias));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Parâmetros inválidos"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alimentos: " + e.getMessage()));
        }
    }

    /**
     * GET /registra/usuario/:usuarioId/vencidos
     * Lista alimentos vencidos
     */
    public Object getVencidos(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            return gson.toJson(registraDAO.getVencidos(usuarioId));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID de usuário inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alimentos vencidos: " + e.getMessage()));
        }
    }

    /**
     * POST /registra
     * Insere um novo registro
     */
    public Object insert(Request request, Response response) {
        response.type("application/json");

        try {
            Registra registra = gson.fromJson(request.body(), Registra.class);

            // Validações
            if (registra.getAlimentoId() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Alimento é obrigatório"));
            }

            if (registra.getUsuarioId() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Usuário é obrigatório"));
            }

            if (registra.getDataCompra() == null) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Data de compra é obrigatória"));
            }

            if (registra.getQuantidade() == null || registra.getQuantidade().doubleValue() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Quantidade deve ser maior que zero"));
            }

            if (registraDAO.insert(registra)) {
                response.status(201);
                return gson.toJson(new SuccessResponse("Registro cadastrado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao cadastrar registro"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * PUT /registra/:id
     * Atualiza um registro existente
     */
    public Object update(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Registra registraExistente = registraDAO.get(id);

            if (registraExistente == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Registro não encontrado"));
            }

            Registra registra = gson.fromJson(request.body(), Registra.class);
            registra.setId(id);

            // Validações
            if (registra.getQuantidade() == null || registra.getQuantidade().doubleValue() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Quantidade deve ser maior que zero"));
            }

            if (registraDAO.update(registra)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Registro atualizado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao atualizar registro"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * DELETE /registra/:id
     * Remove um registro
     */
    public Object delete(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Registra registra = registraDAO.get(id);

            if (registra == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Registro não encontrado"));
            }

            if (registraDAO.delete(id)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Registro removido com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover registro"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar registro: " + e.getMessage()));
        }
    }

    // Classes auxiliares
    private static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) {
            this.error = error;
        }
    }

    private static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) {
            this.message = message;
        }
    }

    // Adapter para LocalDate
    private static class LocalDateAdapter extends com.google.gson.TypeAdapter<LocalDate> {
        private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        @Override
        public void write(com.google.gson.stream.JsonWriter out, LocalDate value) throws java.io.IOException {
            if (value == null) {
                out.nullValue();
            } else {
                out.value(value.format(formatter));
            }
        }

        @Override
        public LocalDate read(com.google.gson.stream.JsonReader in) throws java.io.IOException {
            if (in.peek() == com.google.gson.stream.JsonToken.NULL) {
                in.nextNull();
                return null;
            }
            return LocalDate.parse(in.nextString(), formatter);
        }
    }
}
