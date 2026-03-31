import { Injectable } from '@angular/core';
import { FeedItem } from '../../shared/models/feed-item.model';

@Injectable({ providedIn: 'root' })
export class FeedDataService {

  private items: FeedItem[] = [
    {
      date: '2026.03.28',
      type: 'writing',
      title: 'Diffusion 模型中的注意力机制：一次拆解',
      link: '/writing/diffusion-attention',
      excerpt: '从 U-Net 的跨注意力层出发，试图弄清楚文本条件是如何在去噪过程中<em>一步步渗入图像结构</em>的。结论比预期复杂。'
    },
    {
      date: '2026.03.20',
      type: 'photo',
      title: '京都，冬末的几个下午',
      link: '/photos/kyoto-winter',
      photos: [
        { type: 'wide' },
        { type: 'sq' },
        { type: 'sq' }
      ],
      photoCount: 14
    },
    {
      date: '2026.03.14',
      type: 'writing',
      title: '关于工具与思维的关系，我改变了看法',
      link: '/writing/tools-and-thinking',
      excerpt: '以前觉得好工具应该透明，用着感觉不到它。现在觉得这个标准<em>本身就是问题</em>——工具应该有摩擦，摩擦才是思维发生的地方。'
    },
    {
      date: '2026.03.07',
      type: 'ai',
      title: '递归美学与中文诗歌结构',
      link: '/ai/recursive-aesthetics',
      aiExchange: [
        { role: 'q', text: '《春江花月夜》里的意象是不是有某种递归结构？' },
        { role: 'a', text: '有意思——"江畔何人初见月"到"何处相思明月楼"，确实像是在同一个意象上不断折叠……' }
      ]
    },
    {
      date: '2026.02.27',
      type: 'writing',
      title: 'Angular Signal 的设计哲学与实践记录',
      link: '/writing/angular-signal',
      excerpt: 'Signal 不是新概念，但 Angular 的实现方式有它自己的立场。这篇是用了三个月之后的<em>真实使用感受</em>，不是文档翻译。'
    },
    {
      date: '2026.02.18',
      type: 'photo',
      title: '上海，某个平常的周末',
      link: '/photos/shanghai-weekend',
      photos: [
        { type: 'sq' },
        { type: 'sq' },
        { type: 'sq' },
        { type: 'sq' }
      ],
      photoCount: 6
    },
    {
      date: '2026.02.09',
      type: 'ai',
      title: 'RAG 系统里语义检索的边界问题',
      link: '/ai/rag-semantic-retrieval',
      aiExchange: [
        { role: 'q', text: '向量空间里的距离，真的等于语义距离吗？' },
        { role: 'a', text: '不完全等于。余弦相似度度量的是方向而非含义，两个意思相反的句子在某些嵌入空间里可能很近……' }
      ]
    },
    {
      date: '2026.01.31',
      type: 'writing',
      title: '用 CSS Grid 实现非对称排版布局',
      link: '/writing/css-grid-asymmetric',
      excerpt: '对称是默认值，不对称需要理由。这篇记录了<em>几个有说服力的比例关系</em>，以及它们背后的视觉逻辑。'
    }
  ];

  getAllItems(): FeedItem[] {
    return this.items;
  }

  getItemsByType(type: 'writing' | 'photo' | 'ai'): FeedItem[] {
    return this.items.filter(item => item.type === type);
  }
}
