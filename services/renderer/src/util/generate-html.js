function generateHtml(document) {
    return `
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/default.min.css">
                <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/github.min.css" />
                <style>
                    .hljs {
                        font-size: 1.0rem !important;
                        line-height: 1.4rem;
                        padding: 0.3rem;
                    }
            
                    pre {
                        border: 1px solid #ccc;
                        overflow: hidden;
                        padding: 0.3rem;
                        background-color: #F8F8F8;
                    }
            
                    code {
                        font-weight: 100;
                    }
            
                    blockquote {
                        color: #666;
                        margin: 0;
                        padding-left: 3em;
                        border-left: 0.5em #eee solid;
                    }
            
                    tr {
                        border-top: 1px solid #c6cbd1;
                        background: #fff;
                    }
            
                    th,
                    td {
                        padding: 6px 13px;
                        border: 1px solid #dfe2e5;
                    }
            
                    table tr:nth-child(2n) {
                        background: #f6f8fa;
                    }
            </style>
            </head>
            <body>
              <div id="marked"></div>
              <script>
                marked.setOptions({
                    highlight: function (code) {
                        return hljs.highlightAuto(code).value;
                    }
                });

                const content = document.getElementById("marked");

                content.innerHTML = marked(${JSON.stringify(
                    document.markdown
                )});
              </script>
            </body>
        </html>
    `;
}

module.exports = generateHtml;
