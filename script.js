// script.js - Traduzido para Português e Atualizado com Limpeza

// Referências aos elementos importantes no DOM
// Obtemos referências aos elementos HTML usando seus IDs para manipulá-los no JavaScript.
const divTemas = document.getElementById('temas'); // Contêiner onde as linhas de temas ficam
const divJogo = document.getElementById('jogo'); // Contêiner onde a Jogo/resposta é exibida
const btnGerarJogo = document.getElementById('gerar-jogo-btn'); // Botão Gerar Jogo para gerenciar estado (desabilitar/habilitar)
const btnLimparCampos = document.getElementById('limpar-temas-btn'); // NOVO: Referência ao botão Limpar Campos

/**
 * @function atualizarBotoesRemover
 * @description Habilita ou desabilita os botões de remoção de temas
 * com base na quantidade de campos de tema na lista.
 * Propósito: Garantir que haja sempre pelo menos 3 campos (o número inicial) não removíveis,
 * impedindo que o usuário exclua todos os inputs.
 */
function atualizarBotoesRemover() {
    // Seleciona todos os botões com a classe .btn-danger dentro de um elemento .tema-row.
    // Querying dentro de divTemas é mais eficiente do que em todo o documento.
    const botoesRemover = divTemas.querySelectorAll('.tema-row .btn-danger');
    // Seleciona todas as divs que representam linhas de tema para contar.
    const linhasTemas = divTemas.querySelectorAll('.tema-row');
    // Obtém a contagem atual de linhas de tema.
    const contadorLinhas = linhasTemas.length;

    // Itera sobre cada botão "Excluir" encontrado.
    botoesRemover.forEach(botao => {
        // Define a propriedade 'disabled' do botão: será true se o contador de linhas for <= 3,
        // e false se for > 3. As classes Tailwind 'disabled:...' cuidam da aparência.
        botao.disabled = contadorLinhas <= 3;
    });

    // Log opcional para debug no console do navegador.
    // console.log(`[atualizarBotoesRemover] Contagem: ${contadorLinhas}. Botões Remover desabilitados: ${contadorLinhas <= 3}.`);
}

/**
 * @function adicionarTema
 * @description Cria e adiciona dinamicamente um novo campo de input para tema
 * junto com um botão "Excluir" associado ao contêiner de temas no DOM.
 */
function adicionarTema() {
    // console.log('[adicionarTema] Adicionando novo tema...');

    // 1. Cria o elemento 'div' que envolverá o input e o botão (a "linha" do tema).
    const linhaTemaDiv = document.createElement('div');
    // Adiciona as classes Tailwind para layout flex, alinhamento e espaçamento.
    linhaTemaDiv.className = 'tema-row flex items-center space-x-2'; // Reusa as classes da estrutura HTML inicial

    // 2. Cria o elemento 'input' para o nome do tema.
    const novoInput = document.createElement('input');
    // Define o tipo do input como 'text'.
    novoInput.type = 'text';
    // Adiciona as classes Tailwind para estilização (padding, borda, arredondamento, foco)
    // e classes de identificação ('tema', 'tema-input').
    novoInput.className = 'tema tema-input flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700';
    // Define o texto que aparece no input quando está vazio.
    novoInput.placeholder = `Informe um tema de jogo...`;

    // 3. Cria o elemento 'button' para remover a linha do tema.
    const botaoRemover = document.createElement('button');
     // Adiciona as classes Tailwind para estilização (fundo, hover, texto, padding, arredondamento, estado disabled)
    botaoRemover.className = 'btn-danger bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-sm';
    // Define o texto visível no botão.
    botaoRemover.innerText = 'Excluir';

    // Anexa um event listener de 'click' ao botão "Excluir" recém-criado.
    // Quando clicado, chama a função `removerTema`, passando o próprio botão como argumento.
    // Usamos uma arrow function `() => removerTema(botaoRemover)` para garantir que `removerTema`
    // seja chamada no momento do click e receba o `botaoRemover` correto, mesmo dentro do loop ou contexto de criação.
    botaoRemover.addEventListener('click', () => removerTema(botaoRemover));
    // console.log('[adicionarTema] Event listener adicionado ao botão Excluir.');

    // 4. Monta a nova linha: anexa o input e o botão como filhos da div da linha.
    linhaTemaDiv.appendChild(novoInput);
    linhaTemaDiv.appendChild(botaoRemover);

    // 5. Adiciona a nova linha completa (div com input e botão) ao contêiner principal de temas no DOM.
    divTemas.appendChild(linhaTemaDiv);
    // console.log('[adicionarTema] Nova linha anexada ao contêiner principal.');

    // 6. Após adicionar um novo campo, reavalia e atualiza o estado dos botões "Excluir".
    atualizarBotoesRemover();
    // console.log('[adicionarTema] atualizarBotoesRemover chamado.');
}

