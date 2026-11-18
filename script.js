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
let idEmEdicao = null;

const form = document.getElementById("form-funcionario");
const btnCadastrar = document.getElementById("btn-cadastrar");
const btnCancelar = document.getElementById("btn-cancelar");
const corpoTabela = document.getElementById("corpo-tabela");

const buscarPorId = (id) => funcionarios.find((f) => f.id === id);

const buscarPorNome = (nome) =>
  funcionarios.filter((f) => f.nome.toLowerCase().includes(nome.toLowerCase()));

const removerPorId = (id) => {
  const posicao = funcionarios.findIndex((f) => f.id === id);
  if (posicao === -1) {
    return false;
  }
  funcionarios.splice(posicao, 1);
  return true;
};

const atualizarFuncionario = (id, nome, idade, cargo, salario) => {
  const f = buscarPorId(id);
  if (f === undefined) {
    return false;
  }
  f.nome = nome;
  f.idade = idade;
  f.cargo = cargo;
  f.salario = salario;
  return true;
};

const formatarMoeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const limparFormulario = () => {
  form.reset();
  idEmEdicao = null;
  btnCadastrar.textContent = "Cadastrar";
};

const editarFuncionario = (id) => {
  const f = buscarPorId(id);
  if (f === undefined) {
    return;
  }

  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  document.getElementById("salario").value = f.salario;

  idEmEdicao = id;
  btnCadastrar.textContent = "Salvar alterações";
  console.log(`Editando: ${f.toString()}`);
};

const renderizarTabela = () => {
  corpoTabela.innerHTML = "";

  funcionarios.forEach((f) => {
    const linha = corpoTabela.insertRow();
    linha.insertCell().textContent = f.nome;
    linha.insertCell().textContent = f.idade;
    linha.insertCell().textContent = f.cargo;
    linha.insertCell().textContent = formatarMoeda(f.salario);

    const celulaAcoes = linha.insertCell();

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn btn-warning btn-sm me-1";
    btnEditar.addEventListener("click", () => editarFuncionario(f.id));

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "btn btn-danger btn-sm";
    btnExcluir.addEventListener("click", () => {
      if (confirm(`Deseja excluir "${f.nome}"?`)) {
        removerPorId(f.id);
        if (idEmEdicao === f.id) {
          limparFormulario();
        }
        console.log(`Excluído: ${f.toString()}`);
        renderizarTabela();
      }
    });

    celulaAcoes.appendChild(btnEditar);
    celulaAcoes.appendChild(btnExcluir);
  });
};

btnCadastrar.addEventListener("click", function () {
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();
  const salario = document.getElementById("salario").value;

  if (nome === "" || idade === "" || cargo === "" || salario === "") {
    alert("Preencha todos os campos!");
    return;
  }

  if (idEmEdicao === null) {
    const funcionario = new Funcionario(proximoId, nome, Number(idade), cargo, Number(salario));
    proximoId++;
    funcionarios.push(funcionario);
    console.log(`Cadastrado: ${funcionario.toString()}`);
  } else {
    atualizarFuncionario(idEmEdicao, nome, Number(idade), cargo, Number(salario));
    console.log(`Atualizado: ${buscarPorId(idEmEdicao).toString()}`);
  }

  limparFormulario();
  renderizarTabela();
});

btnCancelar.addEventListener("click", () => limparFormulario());