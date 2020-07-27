function generateHtml(document) {
    return `
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/default.min.css">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/github.min.css" />
                <style>
                    .hljs {
                        font-size: 1.0rem !important;
                        line-height: 1.4rem;
                        padding: 0.3rem;
                    }
            
                    #content>h1,
                    h2,
                    h3,
                    h4,
                    h5 {
                        margin-top: 0.1rem;
                        margin-bottom: 0.1rem;
                    }

                    #content > p > img {
                        max-width: 100% !important;
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
                <div class="d-flex justify-content-center w-100">
                    <div class="p-3">
                        <div class="card p-3">
                            <div id="content"></div>
                        </div>
                    </div>
                </div>
              <script>
                marked.setOptions({
                    highlight: function (code) {
                        return hljs.highlightAuto(code).value;
                    }
                });

                const content = document.getElementById("content");

                content.innerHTML = marked(${JSON.stringify(
                    document.markdown
                )});
              </script>
            </body>
        </html>
    `;
}

module.exports = generateHtml;