/**
 * @function removerTema
 * @description Remove a div que contém o campo de input e o botão "Excluir"
 * associada ao botão "Excluir" que foi clicado.
 * @param {HTMLButtonElement} botao - O botão "Excluir" (o elemento HTML) que acionou a remoção.
 */
function removerTema(botao) {
    // console.log('[removerTema] Removendo tema...');
    // Obtém o elemento pai do botão clicado, que é a div 'tema-row'.
    const linhaTema = botao.parentElement;
    // Verifica se o elemento pai foi encontrado antes de tentar removê-lo.
    if (linhaTema) {
        // Remove a div da linha de tema (e seus filhos) do DOM.
        linhaTema.remove(); // Método moderno para remover um elemento.
        // console.log('[removerTema] Linha do tema removida do DOM.');
    } else {
        // Log de erro caso algo inesperado aconteça e o pai não seja encontrado.
        console.error('[removerTema] Não foi possível encontrar o elemento pai (tema-row) para remover.');
    }
    // Após remover um campo, reavalia e atualiza o estado dos botões "Excluir".
    atualizarBotoesRemover();
    // console.log('[removerTema] atualizarBotoesRemover chamado.');
}

/**
 * @function limparCamposTemas
 * @description Percorre todos os campos de input de temas existentes no DOM
 * e define o valor de cada um como vazio.
 */
function limparCamposTemas() {
    console.log('[limparCamposTemas] Limpando campos...');
    // Seleciona todos os inputs de tema dentro do contêiner divTemas.
    const inputs = divTemas.querySelectorAll('.tema-row .tema-input');
    // Itera sobre a lista de inputs encontrada.
    inputs.forEach(input => {
        // Define o valor atual do input como uma string vazia.
        input.value = '';
    });
    console.log('[limparCamposTemas] Campos limpos.');
}




/**
 * @function enviarFormulario
 * @description Coleta os temas dos campos de input, valida se há pelo menos 3,
 * envia os dados para a API do back-end Flask usando Fetch API,
 * processa a resposta (Jogo em JSON ou erro) e exibe o resultado na tela.
 * É uma função assíncrona (`async`) pois contém operações que esperam (`await`),
 * como a requisição de rede.
 */
