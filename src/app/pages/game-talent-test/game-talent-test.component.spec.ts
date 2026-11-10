import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GameTalentTestComponent } from './game-talent-test.component';

describe('GameTalentTestComponent', () => {
  let fixture: ComponentFixture<GameTalentTestComponent>;
  let component: GameTalentTestComponent;
  let clock: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTalentTestComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    clock = 1000;
    spyOn(performance, 'now').and.callFake(() => clock);
    fixture = TestBed.createComponent(GameTalentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('renders the test as Angular content and starts from its button', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('iframe')).toBeNull();
    expect(root.textContent).toContain('5 项小测试');
    root.querySelector<HTMLButtonElement>('.btn')!.click();
    fixture.detectChanges();
    expect(component.screen).toBe('intro');
    expect(root.querySelector('h2')!.textContent).toBe('反应速度');
  });

  it('retries early reactions and scores five valid rounds', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0);
    component.next(); component.startTest();
    component.react(); component.react();
    tick(1200);
    expect(component.reactionTimes.length).toBe(0);
    expect(component.reactionState).toBe('show');
    for (let i = 0; i < 5; i++) {
      component.react(); tick(1200);
      clock += 150; component.react();
    }
    tick(500);
    expect(component.screen).toBe('finished');
    expect(component.results.reaction?.score).toBe(100);
  }));

  it('counts aim misses and finishes after twenty hits', () => {
    component.current = 1; component.startTest();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('#aim-arena')).not.toBeNull();
    component.missTarget(new PointerEvent('pointerdown', { clientX: 10, clientY: 10 }));
    for (let i = 0; i < 20; i++) { clock += 450; component.hitTarget(new Event('pointerdown')); }
    expect(component.screen).toBe('finished');
    expect(component.results.aim?.score).toBe(96);
    expect(component.results.aim?.raw).toContain('命中率 95%');
  });

  it('locks memory input during playback and grows the sequence after success', fakeAsync(() => {
    component.current = 2; component.startTest();
    component.selectCell(component.sequence[0]);
    expect(component.cellStates).toEqual(Array(9).fill(''));
    tick(2250);
    expect(component.accepting).toBeTrue();
    [...component.sequence].forEach(cell => component.selectCell(cell));
    expect(component.level).toBe(1);
    expect(component.sequence.length).toBe(4);
    tick(3420);
    expect(component.accepting).toBeTrue();
    component.selectCell((component.sequence[0] + 1) % 9);
    tick(1100);
    expect(component.screen).toBe('finished');
    expect(component.results.memory?.score).toBe(10);
  }));

  it('stops accepting CPS clicks at the deadline and clears delayed results on destroy', fakeAsync(() => {
    component.current = 3; component.startTest();
    component.clickSpeed(new Event('pointerdown'));
    clock += 5001;
    component.clickSpeed(new Event('pointerdown'));
    expect(component.clicks).toBe(1);
    expect(component.ended).toBeTrue();
    fixture.destroy(); tick(1000);
    expect(component.results.cps).toBeUndefined();
  }));

  it('finishes tracking and cancels its animation when the page is destroyed', fakeAsync(() => {
    component.current = 4; component.startTest();
    component.movePointer(new PointerEvent('pointermove', { clientX: 100, clientY: 100 }));
    clock += 12001; tick(20);
    expect(component.screen).toBe('finished');
    expect(component.results.track).toBeDefined();
    const cancel = spyOn(window, 'cancelAnimationFrame').and.callThrough();
    component.startTest(); fixture.destroy();
    expect(cancel).toHaveBeenCalled();
    tick(50);
  }));

  it('renders scores and a radar chart, then resets results for another attempt', () => {
    for (const test of component.tests) component.results[test.key] = { score: 80, raw: '测试结果' };
    component.current = 4; component.next(); fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(component.total).toBe(80);
    expect(root.querySelectorAll('.stat').length).toBe(5);
    expect(root.querySelector('svg[role="img"]')).not.toBeNull();
    expect(root.textContent).toContain('高端玩家');
    root.querySelector<HTMLButtonElement>('.btn')!.click();
    expect(component.results).toEqual({});
    expect(component.current).toBe(0);
    expect(component.screen).toBe('intro');
  });
});
