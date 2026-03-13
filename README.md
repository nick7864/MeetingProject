# 專案立會資訊系統 - React 前端原型

## 專案說明

這是一個基於 React + TypeScript + Material-UI 的前端原型，用於展示「專案立會資訊系統」的核心功能。

## 功能特色

### 1. 專案總覽
- 專案列表與搜尋
- 基準線 vs 執行線狀態比較
- 進度條視覺化
- 紅燈警示標記

### 2. 紅燈警示管理
- 紅燈狀態統計儀表板
- 7/14/30 天自動升級通知
- 延誤專案追蹤

### 3. 文件版本控制
- 拖放上傳 PPTX/XLSX 檔案
- 自動解析關鍵欄位
- 變更差異比對與警示
- 版本歷史時間軸

## 技術棧

- **前端框架**: React 18
- **開發語言**: TypeScript
- **UI 框架**: Material-UI v5
- **建置工具**: Vite
- **路由**: React Router v6

## 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

瀏覽器會自動開啟 `http://localhost:3000`

### 建置生產版本

```bash
npm run build
```

## 專案結構

```
Prototype/
├── public/              # 靜態資源
├── src/
│   ├── components/      # React 元件
│   │   ├── DocumentUpload/   # 文件上傳元件
│   │   ├── ProjectList/      # 專案列表元件
│   │   ├── RedLight/         # 紅燈儀表板元件
│   │   └── VersionHistory/   # 版本歷史元件
│   ├── mock/           # 假資料
│   ├── styles/         # 主題設定
│   ├── types/          # TypeScript 型別定義
│   ├── App.tsx         # 主應用程式
│   └── main.tsx        # 入口檔案
├── index.html          # HTML 模板
├── package.json        # 專案配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 核心功能展示

### 1. 雙軌時序模型

系統同時維護「基準線」與「執行線」兩套時間軸：
- **基準線**: 唯讀，用於衡量實際執行偏差
- **執行線**: 可編輯，每次變更都會記錄

### 2. 變更差異自動比對

上傳 PPTX/XLSX 時，系統會：
1. 自動解析關鍵欄位（預計完成日、里程碑日期等）
2. 比對與上一版本的差異
3. 強制標示延誤項目（紅色警示）

### 3. 紅燈自動升級機制

延誤專案會自動觸發升級通知：
- 超過 7 天 → 通知直屬主管
- 超過 14 天 → 通知處級主管
- 超過 30 天 → 列入處長週報

## 注意事項

- 此為原型版本，使用假資料展示
- 實際專案需要後端 API 支援
- 檔案上傳功能為模擬展示

## 相關文件

- [功能需求規格書 (FRD v0.1)](../功能需求規格書_FRD_v0.1.md)
- [專案處需求分析](../專案處需求分析.md)

## Docker 部署

### 建置 Docker 映像

```bash
# 建置映像
docker build -t prototype-spa:local .

# 或使用 docker compose
docker compose build
```

### 執行容器

```bash
# 直接執行
docker run --rm -p 8080:80 prototype-spa:local

# 或使用 docker compose
docker compose up -d
```

### 訪問應用程式

打開瀏覽器訪問 http://localhost:8080

### 驗證 SPA 路由

```bash
# 直接訪問深層路由應該正常顯示頁面
curl -I http://localhost:8080/projects/1
```

### 停止容器

```bash
# 直接執行
docker stop <container_id>

# 或使用 docker compose
docker compose down
```

### Docker 配置說明

- **Dockerfile**: 多階段構建 (Node.js Alpine → Nginx Alpine)
- **nginx/default.conf**: Nginx 配置，支援 SPA 深層路由
- **docker-compose.yml**: 簡化管理，映射 port 8080:80
- **.dockerignore**: 排除不必要的檔案，加快構建速度

### SPA 路由

此應用程式使用 React Router v6，支援以下路由：
- `/` - 文件管理頁面
- `/documents` - 文件管理頁面
- `/search` - 文件搜尋頁面
- `/projects/:projectId` - 專案詳情 (動態路由)
- `/red-lights` - 紅燈警示儀表板

Nginx 配置了 `try_files $uri $uri/ /index.html` 確保所有路由都能正確載入 SPA 應用程式。
