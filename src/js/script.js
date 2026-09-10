let cmpCidade = document.getElementById("cidade");
let eltMensagem = document.getElementById("mensagem");
let eltCidades = document.getElementById("cidades");
let eltPrevisao = document.getElementById("previsao");

cmpCidade.addEventListener("keydown", function(chave) {

    if(chave.key == "Enter") {

        // Ao apertar a tecla "Enter", a função buscarCidades() é chamada para buscar as cidades correspondentes ao nome digitado pelo usuário.
        buscarCidades();

    }

});

// Esta função busca as cidades correspondentes ao nome digitado pelo usuário. Ela faz uma requisição para a API do BrasilAPI e exibe as cidades encontradas na página.
async function buscarCidades() {
    // Obtém o valor digitado pelo usuário no campo de entrada de texto (input) com o ID "cidade" e armazena na variável nmCidade após remover espaços em branco no início e no final da string usando o método trim().
    let nmCidade = cmpCidade.value.trim();

    if(nmCidade == "") {

        // Exibe uma mensagem para digitar o nome da cidade enquanto a requisição para a API ainda nao foi utilizada
        eltMensagem.textContent = "Digite o nome de uma cidade";

    }else {

        // Exibe uma mensagem de busca enquanto a requisição para a API está sendo processada
        eltMensagem.textContent = "Buscando cidades...";

        // Limpa as cidades adicionadas anteriormente antes de adicionar as novas cidades
        eltCidades.innerHTML = "";

        //Limpa as previsões adicionadas anteriormente antes de adicionar as novas previsões
        eltPrevisao.innerHTML = "";

        // Faz uma requisição para a API do BrasilAPI para buscar as cidades correspondentes ao nome digitado pelo usuário. A URL da requisição é construída dinamicamente usando o valor de nmCidade.
        let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/cidade/${nmCidade}`);

        // Converte a resposta da requisição para o formato JSON e armazena os dados na variável dados.
        let dados = await valor.json();

        if(valor.ok) {

            for(let i = 0; i < dados.length; i++) {

                // Cria uma tag <button> para cada cidade encontrada
                let eltCidade = document.createElement("button");

                // Coloca um type = "type" na tag button
                eltCidade.type = "type";
                
                // Adiciona o nome da cidade e o estado no conteúdo do eltCidade
                eltCidade.textContent = `${dados[i].nome} - ${dados[i].estado}`;

                // Adiciona a classe "cidade" ao eltCidade
                eltCidade.classList.add("cidade");
                
                // Adiciona um evento de clique ao eltCidade para buscar a previsão do tempo da cidade correspondente
                eltCidade.addEventListener("click", function() {
                    buscarPrevisao(dados[i].id);
                });
                
                // Faz a  aplicação do eltCidade
                eltCidades.appendChild(eltCidade);

            }

            // Exibe a quantidade de cidades e uma mensagem
            eltMensagem.textContent = `${dados.length} cidade(s) encontradas(s)`;

        }else {

            // Se a requisição não for bem-sucedida, exibe a mensagem
            eltMensagem.textContent = "Nenhuma cidade localizada.";

        }

    }
    
}

// Esta função busca a previsão do tempo para a cidade selecionada pelo usuário. Ela faz uma requisição para a API do BrasilAPI usando o ID da cidade e exibe as informações de previsão do tempo na página.
async function buscarPrevisao(previsoes) {
    eltPrevisao.textContent = "Buscando previsão do tempo...";

    let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${previsoes}`);

    let dados = await valor.json();

    if(valor.ok) {

        let dias = `
            <article class="dia">
                <p class="data">Data: ${fmtData(dados.clima[0].data)}</p>
                <p>${dados.clima[0].condicao_desc}</p>
                <div class="temperaturas">
                    <span><strong>${dados.clima[0].min}°</strong>Mínima</span>
                    <span><strong>${dados.clima[0].min}°</strong>Máxima</span>
                </div>
                <p>Indice UV: ${dados.clima[0].indice_uv}</p>
            </article>
        `;

        // Esta criando o conteúdo HTML para exibir a previsão do tempo da cidade selecionada. Ele inclui o nome da cidade, estado, data, condição climática, temperatura mínima e máxima, e índice UV.
        eltPrevisao.innerHTML = `
            <h2>${dados.cidade} - ${dados.estado}</h2>
            <div class="dias">${dias}</div>
        `;

        // Limpa as cidades adicionadas anteriormente antes de adicionar as novas cidades
        eltCidades.innerHTML = "";


        // Limpa a mensagem da quantidade de cidades
        eltMensagem.textContent = "";

    }else {

        // Se a requisição não for bem-sucedida, exibe a mensagem de erro retornada pela API
        eltPrevisao.textContent = dados.message;

    }
}

// Esta formatando a data recebida no formato "YYYY-MM-DD" para o formato "DD/MM/YYYY"
function fmtData(data) {

    let nros = data.split("-");
    return `${nros[2]}/${nros[1]}/${nros[0]}`;

}