# 🎌 INSTRUÇÕES - Baixar Vídeos de Anime

## ⚡ INÍCIO RÁPIDO

### 1️⃣ Abra um NOVO PowerShell
- Feche o PowerShell atual
- Abra um novo PowerShell
- (Isso é necessário para o yt-dlp funcionar)

### 2️⃣ Execute o Script
```powershell
cd d:\tevelisao
.\baixar_anime.ps1
```

### 3️⃣ Aguarde o Download
O script vai baixar automaticamente 5 vídeos de anime:
- Naruto Shippuden
- One Piece
- Attack on Titan
- Demon Slayer
- Jujutsu Kaisen

### 4️⃣ Abra a TV Interativa
Depois do download, abra: `d:\tevelisao\index.html`

---

## 📝 Comandos Manuais (Alternativa)

Se preferir baixar manualmente, abra um NOVO PowerShell e execute:

```powershell
# Navegue para a pasta
cd d:\tevelisao\videos

# Baixe vídeo 1 - Naruto
yt-dlp -f "best[ext=mp4]" -o "video1.mp4" "https://www.youtube.com/watch?v=FBnyDYeKFfE"

# Baixe vídeo 2 - One Piece
yt-dlp -f "best[ext=mp4]" -o "video2.mp4" "https://www.youtube.com/watch?v=2N_qFJ_nLmw"

# Baixe vídeo 3 - Attack on Titan
yt-dlp -f "best[ext=mp4]" -o "video3.mp4" "https://www.youtube.com/watch?v=XMXgHfHxKVM"

# Baixe vídeo 4 - Demon Slayer
yt-dlp -f "best[ext=mp4]" -o "video4.mp4" "https://www.youtube.com/watch?v=19iz5gqYfkA"

# Baixe vídeo 5 - Jujutsu Kaisen
yt-dlp -f "best[ext=mp4]" -o "video5.mp4" "https://www.youtube.com/watch?v=qQw5Jn-7Vxw"
```

---

## ⚠️ IMPORTANTE

### Direitos Autorais
Os vídeos configurados no script são **trailers/clipes oficiais públicos**.

Para episódios completos de anime, você deve:
- ✅ Usar apenas conteúdo com permissão legal
- ✅ Procurar vídeos Creative Commons
- ✅ Usar serviços legais (Crunchyroll, Funimation, etc.)

### Como Encontrar Vídeos Legais
1. No YouTube, pesquise por anime
2. Clique em "Filtros"
3. Selecione "Creative Commons"
4. Use apenas esses vídeos

---

## 🔧 Solução de Problemas

### "yt-dlp não é reconhecido"
**Solução:**
1. Feche o PowerShell
2. Abra um NOVO PowerShell
3. Execute novamente

### "Erro ao baixar vídeo"
**Possíveis causas:**
- Vídeo foi removido do YouTube
- Vídeo está bloqueado na sua região
- Problemas de conexão

**Solução:**
- Tente outro vídeo
- Verifique sua conexão
- Use uma VPN se necessário

### Vídeo não aparece na TV
**Solução:**
1. Verifique se o arquivo está em `d:\tevelisao\videos\`
2. Recarregue a página (F5)
3. Verifique o nome do arquivo no `script.js`

---

## 📚 Mais Informações

- `baixar_anime.ps1` - Script automatizado
- `GUIA_DOWNLOAD_YOUTUBE.md` - Guia completo
- `COMECE_AQUI.md` - Início rápido

---

## 🎯 Resumo

```powershell
# 1. Abra um NOVO PowerShell
# 2. Execute:
cd d:\tevelisao
.\baixar_anime.ps1

# 3. Aguarde o download
# 4. Abra: d:\tevelisao\index.html
# 5. Use o gesto de pinça 🤏 para trocar de canal!
```

**Pronto!** 🎉
