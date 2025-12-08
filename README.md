# 📺 TV Interativa com Controle por Gestos

Sistema interativo que usa a câmera do computador e reconhecimento de gestos das mãos para controlar uma TV virtual.

## 🎯 Funcionalidades

- **Câmera ao Vivo**: Visualize-se dentro da moldura da TV
- **Controle por Gestos**: Use o gesto de pinça (aproximar polegar e indicador) para mudar de canal
- **Vídeos MP4 Locais**: Use seus próprios vídeos sem preocupações com licenças
- **Player Web**: Suporte para players customizados via iframe
- **Interface Premium**: Design moderno com gradientes e animações suaves
- **Detecção de Mãos em Tempo Real**: Visualização dos pontos da mão detectados

## 🚀 Como Usar

### 1. Adicione Seus Vídeos
```
Coloque arquivos MP4 na pasta: d:\tevelisao\videos\
Nomeie como: video1.mp4, video2.mp4, etc.
```

### 2. Abra o Sistema
```
Abra o arquivo index.html em um navegador moderno
```

### 3. Permita a Câmera
```
Aceite a solicitação de acesso à câmera
```

### 4. Use os Gestos
```
🤏 Gesto de Pinça: Aproxime polegar e indicador para trocar de canal
👆 Clique: Selecione um canal específico na lista
⏻ Botão Power: Liga/desliga a TV
```

## 📋 Requisitos

- Navegador moderno (Chrome, Edge, ou Firefox)
- Webcam conectada
- Conexão com a internet (para carregar MediaPipe)
- Arquivos MP4 para os canais de vídeo

## 📂 Estrutura do Projeto

```
tevelisao/
├── index.html              # Página principal
├── style.css               # Estilos da aplicação
├── script.js               # Lógica e detecção de gestos
├── videos/                 # Pasta para seus vídeos MP4
│   ├── video1.mp4
│   ├── video2.mp4
│   └── ...
├── README.md               # Este arquivo
├── GUIA_VIDEOS_MP4.md      # Guia completo de vídeos
└── CONFIGURACAO_CANAIS.md  # Guia de configuração
```

## 🎬 Formatos de Vídeo Suportados

- ✅ **MP4 (H.264)** - Recomendado
- ✅ WebM
- ✅ OGG

## ⚙️ Configuração de Canais

O sistema está configurado com **10 canais**:

| Canal | Tipo | Descrição |
|-------|------|-----------|
| 1 | Câmera | Webcam ao vivo |
| 2 | Web | Player customizado |
| 3-10 | Vídeo | Arquivos MP4 locais |

Para personalizar, edite o array `this.channels` no arquivo `script.js`.

## 🔧 Personalização

### Ajustar Sensibilidade do Gesto
```javascript
// Em script.js, linha ~242
const pinchThreshold = 0.05;  // Diminua para mais sensível
```

### Ajustar Tempo Entre Mudanças
```javascript
// Em script.js, linha ~22
this.pinchCooldown = 1000;  // Tempo em milissegundos
```

### Adicionar Mais Canais
```javascript
// Em script.js, adicione no array this.channels
{
    name: "Meu Canal",
    description: "Descrição",
    type: "video",
    url: "videos/meu-video.mp4"
}
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização premium com gradientes e animações
- **JavaScript ES6+**: Lógica da aplicação
- **MediaPipe Hands**: Detecção de mãos e gestos em tempo real
- **WebRTC**: Acesso à câmera do usuário

## 🐛 Solução de Problemas

**Câmera não funciona:**
- Verifique se você permitiu o acesso à câmera
- Certifique-se de que nenhum outro aplicativo está usando a câmera
- Tente usar HTTPS ou localhost

**Vídeos não carregam:**
- Verifique se os arquivos estão na pasta `videos/`
- Confirme que os nomes dos arquivos estão corretos
- Use formatos compatíveis (MP4 H.264 recomendado)
- Teste se o vídeo abre diretamente no navegador

**Gestos não são detectados:**
- Certifique-se de que há boa iluminação
- Mantenha a mão visível para a câmera
- Ajuste a sensibilidade do gesto no código

## 📚 Documentação Adicional

- **[GUIA_VIDEOS_MP4.md](GUIA_VIDEOS_MP4.md)** - Guia completo sobre vídeos MP4
- **[CONFIGURACAO_CANAIS.md](CONFIGURACAO_CANAIS.md)** - Como configurar canais
- **[videos/README.md](videos/README.md)** - Instruções da pasta de vídeos

## ⚠️ Notas Importantes

### Direitos Autorais
Use apenas vídeos que você tem permissão para usar:
- Vídeos próprios
- Vídeos com licença Creative Commons
- Vídeos de domínio público

### Performance
- Use vídeos em 720p para melhor equilíbrio
- Evite vídeos muito grandes (máx. 200 MB recomendado)
- Comprima os vídeos se necessário

## 🎨 Recursos Visuais

- Gradientes vibrantes (roxo/azul)
- Animações suaves
- Efeitos de glassmorfismo
- Design responsivo
- Tipografia moderna (Google Fonts - Inter)

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

## 🤝 Contribuições

Sinta-se à vontade para melhorar este projeto!

---

**Desenvolvido com ❤️ usando MediaPipe e JavaScript**

**Aproveite sua TV Interativa!** 🎉
