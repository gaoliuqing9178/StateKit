/**
 * StateKit docs Vite 环境类型声明
 * 1. 作用：引入 Vite 客户端类型，让 TypeScript 能识别 Vite 专有的导入语法和环境变量
 * 2. 这个文件不包含业务逻辑，只是类型声明入口
 * 3. 维护要点：docs 站不依赖 import.meta.env 业务变量，如果将来有需要在这里补充声明
 */

/// <reference types="vite/client" />
