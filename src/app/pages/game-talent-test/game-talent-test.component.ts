import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

type TestKey = 'reaction' | 'aim' | 'memory' | 'cps' | 'track';
type Screen = 'home' | 'intro' | 'playing' | 'finished' | 'result';
interface Test { key: TestKey; name: string; icon: string; description: string; genre: string; }
interface Result { score: number; raw: string; }
const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const random = (min: number, max: number) => min + Math.random() * (max - min);

@Component({
  selector: 'app-game-talent-test',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-talent-test.component.html',
  styleUrls: ['./game-talent-test.component.css']
})
export class GameTalentTestComponent implements OnDestroy {
  @ViewChild('arena') private arena?: ElementRef<HTMLElement>;
  @ViewChild('trackCanvas') private trackCanvas?: ElementRef<HTMLCanvasElement>;
  readonly tests: Test[] = [
    { key: 'reaction', name: '反应速度', icon: '⚡', description: '屏幕变成绿色时立刻点击。共 5 轮，提前点击会重来这一轮。', genre: '格斗、音游这类拼反应的游戏' },
    { key: 'aim', name: '瞄准精度', icon: '🎯', description: '尽快点中 20 个靶子。点空会记为失误并扣分。', genre: '射击类（FPS）游戏，尤其是狙击和点射' },
    { key: 'memory', name: '记忆力', icon: '🧠', description: '观察方块闪烁的顺序，然后按相同顺序点击。每过一关序列加长，错一次就结束。', genre: '策略、MOBA、解谜类需要记忆和规划的游戏' },
    { key: 'cps', name: '手速', icon: '🖱️', description: '在 5 秒内尽可能快地点击按钮。第一次点击开始计时。', genre: '即时战略（RTS）、动作类需要高操作量的游戏' },
    { key: 'track', name: '动态追踪', icon: '👁️', description: '让准星一直停留在移动的小球上，持续 12 秒。小球会越来越快。手机上请按住屏幕拖动。', genre: '射击游戏中的扫射追枪、赛车类游戏' }
  ];
  screen: Screen = 'home';
  current = -1;
  results: Partial<Record<TestKey, Result>> = {};
  reactionState = 'idle';
  reactionLabel = '点击开始';
  reactionTimes: number[] = [];
  private goAt = 0;
  private reactionTimer = 0;
  hits = 0;
  misses = 0;
  elapsed = 0;
  target = { x: 0, y: 0, id: 0 };
  missDots: { x: number; y: number }[] = [];
  readonly cells = Array.from({ length: 9 }, (_, i) => i);
  sequence: number[] = [];
  level = 0;
  memoryTip = '';
  cellStates = Array<string>(9).fill('');
  accepting = false;
  private input = 0;
  clicks = 0;
  cps = 0;
  remaining = 5;
  ended = false;
  trackingPercent = 0;
  trackingProgress = 0;
  private started = 0;
  private mouse = { x: -999, y: -999 };
  private timers = new Set<number>();
  private frames = new Set<number>();

