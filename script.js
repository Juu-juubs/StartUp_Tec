class Funcionario {
  #id;
  #nome;
  #idade;
  #cargo;
  #salario;

  constructor(id, nome, idade, cargo, salario) {
    this.#id = id;
    this.#nome = nome;
    this.#idade = idade;
    this.#cargo = cargo;
    this.#salario = salario;
  }

  get id() { return this.#id; }

  get nome() { return this.#nome; }
  set nome(valor) { this.#nome = valor; }

  get idade() { return this.#idade; }
  set idade(valor) { this.#idade = valor; }

  get cargo() { return this.#cargo; }
  set cargo(valor) { this.#cargo = valor; }

  get salario() { return this.#salario; }
  set salario(valor) { this.#salario = valor; }

  toString() {
    return `[${this.#id}] ${this.#nome} (${this.#idade} anos) - ${this.#cargo} - R$ ${this.#salario.toFixed(2)}`;
  }
}

const funcionarios = [];
let proximoId = 1;

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function cadastrarFuncionario() {
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();
  const salario = document.getElementById("salario").value;

  // 2) Validar
  if (nome === "" || idade === "" || cargo === "" || salario === "") {
    alert("Preencha todos os campos!");
    return;
  }

  const funcionario = new Funcionario(proximoId, nome, Number(idade), cargo, Number(salario));
  proximoId++;
  console.log(funcionario.toString());

  funcionarios.push(funcionario);
  document.getElementById("form-funcionario").reset();
  renderizarTabela();
}

function renderizarTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  for (const f of funcionarios) {
    const linha = corpo.insertRow();
    linha.insertCell().textContent = f.nome;
    linha.insertCell().textContent = f.idade;
    linha.insertCell().textContent = f.cargo;
    linha.insertCell().textContent = formatarMoeda(f.salario);
  }
}