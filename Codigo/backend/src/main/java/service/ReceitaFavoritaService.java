package service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.ReceitaFavoritaDAO;
import model.ReceitaFavorita;
import spark.Request;
import spark.Response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ReceitaFavoritaService {

    private ReceitaFavoritaDAO receitaFavoritaDAO;
    private Gson gson;

    public ReceitaFavoritaService() {
        this.receitaFavoritaDAO = new ReceitaFavoritaDAO();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
    }

    /**
     * GET /favoritas
     * Lista todas as receitas favoritas
     */
    public Object getAll(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(receitaFavoritaDAO.getAll());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar favoritas: " + e.getMessage()));
        }
    }

    /**
     * GET /favoritas/:id
     * Busca favorita por ID
     */
    public Object get(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            ReceitaFavorita favorita = receitaFavoritaDAO.get(id);

            if (favorita != null) {
                response.status(200);
                return gson.toJson(favorita);
            } else {
                response.status(404);
                return gson.toJson(new ErrorResponse("Favorita não encontrada"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar favorita: " + e.getMessage()));
        }
    }

    /**
     * GET /favoritas/usuario/:usuarioId
     * Lista receitas favoritas de um usuário
     */
    public Object getByUsuario(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            return gson.toJson(receitaFavoritaDAO.getByUsuario(usuarioId));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID de usuário inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar favoritas: " + e.getMessage()));
        }
    }

    /**
     * GET /favoritas/receita/:receitaId
     * Lista usuários que favoritaram uma receita
     */
    public Object getByReceita(Request request, Response response) {
        response.type("application/json");

        try {
            int receitaId = Integer.parseInt(request.params(":receitaId"));
            return gson.toJson(receitaFavoritaDAO.getByReceita(receitaId));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID de receita inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar favoritas: " + e.getMessage()));
        }
    }

    /**
     * GET /favoritas/check/:usuarioId/:receitaId
     * Verifica se receita está nos favoritos
     */
    public Object checkFavorita(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            int receitaId = Integer.parseInt(request.params(":receitaId"));

            boolean isFavorita = receitaFavoritaDAO.isFavorita(usuarioId, receitaId);

            return gson.toJson(new CheckResponse(isFavorita));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("IDs inválidos"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao verificar favorita: " + e.getMessage()));
        }
    }

    /**
     * GET /favoritas/receita/:receitaId/count
     * Conta quantos usuários favoritaram a receita
     */
    public Object countByReceita(Request request, Response response) {
        response.type("application/json");

        try {
            int receitaId = Integer.parseInt(request.params(":receitaId"));
            int count = receitaFavoritaDAO.countByReceita(receitaId);

            return gson.toJson(new CountResponse(count));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID de receita inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao contar favoritas: " + e.getMessage()));
        }
    }

    /**
     * POST /favoritas
     * Adiciona uma receita aos favoritos
     */
    public Object insert(Request request, Response response) {
        response.type("application/json");

        try {
            ReceitaFavorita favorita = gson.fromJson(request.body(), ReceitaFavorita.class);

            // Validações
            if (favorita.getUsuarioId() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Usuário é obrigatório"));
            }

            if (favorita.getReceitaId() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Receita é obrigatória"));
            }

            // Verifica se já existe
            if (receitaFavoritaDAO.isFavorita(favorita.getUsuarioId(), favorita.getReceitaId())) {
                response.status(409);
                return gson.toJson(new ErrorResponse("Receita já está nos favoritos"));
            }

            if (receitaFavoritaDAO.insert(favorita)) {
                response.status(201);
                return gson.toJson(new SuccessResponse("Receita adicionada aos favoritos"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao adicionar favorita"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * DELETE /favoritas/:id
     * Remove uma receita dos favoritos por ID
     */
    public Object delete(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            ReceitaFavorita favorita = receitaFavoritaDAO.get(id);

            if (favorita == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Favorita não encontrada"));
            }

            if (receitaFavoritaDAO.delete(id)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Receita removida dos favoritos"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover favorita"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar favorita: " + e.getMessage()));
        }
    }

    /**
     * DELETE /favoritas/usuario/:usuarioId/receita/:receitaId
     * Remove uma receita dos favoritos por usuário e receita
     */
    public Object deleteByUsuarioReceita(Request request, Response response) {
        response.type("application/json");

        try {
            int usuarioId = Integer.parseInt(request.params(":usuarioId"));
            int receitaId = Integer.parseInt(request.params(":receitaId"));

            if (!receitaFavoritaDAO.isFavorita(usuarioId, receitaId)) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Receita não está nos favoritos"));
            }

            if (receitaFavoritaDAO.deleteByUsuarioReceita(usuarioId, receitaId)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Receita removida dos favoritos"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover favorita"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("IDs inválidos"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar favorita: " + e.getMessage()));
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

    private static class CheckResponse {
        private boolean isFavorita;
        public CheckResponse(boolean isFavorita) {
            this.isFavorita = isFavorita;
        }
    }

    private static class CountResponse {
        private int count;
        public CountResponse(int count) {
            this.count = count;
        }
    }

    // Adapter para LocalDateTime
    private static class LocalDateTimeAdapter extends com.google.gson.TypeAdapter<LocalDateTime> {
        private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        @Override
        public void write(com.google.gson.stream.JsonWriter out, LocalDateTime value) throws java.io.IOException {
            if (value == null) {
                out.nullValue();
            } else {
                out.value(value.format(formatter));
            }
        }

        @Override
        public LocalDateTime read(com.google.gson.stream.JsonReader in) throws java.io.IOException {
            if (in.peek() == com.google.gson.stream.JsonToken.NULL) {
                in.nextNull();
                return null;
            }
            return LocalDateTime.parse(in.nextString(), formatter);
        }
    }
}