async function enviarFormulario() {
    console.log('[enviarFormulario] Processando e enviando formulário...');

    // Desabilita o botão "Gerar Jogo" para evitar múltiplos cliques enquanto a requisição está em andamento.
    btnGerarJogo.disabled = true;
    // Altera o texto do botão para dar feedback visual ao usuário.
    btnGerarJogo.innerHTML = 'Gerando...';

    // Limpa qualquer conteúdo anterior na área de resposta e mostra um indicador de carregamento.
    divJogo.innerHTML = 'Carregando...';
    // Garante que a área de resposta esteja visível removendo a classe 'hidden' do Tailwind.
    divJogo.classList.remove('hidden');
    // Opcional: Ajusta classes Tailwind para centralizar o texto de carregamento, se desejado.
    // divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-center max-w-xl mx-auto';


    // Seleciona todos os elementos de input de tema no DOM.
    const inputsTema = divTemas.querySelectorAll('.tema-row .tema-input');
    const temas = []; // Inicializa um array para armazenar os valores dos temas.

    // Itera sobre cada input de tema encontrado.
    inputsTema.forEach(input => {
        // Obtém o valor do input e remove espaços em branco no início/fim (`.trim()`).
        const valor = input.value.trim();
        // Verifica se o valor não está vazio após remover espaços.
        if (valor) {
            // Adiciona o valor (tema) ao array.
            temas.push(valor);
        }
    });

    console.log('[enviarFormulario] temas coletados:', temas);

    // Validação mínima no frontend: Verifica se pelo menos 3 temas foram preenchidos.
    // Esta é uma validação de User Experience (UX) para dar feedback imediato antes de chamar a API.
    // O backend também deve validar por segurança.
    if (temas.length < 3) {
        alert('Por favor, preencha pelo menos três campos de tema para gerar uma Jogo!');
        console.warn('[enviarFormulario] Validação falhou: Menos de 3 temas.');
        // Oculta a área de resposta novamente se a validação falhar.
        divJogo.classList.add('hidden');
        // Reabilita o botão "Gerar Jogo" e restaura seu texto.
        btnGerarJogo.disabled = false;
        btnGerarJogo.innerHTML = 'Gerar Jogo';
        return; // Sai da função, interrompendo o processo de envio.
    }

    // Prepara os dados no formato de objeto JSON esperado pelo backend.
    const dados = {
        temas: temas
    };
    console.log('[enviarFormulario] Dados preparados para API:', dados);

    // Inicia um bloco `try...catch...finally` para gerenciar erros durante a requisição e processamento.
    try {
        console.log('[enviarFormulario] Enviando requisição para API...');
        // Usa a Fetch API para enviar a requisição assíncrona.
        // `await` pausa a execução da função `enviarFormulario` até que a Promise retornada por `fetch` seja resolvida.
        const resposta = await fetch('http://127.0.0.1:5000/jogo', { // URL do endpoint da sua API Flask.
            method: 'POST', // Define o método HTTP como POST.
            headers: {
                // Define o cabeçalho Content-Type para informar ao servidor que o corpo da requisição é JSON.
                'Content-Type': 'application/json'
            },
            // Converte o objeto JavaScript `dados` em uma string JSON para enviar no corpo da requisição.
            body: JSON.stringify(dados)
        });

        console.log('[enviarFormulario] Resposta da API recebida (Status: ' + resposta.status + ').');

        // `await resposta.json()` tenta ler o corpo da resposta e parseá-lo como JSON.
        // Esta operação também é assíncrona e pode falhar se a resposta não for JSON válido.
        const resultado = await resposta.json();
        console.log('[enviarFormulario] Resposta JSON parseada:', resultado); // Loga o objeto/array resultante do parsing.

        // --- VERIFICAÇÃO AJUSTADA DA ESTRUTURA DA RESPOSTA ---
        // Variável para armazenar o objeto da Jogo se ele for encontrado e validado.
        let objetoJogo = null;

        // 1. Tenta encontrar e validar o objeto da Jogo SE o resultado for um Array contendo um objeto no índice 0.
        if (Array.isArray(resultado) && resultado.length > 0 && typeof resultado[0] === 'object' &&
            // Valida se o objeto no índice 0 tem as chaves e tipos esperados para uma Jogo.
            resultado[0].titulo && Array.isArray(resultado[0].temas) && Array.isArray(resultado[0].sinopse_do_jogo)) {

            console.log('[enviarFormulario] Recebido Array com objeto de Jogo esperado no índice 0. Usando resultado[0].');
            objetoJogo = resultado[0]; // Associa o objeto encontrado dentro do array.

        }
        // 2. Caso contrário, tenta encontrar e validar o objeto da Jogo SE o resultado for diretamente um objeto.
        else if (resultado && typeof resultado === 'object' &&
                 // Valida se o objeto diretamente recebido tem as chaves e tipos esperados para uma Jogo.
                 resultado.titulo && Array.isArray(resultado.temas) && Array.isArray(resultado.sinopse_do_jogo)) {

             console.log('[enviarFormulario] Recebido objeto de Jogo esperado diretamente. Usando resultado.');
             objetoJogo = resultado; // Associa o objeto direto.

        }
        // --- FIM DA VERIFICAÇÃO AJUSTADA ---


        // Agora, verifica se conseguimos encontrar e validar com sucesso um `objetoJogo` em um dos formatos esperados.
        if (objetoJogo) { // Se `objetoJogo` for um objeto válido (não null/undefined).
             console.log('[enviarFormulario] Objeto de Jogo válido encontrado. Renderizando.');
             // Chama a função `renderizarJogo`, passando o objeto validado para construir o HTML e exibi-lo.
             renderizarJogo(objetoJogo);
             // NOVO: Chama a função para limpar todos os campos de input de temas após a geração bem-sucedida da Jogo.
             limparCamposTemas();
             // Garante que as classes da área de resposta estejam corretas (texto alinhado à esquerda, etc.) para a Jogo renderizada.
             divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';

        }
        // Verifica se o resultado parseado é um objeto que contém uma chave 'error' (formato de erro retornado pelo backend).
        else if (resultado && typeof resultado === 'object' && resultado.error) {
             console.error('[enviarFormulario] API retornou objeto de erro:', resultado.error);
             // Exibe a mensagem de erro retornada pelo backend na área de resposta.
             divJogo.innerHTML = `<p class="text-red-600 font-semibold">Erro da API: ${resultado.error}</p>`;
             divJogo.classList.add('text-red-600'); // Adiciona classe Tailwind para cor vermelha ao texto do erro.
             // Garante classes de layout corretas para exibição do erro.
             divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';

        }
        // Se nenhuma das verificações acima correspondeu, o formato da resposta da API é inesperado.
        else {
            console.error('[enviarFormulario] API retornou formato inesperado:', resultado);
            // Exibe uma mensagem de erro genérica informando sobre o formato inesperado.
            divJogo.innerHTML = '<p class="text-red-600 font-semibold">Erro: Formato de resposta inesperado da API.</p>';
            divJogo.classList.add('text-red-600'); // Adiciona classe para cor vermelha.
            // Garante classes de layout corretas para exibição do erro.
            divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        }

        // Torna a área de resposta visível (já foi feito no início, mas garante caso a classe 'hidden' fosse re-adicionada).
        divJogo.classList.remove('hidden');


    } catch (error) {
        // Este bloco `catch` é executado se ocorrer qualquer erro durante o bloco `try` que não foi tratado internamente,
        // como erros de rede (servidor offline, CORS bloqueado) ou falha ao parsear a resposta como JSON.
        console.error('[enviarFormulario] Erro no Fetch ou parsing JSON:', error);
        // Exibe uma mensagem de erro genérica na área de resposta com os detalhes do erro capturado.
        divJogo.innerHTML = `<p class="text-red-600 font-semibold">Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}</p>`;
        divJogo.classList.add('text-red-600'); // Adiciona classe para cor vermelha.
        // Garante que as classes da área de resposta estejam corretas.
        divJogo.className = 'jogo bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        divJogo.classList.remove('hidden');

    } finally {
        // O bloco `finally` é executado SEMPRE, independentemente de ter ocorrido um erro ou não no bloco `try`.
        // É ideal para código de limpeza, como reabilitar botões ou esconder indicadores de carregamento.
        // Reabilita o botão "Gerar Jogo".
        btnGerarJogo.disabled = false;
        // Restaura o texto original do botão.
        btnGerarJogo.innerHTML = 'Gerar Jogo';
        console.log('[enviarFormulario] Finalizado.');
    }
}

