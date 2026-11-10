# Auditoria de imagens

## Resultado
- 29 imagens únicas exibidas: 57.268.754 bytes antes; 8.997.902 bytes somando a maior versão otimizada de cada imagem (redução de 84,3%).
- Somando a menor versão de cada imagem: 1.917.558 bytes. O navegador escolhe uma versão por imagem, não todas as 75 variantes.
- Imagem principal: 2.721.230 bytes antes; 57.544 bytes a 400px, 177.798 bytes a 800px, 364.904 bytes a 1280px.
- Em celular 384×727, conexão simulada de 4G: somente a imagem principal foi baixada na abertura, 57.544 bytes com DPR 1 e 177.798 bytes com DPR 2, sem versões duplicadas. Valores medidos pelos corpos das respostas; imagens descobertas pelo HTML não aparecem sempre como initiatorType img no navegador.

## Otimizações
- Cópias WebP qualidade 92 das 17 prévias de carrossel, mockup, visão geral, quatro bônus, cinco fotos e selo.
- Dimensões responsiveis, srcset/sizes, proporções originais reservadas, prioridade alta exclusiva da imagem principal.
- Imagens abaixo da dobra recebem URLs apenas próximas à área visível e usam lazy loading.
- Carrosséis mantêm quantidade, geometria, direção e intervalo originais. URLs carregam apenas quando a faixa se aproxima da tela e para slides visíveis/vizinhos; cópias repetidas compartilham URLs e cache.
- Nenhuma biblioteca adicionada. Originais, textos, aparência, checkout e script LowTrack preservados.

## Validação e limites
- 63 elementos de imagem decodificados com sucesso em celular e desktop; ambos os carrosséis em movimento; oferta intermediária e seus links de compra conferidos; nenhuma exceção de JavaScript.
- Capturas visuais conferidas para imagem principal, carrosséis e bônus. Compressão é com perdas; preservada alta qualidade, sem garantia de igualdade pixel a pixel.
- Não foi realizado pagamento nem validado recebimento de eventos no painel LowTrack; integração não foi alterada.
- Dados reais anteriores insuficientes para afirmar ganho de tempo: LCP p75 3.339ms em 10 leituras, acima da referência de 2.500ms; FCP p75 2.740ms em 17 leituras, referência 1.800ms; INP p75 128ms em 2 leituras, referência 200ms. CLS p75 0 em 89 leituras, referência 0,1. Novas medições de visitantes dependem da publicação e de tráfego posterior.
- O total não inclui arquivos de impressão/download: esses não foram alterados, nem imagens removidas.