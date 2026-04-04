# 内容数据结构规范

## 技术文章

`data/articles.json` — 索引文件：
```json
[
  {
    "date": "2024-03-15",
    "title": "文章标题",
    "file": "assets/content/articles/my-article.md"
  }
]
```

Markdown 文件无需 frontmatter，直接正文内容，渲染到页面即可。

---

## 照片

`data/photos.json` — 索引文件：
```json
[
  {
    "id": "travel-japan-2024",
    "title": "日本之行",
    "date": "2024-03-15",
    "cover": "assets/photos/travel-japan-2024/001.jpg",
    "photos": [
      { "file": "assets/photos/travel-japan-2024/001.jpg", "caption": "东京塔" },
      { "file": "assets/photos/travel-japan-2024/002.jpg", "caption": "" }
    ]
  }
]
```

---

## AI 对话

`data/ai-chats.json` — 索引文件：
```json
[
  {
    "id": "chat-001",
    "title": "聊聊 Angular 信号机制",
    "date": "2024-03-15",
    "file": "assets/content/ai-chats/chat-001.json"
  }
]
```

`assets/content/ai-chats/chat-001.json` — 对话数据：
```json
{
  "id": "chat-001",
  "title": "聊聊 Angular 信号机制",
  "date": "2024-03-15",
  "messages": [
    { "role": "user", "content": "Angular 的 signal 和 RxJS 有什么区别？" },
    { "role": "assistant", "content": "Signal 是同步的响应式原语，适合组件内状态..." }
  ]
}
```