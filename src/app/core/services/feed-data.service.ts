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
      excerpt: '从 U-Net 的跨注意力层出发，试图弄清楚文本条件是如何在去噪过程中<em>一步步渗入图像结构</em>的。结论比预期复杂。',
      content: `
        <p>在讨论扩散模型（Diffusion Models）时，绝大多数讲解都会把重点放在“加噪”和“去噪”的马尔可夫链上。这很好理解，因为它是理论的基石。然而，真正在这一波生成式 AI 浪潮中决定生成图像“长什么样”的，其实是网络结构内部那些隐秘的注意力机制（Attention）。</p>
        <p>确切地说，是潜域（Latent Space）中的 U-Net 所包含的**交叉注意力（Cross-Attention）**发挥了关键作用。</p>
        <blockquote>
          “注意力机制不仅仅是在寻找特征，它是在空间中锚定概念。”
        </blockquote>
        <p>如果我们把 U-Net 切开，观察其下采样和上采样块，会发现文本提示词（Prompt）经过 CLIP 文本编码器后，提取出的 embedding 并不是简单地“叠加”在图像特征上。而是通过一个查询（Query）和键值（Key-Value）的机制，让图像在每一帧去噪时去“询问”文本参数：“这里的像素应该往哪个概念靠拢？”</p>
        <p>这个过程在空间和时间尺度上都在发生。早期的降噪步骤决定了大的构图和色调，而晚期的步骤则在雕琢细节。理解了这一层，我们就明白了为什么有些提示词总是起冲突，而有些词的权重修改会引发蝴蝶效应。</p>
      `
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
      photoCount: 14,
      fullPhotos: [
        { src: 'assets/mock/kyoto-1.jpg', alt: '鸭川边的枯树', gridClass: 'span-2' },
        { src: 'assets/mock/kyoto-2.jpg', alt: '京都小巷', gridClass: 'span-1' },
        { src: 'assets/mock/kyoto-3.jpg', alt: '电车驶过', gridClass: 'span-1' },
        { src: 'assets/mock/kyoto-4.jpg', alt: '咖啡馆一角', gridClass: 'span-2' }
      ]
    },
    {
      date: '2026.03.14',
      type: 'writing',
      title: '关于工具与思维的关系，我改变了看法',
      link: '/writing/tools-and-thinking',
      excerpt: '以前觉得好工具应该透明，用着感觉不到它。现在觉得这个标准<em>本身就是问题</em>——工具应该有摩擦，摩擦才是思维发生的地方。',
      content: '<p>这篇是关于工具反作用于人的思考。文本待补充。</p>'
    },
    {
      date: '2026.03.07',
      type: 'ai',
      title: '递归美学与中文诗歌结构',
      link: '/ai/recursive-aesthetics',
      aiExchange: [
        { role: 'q', text: '《春江花月夜》里的意象是不是有某种递归结构？' },
        { role: 'a', text: '有意思——"江畔何人初见月"到"何处相思明月楼"，确实像是在同一个意象上不断折叠……' }
      ],
      fullExchange: [
        { role: 'q', text: '《春江花月夜》里的意象是不是有某种递归结构？' },
        { role: 'a', text: '非常有意思的观察。如果我们把“递归”理解为一种自相似结构在不同层级的嵌套，《春江花月夜》确实展现出了强烈的递归美学。诗中“月”是一个超级意象，它不断调用自身去定义其他意象：春江、花林、明镜、离人。' },
        { role: 'q', text: '这就解释了为什么这首诗读起来有一种“迷宫感”。张若虚是不是在用这种套叠来构建一种宇宙观？' },
        { role: 'a', text: '是的。在“江畔何人初见月？江月何年初照人？”这一句中，时间（初见、初照）与空间（江畔、江月）互为函数，互相嵌套。这突破了线性时间的叙事，创造出一种时间上的孤立系统，也就是你所说的“迷宫感”。' }
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
      photoCount: 6,
      fullPhotos: [
        { src: 'assets/mock/sh-1.jpg', alt: '梧桐树下的路标', gridClass: 'span-1' },
        { src: 'assets/mock/sh-2.jpg', alt: '老洋房的窗台', gridClass: 'span-2' },
        { src: 'assets/mock/sh-3.jpg', alt: '雨后的淮海路', gridClass: 'span-wide' }
      ]
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

  getItemByLink(link: string): FeedItem | undefined {
    return this.items.find(item => item.link === link);
  }
}