  constructor(private changeDetector: ChangeDetectorRef) {}
  get active(): Test { return this.tests[Math.max(0, Math.min(this.current, this.tests.length - 1))]; }
  get activeResult(): Result | undefined { return this.results[this.active.key]; }
  get total(): number { return Math.round(this.tests.reduce((sum, t) => sum + (this.results[t.key]?.score ?? 0), 0) / this.tests.length); }
  get ranking(): string[] {
    if (this.total >= 88) return ['S', '电竞天才', '你的各项能力已接近职业选手水平，可以认真考虑一下打比赛了！'];
    if (this.total >= 72) return ['A', '高端玩家', '天赋出众，在路人局里基本是带飞的那一个。'];
    if (this.total >= 55) return ['B', '实力玩家', '基础扎实，多加练习完全可以冲击更高段位。'];
    if (this.total >= 38) return ['C', '休闲玩家', '玩游戏图个开心，节奏不那么快的游戏会更适合你。'];
    return ['D', '快乐玩家', '技术不重要，开心最重要！'];
  }
  get ordered(): Test[] { return [...this.tests].sort((a, b) => this.score(b) - this.score(a)); }
  score(test: Test): number { return this.results[test.key]?.score ?? 0; }
  raw(test: Test): string { return (this.results[test.key]?.raw ?? '').split('，')[0].split('（')[0]; }
  radarPoint(i: number, radius: number): { x: number; y: number } {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / 5;
    return { x: 160 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius };
  }
  radarPolygon(radius: number, scores = false): string {
    return this.tests.map((test, i) => {
      const p = this.radarPoint(i, scores ? radius * Math.max(4, this.score(test)) / 100 : radius);
      return `${p.x},${p.y}`;
    }).join(' ');
  }
  restart(): void { this.results = {}; this.current = -1; this.next(); }
  next(): void {
    this.clearPending();
    this.current++;
    this.screen = this.current >= this.tests.length ? 'result' : 'intro';
  }
  startTest(): void {
    this.clearPending();
    this.screen = 'playing';
    this.started = 0;
    this.elapsed = 0;
    this.ended = false;
    switch (this.active.key) {
      case 'reaction': this.reactionTimes = []; this.reactionState = 'idle'; this.reactionLabel = '点击开始'; break;
      case 'aim':
        this.hits = this.misses = 0; this.missDots = [];
        this.changeDetector.detectChanges();
        this.started = performance.now(); this.spawnTarget(); this.aimTick(); break;
      case 'memory':
        this.sequence = []; this.level = 0; this.cellStates.fill('');
        this.addStep(); this.addStep(); this.addStep(); this.playMemory(); break;
      case 'cps': this.clicks = this.cps = 0; this.remaining = 5; break;
      case 'track':
        this.remaining = 12; this.trackingPercent = this.trackingProgress = 0;
        this.mouse = { x: -999, y: -999 };
        this.changeDetector.detectChanges(); this.startTracking(); break;
    }
  }
  private later(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => { this.timers.delete(id); callback(); }, delay);
    this.timers.add(id); return id;
  }
  private frame(callback: () => void): void {
    const id = requestAnimationFrame(() => { this.frames.delete(id); callback(); });
    this.frames.add(id);
  }
  private clearPending(): void {
    this.timers.forEach(id => clearTimeout(id)); this.timers.clear();
    this.frames.forEach(id => cancelAnimationFrame(id)); this.frames.clear();
  }
  private finish(score: number, raw: string): void {
    this.clearPending(); this.accepting = false; this.ended = true;
    this.results[this.active.key] = { score: Math.round(clamp(score)), raw };
    this.screen = 'finished';
  }
  react(): void {
    if (this.reactionState === 'idle' || this.reactionState === 'show') {
      this.reactionState = 'wait'; this.reactionLabel = '等待绿色...';
      this.reactionTimer = this.later(() => {
        this.reactionState = 'go'; this.reactionLabel = '点！'; this.goAt = performance.now();
      }, random(1200, 3800));
    } else if (this.reactionState === 'wait') {
      clearTimeout(this.reactionTimer); this.timers.delete(this.reactionTimer);
      this.reactionState = 'show'; this.reactionLabel = '太早了！点击重试本轮';
    } else if (this.reactionState === 'go') {
      const ms = Math.round(performance.now() - this.goAt);
      this.reactionTimes.push(ms);
      this.reactionLabel = `${ms} ms，点击继续`;
      this.reactionState = this.reactionTimes.length === 5 ? 'done' : 'show';
      if (this.reactionTimes.length === 5) {
        const average = Math.round(this.reactionTimes.reduce((a, b) => a + b) / 5);
        this.later(() => this.finish((450 - average) / 3, `平均反应时间 ${average} ms（${this.reactionTimes.join(' / ')}）`), 500);
      }
    }
  }
  private spawnTarget(): void {
    const rect = this.arena!.nativeElement.getBoundingClientRect();
    this.target = { x: random(30, rect.width - 30), y: random(30, rect.height - 30), id: this.hits };
  }
  hitTarget(event: Event): void {
    event.stopPropagation();
    this.hits++;
    if (this.hits === 20) {
      const total = performance.now() - this.started;
      const accuracy = Math.round(20 / (20 + this.misses) * 100);
      this.finish((1300 - total / 20) / 8.5 - this.misses * 4, `总用时 ${(total / 1000).toFixed(2)}s，平均每靶 ${Math.round(total / 20)} ms，命中率 ${accuracy}%`);
    } else this.spawnTarget();
  }
  missTarget(event: PointerEvent): void {
    this.misses++;
    const rect = this.arena!.nativeElement.getBoundingClientRect();
    this.missDots.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }
  private aimTick(): void { this.elapsed = (performance.now() - this.started) / 1000; this.frame(() => this.aimTick()); }
  private addStep(): void {
    let value: number;
    do { value = Math.floor(Math.random() * 9); } while (value === this.sequence[this.sequence.length - 1]);
    this.sequence.push(value);
  }
  private playMemory(): void {
    this.accepting = false; this.memoryTip = '仔细看...';
    const speed = Math.max(300, 550 - this.level * 20);
    this.sequence.forEach((n, i) => {
      this.later(() => this.cellStates[n] = 'on', 600 + i * speed);
      this.later(() => this.cellStates[n] = '', 600 + i * speed + speed * .65);
    });
    this.later(() => { this.accepting = true; this.input = 0; this.memoryTip = '轮到你了！'; }, 600 + this.sequence.length * speed);
  }
  selectCell(index: number): void {
    if (!this.accepting) return;
    if (index === this.sequence[this.input]) {
      this.cellStates[index] = 'ok'; this.later(() => this.cellStates[index] = '', 180);
      this.input++;
      if (this.input === this.sequence.length) {
        this.accepting = false; this.level++; this.memoryTip = '✔ 正确！';
        this.addStep(); this.later(() => this.playMemory(), 700);
      }
    } else {
      this.accepting = false; this.cellStates[index] = 'bad';
      this.cellStates[this.sequence[this.input]] = 'on'; this.memoryTip = '✘ 记错了';
      const best = this.sequence.length - 1;
      this.later(() => this.finish((best - 2) * 10, `最长记住 ${best} 步序列（通过 ${this.level} 关）`), 1100);
    }
  }
  clickSpeed(event: Event): void {
    event.preventDefault();
    if (this.ended) return;
    // Enforce the deadline even if rendering was delayed by a background tab.
    if (this.started && performance.now() - this.started >= 5000) { this.endCps(); return; }
    this.clicks++;
    if (!this.started) { this.started = performance.now(); this.cpsTick(); }
  }
  private cpsTick(): void {
    const elapsed = (performance.now() - this.started) / 1000;
    this.remaining = Math.max(0, 5 - elapsed);
    this.cps = this.clicks / Math.max(elapsed, .2);
    if (elapsed >= 5) { this.endCps(); return; }
    this.frame(() => this.cpsTick());
  }
  private endCps(): void {
    if (this.ended) return;
    this.ended = true; this.remaining = 0; this.cps = this.clicks / 5;
    this.later(() => this.finish((this.cps - 4) * 12.5, `5 秒点击 ${this.clicks} 次，平均 ${this.cps.toFixed(1)} 次/秒`), 900);
  }
  movePointer(event: PointerEvent): void {
    const canvas = this.trackCanvas!.nativeElement;
    if (event.type === 'pointerdown') canvas.setPointerCapture(event.pointerId);
    const rect = canvas.getBoundingClientRect();
    this.mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (!this.started) this.started = performance.now();
  }
  leavePointer(): void { this.mouse = { x: -999, y: -999 }; }
  private startTracking(): void {
    const canvas = this.trackCanvas!.nativeElement;
    const width = canvas.clientWidth, height = canvas.clientHeight, ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio; canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    const theme = getComputedStyle(canvas);
    const accent = theme.getPropertyValue('--c-tools').trim();
    const targetColor = theme.getPropertyValue('--c-photo').trim();
    const ink = theme.getPropertyValue('--fg').trim();
    const radius = 26;
    const ball = { x: width / 2, y: height / 2, vx: 0, vy: 0, tx: 0, ty: 0 };
    let last = 0, onTime = 0, retarget = 0;
    const draw = () => {
      const now = performance.now();
      let on = false;
      if (this.started) {
        const dt = Math.min(.05, (now - (last || this.started)) / 1000);
        last = now;
        const elapsed = (now - this.started) / 1000;
        retarget -= dt;
        if (retarget <= 0) {
          const angle = Math.random() * Math.PI * 2, speed = 140 + elapsed * 28;
          ball.tx = Math.cos(angle) * speed; ball.ty = Math.sin(angle) * speed; retarget = random(.4, 1.2);
        }
        ball.vx += (ball.tx - ball.vx) * Math.min(1, dt * 3);
        ball.vy += (ball.ty - ball.vy) * Math.min(1, dt * 3);
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.x < radius || ball.x > width - radius) { ball.vx *= -1; ball.tx *= -1; ball.x = clamp(ball.x, radius, width - radius); }
        if (ball.y < radius || ball.y > height - radius) { ball.vy *= -1; ball.ty *= -1; ball.y = clamp(ball.y, radius, height - radius); }
        on = Math.hypot(this.mouse.x - ball.x, this.mouse.y - ball.y) <= radius;
        if (on) onTime += dt;
        this.trackingPercent = Math.round(onTime / Math.max(elapsed, .01) * 100);
        this.remaining = Math.max(0, 12 - elapsed); this.trackingProgress = clamp(elapsed / 12 * 100);
        if (elapsed >= 12) {
          const percent = onTime / 12 * 100;
          this.finish((percent - 25) / .6, `准星停留在目标上的时间占比 ${percent.toFixed(1)}%`); return;
        }
      }
      ctx.clearRect(0, 0, width, height); ctx.beginPath(); ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = on ? accent : targetColor; ctx.fill();
      if (this.mouse.x > -999) {
        const { x, y } = this.mouse;
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(x - 12, y); ctx.lineTo(x - 4, y); ctx.moveTo(x + 4, y); ctx.lineTo(x + 12, y);
        ctx.moveTo(x, y - 12); ctx.lineTo(x, y - 4); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 12); ctx.stroke();
      }
      this.frame(draw);
    };
    draw();
  }
  ngOnDestroy(): void { this.clearPending(); }
}
