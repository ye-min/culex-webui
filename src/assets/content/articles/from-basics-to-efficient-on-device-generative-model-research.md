# 从基础到研究：端侧高效生成模型学习路线

> 面向已有一般本科数学与编程基础、希望研究 Efficient AI × Diffusion/Flow × 端侧部署的学习者。建议以 **6 个月打通入门闭环** 为目标；独立提出可靠论文课题通常还需要后续数月的阅读、复现和实验。每周约 10–15 小时；时间不足时延长周期，保持阶段顺序。更新：2026 年 9 月。

## 一、先确定研究问题

端侧生成模型的关键是，在给定设备、质量要求和功耗条件下，缩短端到端延迟、减少峰值内存和能耗。研究对象可包括图像生成与编辑、语音生成、机器人动作生成，以及探索中的非自回归语言生成；它们的成熟度、评测和硬件要求并不相同。建议第一条实践主线选**小规模图像生成**，因为公开数据和复现实验更容易获得；随后迁移到目标设备和具体模态。

对多步模型，可把计算成本粗略拆成“单步成本 × 采样步数”，但真实延迟还受解码器、数据搬运、算子支持和设备调度影响。参数减半、位宽减半并不保证延迟减半；减少采样步数也可能损失质量。所有方法都要在固定质量目标下测设备实际耗时。

### 学习原则

- **主线**：数学直觉 → PyTorch 与神经网络 → Transformer/ViT → DDPM → 潜空间扩散/DiT → Flow Matching → 压缩与设备测量。
- **边做边学**：每阶段留下可运行代码、实验记录和一页总结。经典论文用于解释和验证问题，不要求先读完所有理论。
- **先选设备再谈端侧**：手机、笔记本、车载 SoC 和开发板的内存、算子和功耗约束差异很大；没有目标设备时，称实验为“效率原型”，暂不称“端侧部署结果”。

## 二、六个月阶段安排

| 阶段 | 时间 | 重点 | 完成标志 |
|---|---|---|---|
| 1. 数学与工具 | 第 1 月 | 线代、概率、微分、优化；NumPy/PyTorch | 手推线性回归梯度；独立训练一个 MNIST 分类器 |
| 2. 深度学习结构 | 第 2 月 | MLP、CNN、残差、归一化、Autoencoder、VAE | 比较普通自编码器和 VAE 的重建及采样 |
| 3. Attention 与视觉 Transformer | 第 3 月 | Q/K/V、多头注意力、位置编码、ViT | 实现小型 attention；训练或微调一个小 ViT |
| 4. 扩散入门 | 第 4 月 | DDPM、噪声调度、训练目标、采样；DDIM | 在 MNIST 或小图数据上训练 DDPM，比较采样步数 |
| 5. 现代生成路线 | 第 5 月 | 潜空间扩散、DiT、ODE/Flow Matching | 跑通小型 latent/patch 模型；实现二维 toy flow |
| 6. 高效化与评测 | 第 6 月 | PTQ/QAT、蒸馏、token 优化、部署 | 建立质量—延迟—内存对照表和可复现脚本 |

这是建议节奏，不是资格考试。已有研究经验者可以先做诊断项目，再跳过熟悉的部分；概率与 Transformer 薄弱者应多留两到四周。

## 三、逐阶段学什么、怎么练

### 阶段 1：数学与 PyTorch

**线代**：向量、矩阵乘法、基与投影、特征分解和 SVD；理解 $QK^\top$ 是相似度矩阵，低秩近似为何可能节省存储。**概率**：条件概率、期望/方差、高斯分布、最大似然、KL 散度；会说明“从分布采样”和“最小化噪声预测误差”的区别。**微分优化**：偏导、链式法则、梯度下降、Adam，理解自动求导结果如何产生。不需要先完成整本测度论或随机微积分。

实践 A：用 NumPy 实现线性回归和手写梯度，与 PyTorch autograd 比较。实践 B：完整训练 MNIST 分类器，固定随机种子，记录训练/验证损失、模型大小、单批推理时间。验收：能解释张量维度、反向传播、训练和推理的区别。

