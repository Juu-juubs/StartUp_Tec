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

const resultado = document.getElementById("resultado");

const exibirResultado = (titulo, linhas) => {
  resultado.innerHTML = "";

  const tituloEl = document.createElement("strong");
  tituloEl.textContent = titulo;
  resultado.appendChild(tituloEl);

  const lista = document.createElement("ul");
  lista.className = "mb-0 mt-2";
  linhas.forEach((linha) => {
    const item = document.createElement("li");
    item.textContent = linha;
    lista.appendChild(item);
  });
  resultado.appendChild(lista);
};

const semFuncionarios = () => {
  if (funcionarios.length === 0) {
    exibirResultado("Aviso", ["Não há funcionários cadastrados."]);
    return true;
  }
  return false;
};

document.getElementById("btn-salario-alto").addEventListener("click", () => {
  if (semFuncionarios()) return;

  const linhas = funcionarios
    .filter((f) => f.salario > 5000)
    .map((f) => `${f.nome} - ${f.cargo} - ${formatarMoeda(f.salario)}`);

  exibirResultado(
    "Funcionários com salário maior que R$ 5.000,00:",
    linhas.length > 0 ? linhas : ["Nenhum funcionário nessa faixa."]
  );
});

document.getElementById("btn-media-salarial").addEventListener("click", () => {
  if (semFuncionarios()) return;

  const soma = funcionarios.reduce((acc, f) => acc + f.salario, 0);
  const media = soma / funcionarios.length;

  exibirResultado("Média salarial:", [formatarMoeda(media)]);
});

document.getElementById("btn-cargos-unicos").addEventListener("click", () => {
  if (semFuncionarios()) return;

  const cargos = funcionarios.map((f) => f.cargo);
  const cargosUnicos = [...new Set(cargos)];

  exibirResultado("Cargos únicos:", cargosUnicos);
});

document.getElementById("btn-nomes-maiusculo").addEventListener("click", () => {
  if (semFuncionarios()) return;

  const nomesMaiusculos = funcionarios.map((f) => f.nome.toUpperCase());

  exibirResultado("Nomes em maiúsculo:", nomesMaiusculos);
});