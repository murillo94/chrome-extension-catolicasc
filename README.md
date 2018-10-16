<p align="center">
    <img alt="Logo da da Univ. Católica de Santa Catarina" src="./src/img/icon.png" height="80" width="80" />
    <h3 align="center">
        chrome-extension-catolicasc
    </h3>
    <p align="center">
       Centralize as principais informações do seu curso em um lugar apenas.
    </p>
</p>


![](https://github.com/murillo94/chrome-extension-catolicasc/blob/master/src/img/demo/banner.png)

---

Essa aplicação é uma extensão cross-browser escrita em JavaScript que ajuda você (aluno) a centralizar todas as informações da Univ. Católica de Santa Catarina - Joinville. O objetivo da extensão é fazer que você não tenha mais que ficar abrindo várias páginas, informando login, para assim chegar nas informações que você necessita.

## Características

- Informações do curso (média geral, frequência, total de matérias aprovadas, reprovadas e cursadas)
- Boletos (pagamentos pendentes e realizados)
- Tarefas
- Calendário acadêmico
- Notas do período

## Como usar

### Google Chrome

- Abrir a url _chrome://extensions_
- Habilitar modo desenvolvedor
- Clicar em "carregar sem compactação" e envie o manifest.json

> https://developer.chrome.com/extensions/getstarted#manifest

### Mozilla Firefox

- Abrir a url _about:debugging_
- Clicar em "carregar temporário add-on" e envie o manifest.json

> https://developer.mozilla.org/en-US/docs/Tools/about:debugging

## Importante

Todas as requisições HTTP feitas até o momento na aplicação, exceto as notas, recebem como resposta "content-type: text/html", sendo assim é necessário manipular o DOM obtido para extrair as informações necessárias.

## TODO

- Adicionar lógica para logar apenas uma vez (guardar em storage), para que quando entrar na aplicação reutilizar o storage.

## License

MIT © [Murillo de Miranda Pereira](https://github.com/murillo94)