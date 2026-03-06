package service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import spark.Request;
import spark.Response;
import util.EnvConfig;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class IAService {
    private final Gson gson = new GsonBuilder().create();
    private final String HF_URL = "https://router.huggingface.co/v1/chat/completions";
    private static final String HF_TOKEN = EnvConfig.getHfToken();
    private final String MODEL = "Qwen/Qwen2.5-7B-Instruct:together";

    public Object gerarReceita(Request request, Response response) {
        System.out.println("Chegou requisicao");
        response.type("application/json");
        try {
            JsonObject body = JsonParser.parseString(request.body()).getAsJsonObject();
            String option = body.has("option") ? body.get("option").getAsString() : "pantry-only";
            JsonArray ingredientes = body.getAsJsonArray("ingredientes");
            String customPrompt = body.has("prompt") ? body.get("prompt").getAsString() : "";

            if (HF_TOKEN == null || HF_TOKEN.isEmpty()) {
                System.out.println("Deu ruim no token");
                response.status(500);
                return gson.toJson(Map.of("error", "HF_TOKEN não configurado"));
            }

            String systemMsg = "Você é um gerador de receitas. Responda somente com JSON válido conforme o schema: " + getSchema();
            String userMsg = buildPrompt(option, ingredientes, customPrompt);

            JsonObject payload = new JsonObject();
            payload.addProperty("model", MODEL);
            JsonArray messages = new JsonArray();
            JsonObject sys = new JsonObject();
            sys.addProperty("role", "system");
            sys.addProperty("content", systemMsg);
            messages.add(sys);
            JsonObject usr = new JsonObject();
            usr.addProperty("role", "user");
            usr.addProperty("content", userMsg);
            messages.add(usr);
            payload.add("messages", messages);
            payload.addProperty("temperature", 0.6);
            payload.addProperty("max_tokens", 700);

            JsonObject result = callHF(payload);
            String content = extractContent(result);
            if (content == null || content.isEmpty()) { response.status(502); return gson.toJson(Map.of("error", "Resposta vazia da IA")); }
            JsonObject receitaJson = JsonParser.parseString(content).getAsJsonObject();
            if (!receitaJson.has("titulo") || !receitaJson.has("informacoes")) { response.status(502); return gson.toJson(Map.of("error", "Formato inesperado")); }
            response.status(200);
            return receitaJson.toString();
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(Map.of("error", "Falha: " + e.getMessage()));
        }
    }

    private String getSchema() {
        return "{\"titulo\":\"string\",\"porcao\":\"string\",\"tempoPreparo\":0,\"informacoes\":{\"ingredientes\":[\"string\"],\"modo_preparo\":[\"string\"],\"dificuldade\":\"Fácil|Médio|Difícil\",\"tipo_refeicao\":\"Café da manhã|Almoço|Jantar|Lanche|Sobremesa\",\"calorias\":0,\"tags\":[\"string\"]}}";
    }
    private String buildPrompt(String option, JsonArray ing, String custom) {
        String ig = ing.toString();
        switch (option) {
            case "pantry-only": return "Gere UMA receita usando EXCLUSIVAMENTE estes ingredientes: " + ig + ". Preencha todos os campos do schema. Tags: 'gerado-ia', 'aproveitamento'. Calorias estimadas.";
            case "pantry-based": return "Gere UMA receita baseada nestes ingredientes: " + ig + ". PODE incluir poucos itens comuns (azeite, sal, pimenta). Tags: 'gerado-ia', 'prático', 'saudável'. Calorias estimadas.";
            case "custom": return "Prompt do usuário: " + custom + ". Ingredientes disponíveis: " + ig + ". Gere UMA receita conforme o schema. Inclua tags 'gerado-ia' e 'personalizado'.";
            default: return "Gere UMA receita conforme o schema.";
        }
    }
    private JsonObject callHF(JsonObject payload) throws IOException {
        System.out.println("AI PAYLOAD");
        System.out.println(payload);

        URL url = new URL(HF_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + HF_TOKEN);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        byte[] out = payload.toString().getBytes(StandardCharsets.UTF_8);
        try (OutputStream os = conn.getOutputStream()) { os.write(out); }
        int code = conn.getResponseCode();
        InputStream is = code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream();
        String resp = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        return JsonParser.parseString(resp).getAsJsonObject();
    }
    private String extractContent(JsonObject result) {
        try { JsonArray choices = result.getAsJsonArray("choices");
            if (choices == null || choices.isEmpty()) return null;
            JsonObject msg = choices.get(0).getAsJsonObject().getAsJsonObject("message");
            return msg.get("content").getAsString();
        } catch (Exception e) { return null; }
    }
}