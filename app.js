import express from "express";
import { initializeDatabase, createConnection } from "./db.js";
import livrosRoutes from "./routes/livroRoutes.js";
import usuariosRoutes from "./routes/usuarioRoutes.js";
import emprestimosRoutes from "./routes/emprestimoRoutes.js";
import relatorioRoutes from "./routes/relatorioRoutes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'capas');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para upload de capas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const nameParts = file.originalname.split('.');
    const extension = nameParts[nameParts.length - 1];
    const uniqueName = `capa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const mimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Arquivo deve ser uma imagem válida'));
    }
  }
});

// Wrapper assíncrono para inicializar e depois iniciar o servidor
(async () => {
  await initializeDatabase();

  // Rota raiz - servir a interface HTML
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Rota de teste - Popular banco com dados
  app.post("/admin/seed", async (req, res) => {
    try {
      const connection = await createConnection();

      // Limpar dados antigos
      await connection.execute("DELETE FROM reservas");
      await connection.execute("DELETE FROM emprestimos");
      await connection.execute("DELETE FROM usuarios");
      await connection.execute("DELETE FROM livros");

      // Inserir 30 livros
      const livros = [
        // Programação
        { titulo: "Clean Code", autor: "Robert C. Martin", genero: "Programação", ano: 2008, estoque: 5 },
        { titulo: "Design Patterns", autor: "Gang of Four", genero: "Programação", ano: 1994, estoque: 3 },
        { titulo: "Refactoring", autor: "Martin Fowler", genero: "Programação", ano: 1999, estoque: 4 },
        { titulo: "Code Complete", autor: "Steve McConnell", genero: "Programação", ano: 2004, estoque: 2 },
        { titulo: "The Pragmatic Programmer", autor: "Hunt & Thomas", genero: "Programação", ano: 1999, estoque: 6 },
        
        // Ficção Clássica
        { titulo: "1984", autor: "George Orwell", genero: "Ficção", ano: 1949, estoque: 4 },
        { titulo: "O Senhor das Moscas", autor: "William Golding", genero: "Ficção", ano: 1954, estoque: 3 },
        { titulo: "O Alienígena", autor: "Ray Bradbury", genero: "Ficção", ano: 1950, estoque: 2 },
        { titulo: "O Jovem Holden", autor: "J.D. Salinger", genero: "Ficção", ano: 1951, estoque: 5 },
        { titulo: "Grande Esperança", autor: "Charles Dickens", genero: "Ficção", ano: 1861, estoque: 2 },
        
        // Fantasy
        { titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", genero: "Fantasy", ano: 1954, estoque: 2 },
        { titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling", genero: "Fantasy", ano: 1998, estoque: 6 },
        { titulo: "As Crônicas de Nárnia", autor: "C.S. Lewis", genero: "Fantasy", ano: 1950, estoque: 3 },
        { titulo: "A Game of Thrones", autor: "George R.R. Martin", genero: "Fantasy", ano: 1996, estoque: 1 },
        { titulo: "O Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasy", ano: 1937, estoque: 4 },
        
        // Mistério/Thriller
        { titulo: "Assassinato no Expresso do Oriente", autor: "Agatha Christie", genero: "Mistério", ano: 1934, estoque: 3 },
        { titulo: "O Código Da Vinci", autor: "Dan Brown", genero: "Mistério", ano: 2003, estoque: 4 },
        { titulo: "Sherlock Holmes", autor: "Arthur Conan Doyle", genero: "Mistério", ano: 1887, estoque: 5 },
        { titulo: "Menina Desaparecida", autor: "Gillian Flynn", genero: "Thriller", ano: 2012, estoque: 2 },
        { titulo: "O Silêncio dos Inocentes", autor: "Thomas Harris", genero: "Thriller", ano: 1988, estoque: 2 },
        
        // Romance
        { titulo: "Orgulho e Preconceito", autor: "Jane Austen", genero: "Romance", ano: 1813, estoque: 4 },
        { titulo: "O Caderno", autor: "Nicholas Sparks", genero: "Romance", ano: 1996, estoque: 3 },
        { titulo: "Jane Eyre", autor: "Charlotte Brontë", genero: "Romance", ano: 1847, estoque: 2 },
        { titulo: "O Morro dos Ventos Uivantes", autor: "Emily Brontë", genero: "Romance", ano: 1847, estoque: 3 },
        { titulo: "Romeu e Julieta", autor: "William Shakespeare", genero: "Romance", ano: 1595, estoque: 1 },
        
        // Científico
        { titulo: "Cosmos", autor: "Carl Sagan", genero: "Científico", ano: 1980, estoque: 4 },
        { titulo: "Uma Breve História do Tempo", autor: "Stephen Hawking", genero: "Científico", ano: 1988, estoque: 3 },
        { titulo: "A Origem das Espécies", autor: "Charles Darwin", genero: "Científico", ano: 1859, estoque: 2 },
        { titulo: "Sapiens", autor: "Yuval Noah Harari", genero: "Científico", ano: 2011, estoque: 5 },
        { titulo: "O Gene Egoísta", autor: "Richard Dawkins", genero: "Científico", ano: 1976, estoque: 3 },
      ];

      for (const livro of livros) {
        await connection.execute(
          "INSERT INTO livros (titulo, autor, genero, ano_publicacao, estoque) VALUES (?, ?, ?, ?, ?)",
          [livro.titulo, livro.autor, livro.genero, livro.ano, livro.estoque]
        );
      }

      // Inserir usuários de teste (10 clientes + algumas reservas)
      const usuarios = [
        { nome: "João Silva", endereco: "Rua A, 123", email: "joao@email.com", telefone: "11999999999" },
        { nome: "Maria Santos", endereco: "Av. B, 456", email: "maria@email.com", telefone: "11988888888" },
        { nome: "Pedro Oliveira", endereco: "Rua C, 789", email: "pedro@email.com", telefone: "11977777777" },
        { nome: "Ana Costa", endereco: "Rua D, 101", email: "ana@email.com", telefone: "11966666666" },
        { nome: "Carlos Mendes", endereco: "Av. E, 202", email: "carlos@email.com", telefone: "11955555555" },
        { nome: "Julia Ferreira", endereco: "Rua F, 303", email: "julia@email.com", telefone: "11944444444" },
        { nome: "Lucas Alves", endereco: "Av. G, 404", email: "lucas@email.com", telefone: "11933333333" },
        { nome: "Beatriz Lima", endereco: "Rua H, 505", email: "beatriz@email.com", telefone: "11922222222" },
        { nome: "Felipe Rocha", endereco: "Av. I, 606", email: "felipe@email.com", telefone: "11911111111" },
        { nome: "Camila Souza", endereco: "Rua J, 707", email: "camila@email.com", telefone: "11900000000" },
      ];


      for (const usuario of usuarios) {
        await connection.execute(
          "INSERT INTO usuarios (nome, endereco, email, telefone) VALUES (?, ?, ?, ?)",
          [usuario.nome, usuario.endereco, usuario.email, usuario.telefone]
        );
      }

      res.status(200).json({ 
        message: "Banco populado com sucesso!",
        livros_inseridos: livros.length,
        usuarios_inseridos: usuarios.length
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao popular banco de dados", details: error.message });
    }
  });

// Rota de TESTE - para debug
app.post("/api/test-emprestimo", async (req, res) => {
  console.log('=== TEST EMPRESTIMO ===');
  console.log('Body recebido:', req.body);
  
  try {
    const { usuario_id, livro_id, data_emprestimo, data_devolucao } = req.body;
    const connection = await createConnection();

    console.log(`Criando empréstimo: usuario=${usuario_id}, livro=${livro_id}`);

    const [result] = await connection.execute(
      "INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, data_emprestimo, data_devolucao]
    );

    console.log('Empréstimo criado com ID:', result.insertId);
    return res.status(201).json({ 
      message: "Empréstimo criado com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error('ERRO ao criar empréstimo:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Rota de teste - Popular banco com dados

app.use("/livros", livrosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/emprestimos", emprestimosRoutes);
app.use("/relatorios", relatorioRoutes);

// ===== ROTAS DA API (para a interface) =====

// API - Livros (retorna JSON)
app.get("/api/livros", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM livros");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os livros" });
  }
});

// API - Buscar Livro Específico
app.get("/api/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM livros WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Livro não encontrado" });
    }
    
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar o livro", details: error.message });
  }
});

// API - Usuários (retorna JSON)
app.get("/api/usuarios", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM usuarios");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os usuários" });
  }
});

// API - Empréstimos (retorna JSON)
app.get("/api/emprestimos", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM emprestimos");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os empréstimos" });
  }
});

// API - Criar Empréstimo
app.post("/api/emprestimos", async (req, res) => {
  try {
    const { usuario_id, livro_id, data_emprestimo, data_devolucao } = req.body;
    const connection = await createConnection();

    // Verificar estoque
    const [livro] = await connection.execute("SELECT estoque FROM livros WHERE id = ?", [livro_id]);
    if (livro.length === 0 || livro[0].estoque <= 0) {
      return res.status(400).json({ error: "Livro indisponível" });
    }

    // Buscar tipo do usuário
    const [usuario] = await connection.execute("SELECT tipo FROM usuarios WHERE id = ?", [usuario_id]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const tipoUsuario = (usuario[0].tipo || '').toLowerCase();
    // Buscar quantos empréstimos ativos esse usuário tem
    const [emprestimosAtivos] = await connection.execute(
      "SELECT COUNT(*) as total FROM emprestimos WHERE usuario_id = ? AND devolvido = 0",
      [usuario_id]
    );
    const totalAtivos = emprestimosAtivos[0].total || 0;
    const limite = tipoUsuario === 'professor' ? 6 : 3;
    if (totalAtivos >= limite) {
      return res.status(400).json({ error: `Limite de empréstimos atingido para ${tipoUsuario}.` });
    }

    // Criar empréstimo
    await connection.execute(
      "INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, data_emprestimo, data_devolucao]
    );

    // Atualizar estoque
    await connection.execute(
      "UPDATE livros SET estoque = estoque - 1, vezes_emprestado = vezes_emprestado + 1 WHERE id = ?",
      [livro_id]
    );

    return res.status(201).json({ message: "Empréstimo registrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar empréstimo", details: error.message });
  }
});

// API - Criar Reserva
app.post("/api/reservas", async (req, res) => {
  try {
    const { usuario_id, livro_id } = req.body;
    const connection = await createConnection();

    await connection.execute(
      "INSERT INTO reservas (usuario_id, livro_id, data_reserva, status) VALUES (?, ?, ?, 'ativa')",
      [usuario_id, livro_id, new Date().toISOString().split('T')[0]]
    );

    return res.status(201).json({ message: "Reserva registrada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar reserva", details: error.message });
  }
});

// API - Listar Reservas
app.get("/api/reservas", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM reservas");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar as reservas" });
  }
});

// API - Cancelar Reserva
app.put("/api/reservas/:id/cancelar", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    const [rows] = await connection.execute("SELECT * FROM reservas WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    await connection.execute("UPDATE reservas SET status = 'cancelada' WHERE id = ?", [id]);

    return res.status(200).json({ message: "Reserva cancelada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cancelar reserva", details: error.message });
  }
});

// API - Marcar Empréstimo como Devolvido
app.put("/api/emprestimos/:id/devolver", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    // Buscar o empréstimo
    const [emprestimo] = await connection.execute("SELECT livro_id FROM emprestimos WHERE id = ?", [id]);
    if (emprestimo.length === 0) {
      return res.status(404).json({ error: "Empréstimo não encontrado" });
    }

    // Marcar como devolvido
    await connection.execute("UPDATE emprestimos SET devolvido = TRUE WHERE id = ?", [id]);

    // Aumentar estoque
    await connection.execute(
      "UPDATE livros SET estoque = estoque + 1 WHERE id = ?",
      [emprestimo[0].livro_id]
    );

    return res.status(200).json({ message: "Empréstimo marcado como devolvido" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao marcar devolução", details: error.message });
  }
});

// API - Criar Livro
app.post("/api/livros", upload.single('capa'), async (req, res) => {
  try {
    const { titulo, autor, genero, ano_publicacao, estoque, capa_url } = req.body;
    const connection = await createConnection();

    // Determinar URL da capa
    let capaFinal = null;
    if (req.file) {
      capaFinal = `/uploads/capas/${req.file.filename}`;
    } else if (capa_url) {
      capaFinal = capa_url;
    }

    const [result] = await connection.execute(
      "INSERT INTO livros (titulo, autor, genero, ano_publicacao, estoque, capa_url) VALUES (?, ?, ?, ?, ?, ?)",
      [titulo, autor, genero, ano_publicacao, estoque || 1, capaFinal]
    );

    return res.status(201).json({ 
      message: "Livro criado com sucesso", 
      id: result.insertId,
      capa_url: capaFinal
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar livro", details: error.message });
  }
});

// API - Editar Livro
app.put("/api/livros/:id", upload.single('capa'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, genero, ano_publicacao, estoque, capa_url } = req.body;
    const connection = await createConnection();

    // Se enviou um novo arquivo, usar esse; senão, usar capa_url do form; senão manter a anterior
    let capaParaSalvar = null;
    if (req.file) {
      capaParaSalvar = `/uploads/capas/${req.file.filename}`;
    } else if (capa_url) {
      capaParaSalvar = capa_url;
    } else {
      // Manter a capa anterior
      const [livro] = await connection.execute("SELECT capa_url FROM livros WHERE id = ?", [id]);
      if (livro.length > 0) {
        capaParaSalvar = livro[0].capa_url;
      }
    }

    await connection.execute(
      "UPDATE livros SET titulo = ?, autor = ?, genero = ?, ano_publicacao = ?, estoque = ?, capa_url = ? WHERE id = ?",
      [titulo, autor, genero, ano_publicacao, estoque, capaParaSalvar, id]
    );

    return res.status(200).json({ 
      message: "Livro atualizado com sucesso",
      capa_url: capaParaSalvar
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar livro", details: error.message });
  }
});

// API - Deletar Livro
app.delete("/api/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();

    await connection.execute("DELETE FROM livros WHERE id = ?", [id]);

    return res.status(200).json({ message: "Livro deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar livro", details: error.message });
  }
});

// API - Relatórios (retorna Excel)
app.get("/api/relatorios/emprestimos-pendentes", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(`
      SELECT u.nome, u.email, e.data_emprestimo, e.data_devolucao, l.titulo
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.devolvido = FALSE
    `);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar empréstimos pendentes", details: error.message });
  }
});

app.get("/api/relatorios/emprestimos-ativos", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(`
      SELECT u.nome, l.titulo, e.data_emprestimo, e.data_devolucao
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.devolvido = FALSE
    `);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar empréstimos ativos", details: error.message });
  }
});

app.get("/api/relatorios/livros-mais-emprestados", async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(`
      SELECT l.titulo, l.autor, l.vezes_emprestado
      FROM livros l
      ORDER BY l.vezes_emprestado DESC
      LIMIT 10
    `);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar livros mais emprestados", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST || "localhost";
app.listen(PORT, () => {
  console.log(`link: http://${HOST}:${PORT}`);
});
})();
