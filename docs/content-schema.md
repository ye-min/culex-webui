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
    "groups": [
      {
        "type": "column",
        "photos": [
          { "file": "assets/photos/travel-japan-2024/001.jpg", "caption": "东京塔" },
          { "file": "assets/photos/travel-japan-2024/002.jpg", "caption": "" }
        ]
      },
      {
        "type": "row",
        "photos": [
          { "file": "assets/photos/travel-japan-2024/003.jpg", "caption": "富士山全景" }
        ]
      }
    ]
  }
]
```

- `type: "column"` — 两列流布局，宽高比 > 2 的图片自动横跨两列
- `type: "row"` — 单列全宽，图片按原始比例铺满容器
- 组与组之间自动插入分隔线
- 每张照片的顺序由 JSON 决定，自行调整实现最佳视觉效果

---

## AI 对话

`data/ai-chats.json` — 索引文件：
```json
[
  {
    "id": "chat-001",
    "title": "聊聊 Angular 信号机制",
    "date": "2024-03-15",
    "model": "Claude",
    "version": "Sonnet 4.5",
    "file": "assets/content/ai-chats/chat-001.json"
  }
]
```

- `model`（可选）：大模型名称，如 `"Claude"`、`"GPT"`、`"Gemini"`
- `version`（可选）：具体版本，如 `"Sonnet 4.5"`、`"4o"`、`"2.0 Flash"`

`assets/content/ai-chats/chat-001.json` — 对话数据：
```json
{
  "id": "chat-001",
  "title": "聊聊 Angular 信号机制",
  "date": "2024-03-15",
  "model": "Claude",
  "version": "Sonnet 4.5",
  "messages": [
    { "role": "user", "content": "Angular 的 signal 和 RxJS 有什么区别？" },
    { "role": "assistant", "content": "Signal 是同步的响应式原语，适合组件内状态..." }
  ]
}
```

---

## 导航书签

`data/bookmarks.json` — 索引文件：
```json
[
  {
    "category": "分类名",
    "links": [
      { "title": "网站名", "url": "https://example.com", "desc": "来源或简介" }
    ]
  }
]
```

- 每个对象为一个分类，页面按分类顺序渲染
- 新增分类直接追加对象；新增链接在对应分类的 `links` 数组中追加即可