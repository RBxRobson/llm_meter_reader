import express, {Request, Response} from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Teste")
});

try {
  app.listen(80, () => {
    console.log("Servidor Ativo, Porta 80: http://localhost:80");
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}