参考：[Strang《Introduction to Linear Algebra》及 MIT 18.06](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/)；[《Dive into Deep Learning / 动手学深度学习》](https://d2l.ai/)；[PyTorch 官方入门](https://docs.pytorch.org/tutorials/beginner/basics/intro.html)。

### 阶段 2：神经网络与潜变量

学 MLP、卷积、残差、LayerNorm/BatchNorm、过拟合和正则化。先实现小 CNN，再实现 Autoencoder 和 VAE。VAE 的编码器输出潜变量分布，练习重参数化和 KL 项；**潜空间扩散常用预训练自编码器压缩图像，但不要求每个扩散模型都先学会或使用 VAE**。

实践：在同一图像数据上比较 CNN 分类、AE 重建和 VAE 重建/采样；画出重建图与误差，记录潜变量维度变化对结果的影响。验收：能区分重建损失、潜变量正则化和生成采样。

参考：[Goodfellow、Bengio、Courville《Deep Learning》](https://www.deeplearningbook.org/)（按需查阅）；[VAE 原论文](https://arxiv.org/abs/1312.6114)；D2L 的 CNN 与优化章节。

### 阶段 3：Transformer、ViT 与注意力计算

推导缩放点积注意力 $\mathrm{softmax}(QK^\top/\sqrt{d_k})V$ 的张量形状和代价；学多头注意力、位置编码、残差、LayerNorm、patch embedding、条件输入。区分语言模型里的因果 mask/KV cache 和图像 DiT 常用的双向 patch 处理：**KV cache 不是所有扩散模型的通用优化**。

实践：不依赖高层模型封装实现 SelfAttention，并用单元尺寸检查验证输出形状；在小数据集上做小型 ViT 或微调已有 ViT。用 profiler 比较序列长度改变时的耗时与显存，不把理论 FLOPs 当成真实延迟。验收：能解释 patch 数、注意力成本和内存占用的关系。

参考：[《Attention Is All You Need》](https://arxiv.org/abs/1706.03762)；[《An Image is Worth 16x16 Words》](https://arxiv.org/abs/2010.11929)；D2L Transformer 章节。

### 阶段 4：DDPM 与第一次生成实验

先掌握前向加噪 $q(x_t\mid x_0)$、噪声调度、训练噪声预测器和从噪声反向采样。再比较 DDPM 和 DDIM 的采样方式。第一遍可以暂缓完整 ELBO 与反向 SDE 证明，但应理解模型预测的是何种目标、损失怎样构造、为什么可以直接采样某个 $x_t$。

实践：在 MNIST/简单小图上训练小 U-Net DDPM；固定模型和测试随机种子，比较 100、50、20、10 步的生成样例、总耗时与质量。若计算资源有限，先用二维高斯混合分布或 32×32 图像。验收：能解释步数减少为什么可能加速，也可能恶化质量；保留配置、权重和生成样例。

参考：[《Denoising Diffusion Probabilistic Models》](https://arxiv.org/abs/2006.11239)；[《Denoising Diffusion Implicit Models》](https://arxiv.org/abs/2010.02502)；[Hugging Face Diffusion Models Course](https://huggingface.co/learn/diffusion-course/en/unit0/1)。

### 阶段 5：潜空间、DiT、Flow

先读潜空间扩散：自编码器编码/解码与扩散主干各承担什么计算；再读 DiT：把 latent 切成 patch 后，用 Transformer 作为去噪主干。理解采样器、网络架构和训练目标是三个不同层次。

随后补 ODE 的向量场、数值积分和连续流的基础，再看 Flow Matching。它与扩散存在统一视角和交叠的概率路径，**不能简单画成“Diffusion 被 Flow Matching 取代”的单线进化史**。SDE/score matching 可在需要阅读理论论文时继续深入。

实践 A：在二维两月牙或高斯混合数据上训练速度场，画不同时间的轨迹。实践 B：在相同数据分辨率与预算下，对小 U-Net 和小 DiT 测参数、每步耗时及采样质量。验收：能解释改变主干、改变路径、改变采样器分别影响什么。

参考：[《High-Resolution Image Synthesis with Latent Diffusion Models》](https://arxiv.org/abs/2112.10752)；[《Scalable Diffusion Models with Transformers》](https://arxiv.org/abs/2212.09748)；[《Flow Matching for Generative Modeling》](https://arxiv.org/abs/2210.02747)；[《Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow》](https://arxiv.org/abs/2209.03003)。

### 阶段 6：Efficient AI 与目标设备

从三个独立维度做对照：**单步算得更省**（量化、剪枝、注意力/patch 优化）；**所需步数更少**（采样器、少步蒸馏）；**真实设备执行更好**（支持的算子、内存布局、编译和硬件调度）。先做简单 PTQ 的 FP32/FP16/INT8 比较，再按设备支持尝试 INT4/QAT。低位权重能省文件体积，但若运行时发生反量化或算子回退，可能没有加速。

实践：挑一个已复现的小模型，固定输入、提示词/类别和随机种子，做一项可控改动；记录模型文件大小、峰值内存、首张图和后续图延迟、采样步数、质量样例。若做量化，验证目标运行时的算子覆盖和实际执行精度。若做蒸馏，先复现教师与学生基线，再比较相同生成质量下的总成本。不要一次叠加四种技巧，否则无法归因。

参考：[PyTorch 量化文档入口](https://docs.pytorch.org/docs/stable/quantization.html)；[ONNX Runtime 性能与量化文档](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)；[Hinton 等《Distilling the Knowledge in a Neural Network》](https://arxiv.org/abs/1503.02531)；[《Progressive Distillation for Fast Sampling of Diffusion Models》](https://arxiv.org/abs/2202.00512)。具体部署框架应按目标芯片与运行时选用，接口和支持范围以当时官方文档为准。

## 四、研究级实验怎么设计

1. **明确任务和设备**：例如“在某手机 NPU 上生成 256×256 类别条件图像，峰值内存不超过 X，质量至少达到基线 Y”。没有设备时先在固定桌面 GPU/CPU 上比较方法，并如实报告。
2. **建立基线**：固定数据划分、权重、输入、采样种子、步数和运行环境。首先重复三次以上延迟测量，排除首次编译与预热影响。
3. **一次改一个变量**：如 INT8、20→4 步或 patch 合并；同时报告质量和耗时，避免只报理论 FLOPs。
4. **衡量完整推理链**：包含文本编码/条件处理、去噪迭代、自编码器解码和必要的数据传输；另报告主干耗时，便于定位瓶颈。
5. **展示失败样例**：检查不同类别/提示词、复杂场景、种子和分辨率下的退化；选择适合任务的 FID、CLIP 分数、人评或下游指标，不用单一指标代替全部质量判断。
6. **保留复现材料**：配置、提交版本、随机种子、设备型号、运行时版本、功耗测量方式和原始结果 CSV。

可行的第一个研究小题是：**“小型 DiT 在固定质量门槛下，采样步数与 INT8 量化的联合影响”**。先分别建立步数和量化的单变量曲线，再测试组合是否相互干扰；若运行时不支持某算子，改用受支持的模型或设备，记录这一限制。

## 五、书籍与论文阅读清单

| 类型 | 资源 | 建议用法 |
|---|---|---|
| 数学主教材 | Strang《Introduction to Linear Algebra》与 [MIT 18.06](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) | 优先矩阵、正交、特征值、SVD；边看边用 NumPy 验证 |
| 概率教材 | [Blitzstein & Hwang《Introduction to Probability》](https://probabilitybook.net/) | 条件概率、随机变量、期望、高斯；练习独立推导 |
| 机器学习参考 | [Murphy《Probabilistic Machine Learning: An Introduction》](https://probml.github.io/pml-book/book1.html) | 查概率建模、最大似然、变分推断；无需通读 |
| 深度学习主教材 | [《Dive into Deep Learning》](https://d2l.ai/) | 把章节代码改写、跑通、记录结果 |
| 深度学习理论 | [Goodfellow 等《Deep Learning》](https://www.deeplearningbook.org/) | 在 VAE、优化和表示学习处作参考 |
| 实践手册 | [PyTorch 官方教程](https://docs.pytorch.org/tutorials/) | 训练循环、自动微分、性能测量 |
| 经典论文第一组 | [Transformer](https://arxiv.org/abs/1706.03762)、[ViT](https://arxiv.org/abs/2010.11929)、[DDPM](https://arxiv.org/abs/2006.11239)、[DDIM](https://arxiv.org/abs/2010.02502) | 与第 3–4 阶段代码同步读 |
| 经典论文第二组 | [LDM](https://arxiv.org/abs/2112.10752)、[DiT](https://arxiv.org/abs/2212.09748)、[Flow Matching](https://arxiv.org/abs/2210.02747) | 先画训练与采样流程，再看推导 |
| 效率专题 | [知识蒸馏](https://arxiv.org/abs/1503.02531)、[扩散渐进蒸馏](https://arxiv.org/abs/2202.00512) | 重点看实验对照和质量—速度权衡 |

读论文按“问题—方法—假设—基线—指标—失败情况”做一页笔记；不用从引言到附录逐字读完才开始编码。

## 六、六个月后如何判断自己可以开始做课题

- 能独立训练和复现一个小 DDPM，解释噪声预测目标，比较至少两种采样设置。
- 能读 DiT/Flow Matching 的结构图，指出网络主干、时间条件、训练目标和采样器。
- 能在固定设备上测质量、完整延迟、峰值内存，说明多次测量的波动。
- 能独立提出一个可证伪问题，并设计基线与消融实验。

达到这些标准就可以进入导师课题或开放研究复现；无需先把所有生成范式、所有芯片工具链学完。后续按应用选择图像/视频、音频、科学数据或动作生成，并针对目标设备补充系统知识。
