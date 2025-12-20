#!/bin/bash
set -e

echo "🔨 Iniciando build..."

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
npm install

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd client
npm install

# Build do React
echo "🔨 Compilando React..."
CI=false GENERATE_SOURCEMAP=false npm run build

# Verificar se o build foi criado
cd ..
if [ -d "client/build" ]; then
    echo "✅ Build criado com sucesso!"
    echo "📂 Conteúdo do build:"
    ls -la client/build/ | head -10
    if [ -f "client/build/index.html" ]; then
        echo "✅ index.html encontrado!"
    else
        echo "❌ index.html NÃO encontrado!"
        exit 1
    fi
else
    echo "❌ Build NÃO foi criado!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
