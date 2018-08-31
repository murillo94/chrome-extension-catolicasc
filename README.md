# chrome-extension-catolicasc
Uma extensão que centraliza as principais informações do aluno na Univ. Católica de Santa Catarina - Joinville

## O que é isso?

Essa extensão é uma aplicação cross-browser escrita em JavaScript que ajuda você (aluno) a centralizar todas as informações da Univ. Católica de Santa Catarina - Joinville. O objetivo da extensão é fazer que você não tenha mais que ficar abrindo várias páginas, informando login, para assim chegar nas informações que você necessita.

Por exemplo, com essa extensão você poder ver tudo em um só lugar a sua média total das matérias cursadas, frequência, boletos e etc.

## Como usar?

### Google Chrome

- Abrir a url _chrome://extensions_
- Habilitar modo desenvolvedor
- Clicar em "carregar sem compactação" e enviar a pasta

> https://developer.chrome.com/extensions/getstarted#manifest

### Mozilla Firefox

- Abrir a url _about:debugging_
- Clicar em "carregar temporário add-on" e enviar a pasta

> https://developer.mozilla.org/en-US/docs/Tools/about:debugging

## Importante

Toda as requisições HTTP feitas até o momento na aplicação tem como resposta "content-type: text/html", sendo assim é necessário manipular o DOM obtido para extrair as informações necessárias.

## TODO

- Adicionar aba/lógica para buscar notas do semestre atual.
- Adicionar aba/lógica para buscar notícias/calendário da faculdade.
- Adicionar lógica para logar apenas uma vez (guardar em storage), para que quando entrar na aplicação reutilizar o storage.
- Fazer novo estilo para aba de tarefas.
- Fazer novo estilo para a aba de boletos.
- Adicionar imagens da aplicação no README.md.