# 🔧 SOLUÇÃO: yt-dlp não encontrado

## ❗ O Problema

O yt-dlp foi instalado pelo winget, mas não está disponível nesta sessão do PowerShell porque:
- O PATH do sistema não foi atualizado nesta sessão
- Você precisa fechar e abrir um NOVO PowerShell

## ✅ SOLUÇÃO RÁPIDA (Recomendada)

### Feche este PowerShell e abra um NOVO

1. **Feche** completamente este PowerShell
2. **Abra** um novo PowerShell
3. **Execute**:
   ```powershell
   cd d:\tevelisao
   .\baixar_anime_simples.ps1
   ```

## 🔄 SOLUÇÃO ALTERNATIVA (Se não quiser fechar)

### Baixar yt-dlp direto na pasta do projeto:

```powershell
# 1. Baixe o yt-dlp.exe
cd d:\tevelisao
Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile "yt-dlp.exe"

# 2. Teste se funciona
.\yt-dlp.exe --version

# 3. Baixe os vídeos manualmente
cd videos

# Video 1
..\yt-dlp.exe -f "best[ext=mp4]" -o "video1.mp4" "https://www.youtube.com/watch?v=FBnyDYeKFfE"

# Video 2
..\yt-dlp.exe -f "best[ext=mp4]" -o "video2.mp4" "https://www.youtube.com/watch?v=2N_qFJ_nLmw"

# Video 3
..\yt-dlp.exe -f "best[ext=mp4]" -o "video3.mp4" "https://www.youtube.com/watch?v=XMXgHfHxKVM"

# Video 4
..\yt-dlp.exe -f "best[ext=mp4]" -o "video4.mp4" "https://www.youtube.com/watch?v=19iz5gqYfkA"

# Video 5
..\yt-dlp.exe -f "best[ext=mp4]" -o "video5.mp4" "https://www.youtube.com/watch?v=qQw5Jn-7Vxw"
```

## 🚀 SCRIPT AUTOMÁTICO (Alternativa 2)

Execute este script que baixa o yt-dlp e os vídeos:

```powershell
cd d:\tevelisao
.\baixar_com_ytdlp_local.ps1
```

---

## 📋 Resumo

**Opção 1 (Mais Fácil):**
- Feche e abra um NOVO PowerShell
- Execute: `.\baixar_anime_simples.ps1`

**Opção 2 (Sem fechar):**
- Execute: `.\baixar_com_ytdlp_local.ps1`

**Opção 3 (Manual):**
- Baixe o yt-dlp.exe na pasta
- Use `.\yt-dlp.exe` em vez de `yt-dlp`
