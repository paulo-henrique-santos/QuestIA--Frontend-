// script.js - Traduzido para Português e Atualizado com Limpeza e Formato JSON

// Referências aos elementos importantes no DOM
const divTemas = document.getElementById('temas');
const divJogo = document.getElementById('jogo'); // Contêiner onde a Jogo/resposta é exibida
const btnGerarJogo = document.getElementById('gerar-jogo-btn'); // Botão Gerar Jogo para gerenciar estado (desabilitar/habilitar)
const btnLimparCampos = document.getElementById('limpar-temas-btn'); // Referência ao botão Limpar Campos

/**
 * @function atualizarBotoesRemover
 * @description Habilita ou desabilita os botões de remoção de temas
 * com base na quantidade de campos de tema na lista.
 */
function atualizarBotoesRemover() {
    const botoesRemover = divTemas.querySelectorAll('.tema-row .btn-danger');
    const linhasTemas = divTemas.querySelectorAll('.tema-row');
    const contadorLinhas = linhasTemas.length;

    botoesRemover.forEach(botao => {
        botao.disabled = contadorLinhas <= 3; // Desabilita se houver 3 ou menos, para manter o mínimo
    });
}

/**
 * @function adicionarTema
 * @description Cria e adiciona dinamicamente um novo campo de input para tema
 * junto com um botão "Excluir" associado ao contêiner de temas no DOM.
 */
function adicionarTema() {
    const linhaTemaDiv = document.createElement('div');
    linhaTemaDiv.className = 'tema-row flex items-center space-x-2';

    const novoInput = document.createElement('input');
    novoInput.type = 'text';
    novoInput.className = 'tema tema-input flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700';
    novoInput.placeholder = `Informe um tema de jogo...`;
    // Adiciona aria-label para acessibilidade
    const currentThemeCount = divTemas.querySelectorAll('.tema-row').length + 1;
    novoInput.setAttribute('aria-label', `Tema do jogo ${currentThemeCount}`);


    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'btn-danger bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm';
    botaoRemover.innerText = 'Excluir';

    botaoRemover.addEventListener('click', () => removerTema(botaoRemover));

    linhaTemaDiv.appendChild(novoInput);
    linhaTemaDiv.appendChild(botaoRemover);

    divTemas.appendChild(linhaTemaDiv);
    atualizarBotoesRemover();
}

/**
 * @function removerTema
 * @description Remove a div que contém o campo de input e o botão "Excluir"
 * associada ao botão "Excluir" que foi clicado.
 * @param {HTMLButtonElement} botao - O botão "Excluir" (o elemento HTML) que acionou a remoção.
 */
function removerTema(botao) {
    const linhaTema = botao.parentElement;
    if (linhaTema) {
        linhaTema.remove();
    } else {
        console.error('[removerTema] Não foi possível encontrar o elemento pai (tema-row) para remover.');
    }
    atualizarBotoesRemover();
}

/**
 * @function limparCamposTemas
 * @description Percorre todos os campos de input de temas existentes no DOM
 * e define o valor de cada um como vazio.
 */
function limparCamposTemas() {
    console.log('[limparCamposTemas] Limpando campos...');
    const inputs = divTemas.querySelectorAll('.tema-row .tema-input');
    inputs.forEach(input => {
        input.value = '';
    });
    console.log('[limparCamposTemas] Campos limpos.');
}

/**
 * @function renderizarJogo
 * @description Recebe um objeto de jogo (JSON) e renderiza seu conteúdo no DOM.
 * @param {Object} jogo - O objeto JSON contendo os detalhes do jogo.
 */
function renderizarJogo(jogo) {
    divJogo.innerHTML = ''; // Limpa o conteúdo anterior
    // Limpa o conteúdo anterior e garante que a área de resposta esteja pronta para exibir o jogo
    jogo.forEach((item, index) => {
        console.log(item);
        divJogo.innerHTML += `${item}`;
    })
    divJogo.classList.remove('hidden'); // Garante que a div esteja visível
    divJogo.classList.remove('text-red-600'); // Remove cor de erro anterior
    divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
}


/**
 * @function enviarFormulario
 * @description Coleta os temas dos campos de input, valida,
 * envia os dados para a API do back-end Flask e processa a resposta.
 */
