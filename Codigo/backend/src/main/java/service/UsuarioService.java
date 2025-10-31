package service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.UsuarioDAO;
import model.Usuario;
import spark.Request;
import spark.Response;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class UsuarioService {

    private UsuarioDAO usuarioDAO;
    private Gson gson;

    public UsuarioService() {
        this.usuarioDAO = new UsuarioDAO();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .create();
    }

    /**
     * GET /usuario
     * Lista todos os usuários
     */
    public Object getAll(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(usuarioDAO.getAll());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar usuários: " + e.getMessage()));
        }
    }

    /**
     * GET /usuario/:id
     * Busca usuário por ID
     */
    public Object get(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Usuario usuario = usuarioDAO.get(id);

            if (usuario != null) {
                response.status(200);
                return gson.toJson(usuario);
            } else {
                response.status(404);
                return gson.toJson(new ErrorResponse("Usuário não encontrado"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar usuário: " + e.getMessage()));
        }
    }

    /**
     * POST /usuario
     * Insere um novo usuário
     */
    public Object insert(Request request, Response response) {
        response.type("application/json");

        try {
            Usuario usuario = gson.fromJson(request.body(), Usuario.class);

            // Validações
            if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Nome é obrigatório"));
            }

            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Email é obrigatório"));
            }

            if (usuario.getSenha() == null || usuario.getSenha().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Senha é obrigatória"));
            }

            // Verifica se email já existe
            if (usuarioDAO.getByEmail(usuario.getEmail()) != null) {
                response.status(409);
                return gson.toJson(new ErrorResponse("Email já cadastrado"));
            }

            if (usuarioDAO.insert(usuario)) {
                response.status(201);
                return gson.toJson(new SuccessResponse("Usuário cadastrado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao cadastrar usuário"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * PUT /usuario/:id
     * Atualiza um usuário existente
     */
    public Object update(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Usuario usuarioExistente = usuarioDAO.get(id);

            if (usuarioExistente == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Usuário não encontrado"));
            }

            Usuario usuario = gson.fromJson(request.body(), Usuario.class);
            usuario.setId(id);

            // Validações
            if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Nome é obrigatório"));
            }

            // Verifica se o email já está sendo usado por outro usuário
            Usuario usuarioComEmail = usuarioDAO.getByEmail(usuario.getEmail());
            if (usuarioComEmail != null && usuarioComEmail.getId() != id) {
                response.status(409);
                return gson.toJson(new ErrorResponse("Email já está em uso"));
            }

            if (usuarioDAO.update(usuario)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Usuário atualizado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao atualizar usuário"));
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
     * DELETE /usuario/:id
     * Remove um usuário
     */
    public Object delete(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Usuario usuario = usuarioDAO.get(id);

            if (usuario == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Usuário não encontrado"));
            }

            if (usuarioDAO.delete(id)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Usuário removido com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover usuário"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar usuário: " + e.getMessage()));
        }
    }

    /**
     * POST /usuario/login
     * Autentica um usuário
     */
    public Object login(Request request, Response response) {
        response.type("application/json");

        try {
            LoginRequest loginRequest = gson.fromJson(request.body(), LoginRequest.class);

            if (loginRequest.email == null || loginRequest.senha == null) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Email e senha são obrigatórios"));
            }

            Usuario usuario = usuarioDAO.authenticate(loginRequest.email, loginRequest.senha);

            if (usuario != null) {
                // Não retornar a senha
                usuario.setSenha(null);
                response.status(200);
                return gson.toJson(usuario);
            } else {
                response.status(401);
                return gson.toJson(new ErrorResponse("Credenciais inválidas"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
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

    private static class LoginRequest {
        private String email;
        private String senha;
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
