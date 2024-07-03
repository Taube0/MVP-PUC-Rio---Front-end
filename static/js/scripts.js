document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();

    const form = document.getElementById('adicionar-filme-form');
    if (form) {
        form.addEventListener('submit', adicionarFilme);
    }

    // Pega o modal
    var modal = document.getElementById("modal-edicao");

    // Pega o botão de fechar modal
    var span = document.getElementsByClassName("close")[0];

    // Fecha o modal ao clicar no "X"
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Fecha o modal ao clicar fora do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

async function carregarFilmes() {
    try {
        const response = await fetch('/lista');
        if (!response.ok) {
            throw new Error(`Erro ao carregar filmes: ${response.statusText}`);
        }
        const filmes = await response.json();
        const lista = document.getElementById('filme-lista');
        lista.innerHTML = '';
        filmes.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.classList.add('filme');
            filmeDiv.innerHTML = `
                <h2 id="titulo_${filme.id}">${filme.titulo} (${filme.ano})</h2>
                <p id="ano_lancamento_${filme.id}"><strong>Gênero:</strong> ${filme.genero}</p>
                <p id="genero_${filme.id}">${filme.genero}</p>
                <p id="descricao_${filme.id}">${filme.descricao}</p>
                <button class="editar-btn" onclick="mostrarFormularioEdicao(${filme.id})">Editar</button>
                <button class="excluir-btn" onclick="excluirFilme(${filme.id})">Excluir</button>
            `;
            lista.appendChild(filmeDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

async function adicionarFilme(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = {
        titulo: formData.get('titulo'),
        ano: formData.get('ano'),
        genero: formData.get('genero'),
        descricao: formData.get('descricao')
    };

    try {
        const response = await fetch('/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            carregarFilmes();
            form.reset();
        }
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        alert('Erro ao adicionar filme');
    }
}

async function excluirFilme(id) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return;

    try {
        const response = await fetch(`/excluir?id=${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir filme: ${response.statusText}`);
        }

        alert('Filme excluído com sucesso');
        carregarFilmes();
    } catch (error) {
        console.error(error);
        alert('Erro ao excluir filme');
    }
}

function mostrarFormularioEdicao(filme_id) {
    // Pega os dados dos elementos HTML
    const titulo = document.getElementById('titulo_' + filme_id).textContent;
    const anoDeLancamento = document.getElementById('ano_lancamento_' + filme_id).textContent;
    const genero = document.getElementById('genero_' + filme_id).textContent;
    const descricao = document.getElementById('descricao_' + filme_id).textContent;

    // Define os dados no modal
    document.getElementById('id_modal').value = filme_id;
    document.getElementById('titulo_modal').value = titulo;
    document.getElementById('ano_lancamento_modal').value = anoDeLancamento;
    document.getElementById('genero_modal').value = genero;
    document.getElementById('descricao_modal').value = descricao;

    // Exibe o modal
    var modal = document.getElementById("modal-edicao");
    modal.style.display = "block";
}

function confirmarEdicaoModal(event) {
    event.preventDefault();
    const filme_id = document.getElementById('id_modal').value;
    const titulo = document.getElementById('titulo_modal').value;
    const anoDeLancamento = document.getElementById('ano_lancamento_modal').value;
    const genero = document.getElementById('genero_modal').value;
    const descricao = document.getElementById('descricao_modal').value;

    const dadosFilme = {
        titulo: titulo,
        ano: anoDeLancamento,
        genero: genero,
        descricao: descricao
    };

    fetch(`/atualizar?id=${filme_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosFilme)
    }).then(response => {
        if (response.ok) {
            alert("Filme atualizado com sucesso!");
            window.location.reload();
        } else {
            response.json().then(data => {
                alert("Erro ao atualizar o filme: " + data.message);
            });
        }
    }).catch(error => {
        console.error('Error:', error);
        alert("Erro ao atualizar o filme.");
    });

    // Esconde o modal
    var modal = document.getElementById("modal-edicao");
    modal.style.display = "none";
}