async function enviarFormulario() {
    console.log('[enviarFormulario] Processando e enviando formulário...');

    // Desabilita o botão e muda o texto
    btnGerarJogo.disabled = true;
    btnGerarJogo.innerHTML = 'Gerando...';

    // Mostra indicador de carregamento
    divJogo.innerHTML = 'Carregando...';
    divJogo.classList.remove('hidden');
    divJogo.classList.remove('text-red-600'); // Remove cor de erro, caso tenha tido um erro anterior

    // Coleta e valida os temas
    const inputsTema = divTemas.querySelectorAll('.tema-row .tema-input');
    const temasPreenchidos = [];

    inputsTema.forEach(input => {
        const valor = input.value.trim();
        if (valor) {
            temasPreenchidos.push(valor);
        }
    });

    console.log('[enviarFormulario] Temas coletados e preenchidos:', temasPreenchidos);

    if (temasPreenchidos.length < 3) {
        alert('Por favor, preencha pelo menos três campos de tema para buscar um jogo!');
        divJogo.classList.add('hidden'); // Esconde a div de carregamento/resultado
        btnGerarJogo.disabled = false;
        btnGerarJogo.innerHTML = 'Buscar Jogo';
        return;
    }

    const dados = {
        temas: temasPreenchidos, // Envia APENAS os temas preenchidos
    };
    console.log('[enviarFormulario] Dados preparados para API:', dados);

    try {
        console.log('[enviarFormulario] Enviando requisição para API...');
        const resposta = await fetch('http://127.0.0.1:5000/jogo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        // Tenta parsear a resposta como JSON, independentemente do status
        const resultado = await resposta.json();
        console.log('[enviarFormulario] Resposta JSON parseada:', resultado);
        renderizarJogo(resultado);
        // // Verifica se a resposta foi um erro HTTP (ex: 400, 500)
        // if (!resposta.ok) {
        //     console.error('[enviarFormulario] Erro HTTP da API:', resposta.status, resultado);
        //     divJogo.innerHTML = `<p class="text-red-600 font-semibold">Erro (${resposta.status}): ${resultado.error || 'Ocorreu um erro no servidor.'}</p>`;
        //     divJogo.classList.add('text-red-600');
        // }
        // // Se a resposta HTTP foi OK (status 2xx), verifica o conteúdo do JSON
        // else if (resultado && typeof resultado === 'object') {
        //     if ("error" in resultado) { // A IA retornou um JSON de erro
        //         console.error('[enviarFormulario] API retornou erro da IA:', resultado.error);
        //         divJogo.innerHTML = `<p class="text-red-600 font-semibold">Erro: ${resultado.error}</p>`;
        //         divJogo.classList.add('text-red-600');
        //     }
        //     // Se o JSON contém as chaves esperadas para um jogo
        //     else if (resultado.titulo && Array.isArray(resultado.temas) && Array.isArray(resultado.sinopse_do_jogo)) {
        //         console.log('[enviarFormulario] Objeto de Jogo válido encontrado. Renderizando.');
        //         renderizarJogo(resultado); // Passa o objeto completo para renderizarJogo
        //         limparCamposTemas(); // Limpa os campos após o sucesso
        //     } else { // Formato JSON inesperado ou incompleto
        //         console.error('[enviarFormulario] API retornou formato inesperado ou dados incompletos para um jogo:', resultado);
        //         divJogo.innerHTML = '<p class="text-red-600 font-semibold">Erro: Formato de resposta inesperado da API ou dados do jogo incompletos.</p>';
        //         divJogo.classList.add('text-red-600');
        //     }
        // } else { // Resposta não é um objeto JSON válido
        //     console.error('[enviarFormulario] Resposta da API não é um objeto JSON válido:', resultado);
        //     divJogo.innerHTML = '<p class="text-red-600 font-semibold">Erro: Resposta inválida da API.</p>';
        //     divJogo.classList.add('text-red-600');
        // }

    } catch (error) {
        console.error('[enviarFormulario] Erro no Fetch ou parsing JSON:', error);
        divJogo.innerHTML = `<p class="text-red-600 font-semibold">Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}.</p><p class="text-gray-500 text-sm mt-2">Verifique se o backend está rodando em http://127.0.0.1:5000.</p>`;
        divJogo.classList.add('text-red-600');
    } finally {
        // Reabilita o botão e restaura o texto
        btnGerarJogo.disabled = false;
        btnGerarJogo.innerHTML = 'Buscar Jogo';
        console.log('[enviarFormulario] Finalizado.');
    }
}

/**
 * @description Este é o ponto de entrada principal do script. Ele espera o DOM carregar,
 * obtém referências aos botões e anexa os event listeners apropriados.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado.');

    const btnAdicionarTema = document.getElementById('add-tema-btn');
    btnAdicionarTema.addEventListener('click', adicionarTema);
    console.log('Event listener adicionado ao botão "Adicionar Tema".');

    btnGerarJogo.addEventListener('click', enviarFormulario);
    console.log('Event listener adicionado ao botão "Buscar Jogo".');

    btnLimparCampos.addEventListener('click', limparCamposTemas);
    console.log('Event listener adicionado ao botão "Limpar Campos".');

    const botoesRemoverIniciais = divTemas.querySelectorAll('.tema-row .btn-danger');
    botoesRemoverIniciais.forEach(botao => {
        botao.addEventListener('click', () => removerTema(botao));
    });
    console.log('Event listeners adicionados aos botões "Excluir" iniciais.');

    atualizarBotoesRemover();
    console.log('atualizarBotoesRemover chamado na inicialização.');
});