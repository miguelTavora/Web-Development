function verify() {
  let docs = document.forms["user"]["outros_Browser"].value;

  if (docs == "nao") {
    document.forms["user"]["quais"].disabled = true;
    document.forms["user"]["quais"].value = "";
  } else {
    document.forms["user"]["quais"].disabled = false;
  }
}
function checkBrowser(elemento) {
  let opcao1 = document.getElementById("primeiro");
  let opcao2 = document.getElementById("segundo");
  let opcao3 = document.getElementById("terceiro");
  if (
    elemento.id.localeCompare("primeiro") !== 0 &&
    elemento.value === opcao1.value
  ) {
    opcao1.value = "";
  }
  if (
    elemento.id.localeCompare("segundo") !== 0 &&
    elemento.value === opcao2.value
  ) {
    opcao2.value = "";
  }
  if (
    elemento.id.localeCompare("terceiro") !== 0 &&
    elemento.value === opcao3.value
  ) {
    opcao3.value = "";
  }
}

function validateUserInfo() {
  let perguntas = [
    "idade",
    "genero",
    "frequencia",
    "browser1",
    "browser2",
    "browser3",
    "outros_Browser",
    "quais"
  ];
  let xmlRowString = "<Questionario>" + "\n";
  xmlRowString += '<Parte id="parte1">\n';
  for (let i = 0; i < perguntas.length; i++) {
    let a = document.forms["user"][perguntas[i]].value;
    if (a === "" || a === null) {
      a = "Não Respondeu";
    }
    xmlRowString += "<q id=" + '"' + perguntas[i] + '" ' + ">" + a + "</q>\n";
  }
  xmlRowString += "</Parte>\n";
  localStorage.setItem("self", 0);
  localStorage.setItem("user" + (window.localStorage.length + 1), xmlRowString);
}
function validateTask() {
  xmlRowString = localStorage.getItem("user" + window.localStorage.length);

  console.log("sdsds");
  xmlRowString += '<Parte id="parte2">\n';
  let perguntas = [
    "erro",
    "resultado",
    "dificuldade",
    "pesquisa_cor",
    "dificuldade_resultado",
    "resultando_semelhança",
    "utilidade_pesquisa",
    "pesquisa_detalhe",
    "adequado"
  ];

  for (let i = 0; i < perguntas.length; i++) {
    let a = document.forms["tarefas"][perguntas[i]].value;
    if (a !== "") {
      xmlRowString += "<q id=" + '"' + perguntas[i] + '" ' + ">" + a + "</q>\n";
    } else {
      a = "Não Respondeu";
      xmlRowString += "<q id=" + '"' + perguntas[i] + '" ' + ">" + a + "</q>\n";
    }
  }

  console.log(xmlRowString);

  xmlRowString += "</Parte>\n";
  localStorage.setItem("user" + window.localStorage.length, xmlRowString);
}

function validateAvaliation() {
  xmlRowString = localStorage.getItem("user" + window.localStorage.length);

  xmlRowString += '<Parte id="parte3">';

  let perguntas = [
    "experiencia",
    "estimulacao",
    "gratificancia",
    "facil",
    "regularidade",
    "complex",
    "facilidade",
    "necessidade_ajuda",
    "funcionalidades",
    "inconsistencia",
    "aprender",
    "complexidade_utilizacao",
    "confianca",
    "lidar"
  ];

  for (let i = 0; i < perguntas.length; i++) {
    let a = document.forms["avaliacao"][perguntas[i]].value;
    if (a !== "") {
      xmlRowString += "<q id=" + '"' + perguntas[i] + '" ' + ">" + a + "</q>\n";
    } else {
      a = "Não Respondeu";
      xmlRowString += "<q id=" + '"' + perguntas[i] + '" ' + ">" + a + "</q>\n";
    }
  }
  xmlRowString += "</Parte>\n";
  xmlRowString += "</Questionario>";

  console.log(xmlRowString);

  localStorage.setItem("user" + window.localStorage.length, xmlRowString);
  localStorage.setItem(
    "self",
    localStorage.getItem("user" + window.localStorage.length)
  );
}

function getUltimosResultados() {
  let localStorageRow = window.localStorage.getItem("self");
  if (window.DOMParser) {
    let parser = new window.DOMParser();
    let xmlDoc = parser.parseFromString(localStorageRow, "text/xml");

    let partes = xmlDoc.getElementsByTagName("Parte");

    for (let i = 0; i < partes.length; i++) {
      let idELemPai = partes[i].id;

      let x0 = xmlDoc.getElementById(idELemPai);
      let x = x0.children;
      for (let y = 0; y < x.length; y++) {
        let pergunta = x[y].id;

        let elem = document.getElementById(idELemPai);
        let filho = document.createTextNode(
          pergunta + ": " + x[y].childNodes[0].nodeValue
        );
        elem.appendChild(filho);
        elem.appendChild(document.createElement("br"));
      }
    }
  }
}
function getResultadosTotais() {
  let keys = {};
  //este for funciona porque o localstorage é um dicionario, nao é muito bom usar, mas serve por agora
  for (let key in window.localStorage) {
    //regex para testar se a chave do localstorage é uma resposta do formulario
    //nao é infalivel, se alguem escrever uma chave chamada user, em que nao seja a resposta
    //de um questionario vai dar asneira
    //TODO melhorar esta parte
    if (/user\d*/.test(key)) {
      keys[key] = window.localStorage.getItem(key);
    }
  }

  for (const key in keys) {
    let localStorageRow = window.localStorage.getItem(key);
    const elemAvo = document.getElementById("user_info");

    if (window.DOMParser) {
      let parser = new window.DOMParser();
      let xmlDoc = parser.parseFromString(localStorageRow, "text/xml");

      let elemPai = document.getElementById(key);
      if (elemPai === null) {
        elemPai = document.createElement("div");
        elemPai.className = "incs2 box";
        elemPai.id = key;

        elemAvo.appendChild(elemPai);
      }

      let partes = xmlDoc.getElementsByTagName("Parte");
      for (let i = 0; i < partes.length; i++) {
        let classElem = partes[i].id;

        let elem = document.createElement("div");
        elem.className = classElem + " box";

        let x = xmlDoc.getElementById(classElem).children;

        for (let y = 0; y < x.length; y++) {
          let pergunta = x[y].id;

          let filho = document.createElement("p");
          filho.innerHTML = pergunta + ": " + x[y].childNodes[0].nodeValue;

          // add class do texto a seguir
          // filho.classElem =

          elem.appendChild(filho);
        }

        elemPai.appendChild(elem);
      }
    }
  }
}