/**
 * @description Este é o ponto de entrada principal do script. Ele espera o DOM carregar,
 * obtém referências aos botões e anexa os event listeners apropriados.
 */
// Adiciona um listener ao evento 'DOMContentLoaded'. Este evento é disparado quando o
// documento HTML foi completamente carregado e parseado (o DOM está pronto).
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado.');

    // Obtém a referência ao botão "Adicionar tema" pelo ID.
    const btnAdicionarTema = document.getElementById('add-tema-btn');

    // Anexa um event listener de 'click' ao botão "Adicionar tema".
    // Quando clicado, a função `adicionarTema` será executada.
    btnAdicionarTema.addEventListener('click', adicionarTema);
    console.log('Event listener adicionado ao botão "Adicionar tema".');

    // Anexa um event listener de 'click' ao botão "Gerar Jogo".
    // Quando clicado, a função assíncrona `enviarFormulario` será executada.
    btnGerarJogo.addEventListener('click', enviarFormulario); // btnGerarJogo já foi obtido globalmente
    console.log('Event listener adicionado ao botão "Gerar Jogo".');

     // NOVO: Anexa um event listener de 'click' ao botão "Limpar Campos".
    // Quando clicado, a função `limparCamposTemas` será executada.
    btnLimparCampos.addEventListener('click', limparCamposTemas); // btnLimparCampos já foi obtido globalmente
    console.log('Event listener adicionado ao botão "Limpar Campos".');


    // Seleciona todos os botões "Excluir" que já existem no HTML inicial quando a página carrega.
     const botoesRemoverIniciais = divTemas.querySelectorAll('.tema-row .btn-danger');
     // Itera sobre esses botões iniciais.
     botoesRemoverIniciais.forEach(botao => {
         // Anexa um event listener de 'click' a cada um deles.
         // A arrow function garante que `removerTema` seja chamada com o botão clicado correto.
         botao.addEventListener('click', () => removerTema(botao));
     });
     console.log('Event listeners adicionados aos botões "Excluir" iniciais.');

    // Chama a função `atualizarBotoesRemover` uma vez na inicialização.
    // Isso garante que os botões "Excluir" iniciais (que são 3) estejam desabilitados no carregamento da página.
    atualizarBotoesRemover();
    console.log('atualizarBotoesRemover chamado na inicialização.');
});