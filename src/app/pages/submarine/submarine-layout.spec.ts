import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SubmarineComponent } from './submarine.component';

// Measure actual browser layout: counting cells alone cannot catch Grid reflow.
function checkEndgame(root: ParentNode): void {
  const cells = Array.from(root.querySelectorAll<HTMLButtonElement>('.cell'));
  expect(cells.length).toBe(100);
  const before = cells.map(cell => cell.getBoundingClientRect());
  const fire = root.querySelector<HTMLButtonElement>('#fireBtn')!;
  const checkGeometry = () => {
    const moved = cells.flatMap((cell, index) => {
      const after = cell.getBoundingClientRect();
      return (['x', 'y', 'width', 'height'] as const)
        .filter(axis => Math.abs(after[axis] - before[index][axis]) > 0.1)
        .map(axis => `cell ${index}, ${axis}`);
    });
    expect(moved).withContext('Cell geometry must remain unchanged').toEqual([]);
    root.querySelectorAll<HTMLElement>('.subpic').forEach(ship => {
      const row = Number(ship.style.gridRowStart) - 2;
      const col = Number(ship.style.gridColumnStart) - 2;
      const height = Number(ship.style.gridRowEnd.replace('span ', ''));
      const width = Number(ship.style.gridColumnEnd.replace('span ', ''));
      const first = before[row * 10 + col];
      const last = before[(row + height - 1) * 10 + col + width - 1];
      const rect = ship.getBoundingClientRect();
      expect(rect.x).toBeCloseTo(first.x, 1);
      expect(rect.y).toBeCloseTo(first.y, 1);
      expect(rect.right).toBeCloseTo(last.right, 1);
      expect(rect.bottom).toBeCloseTo(last.bottom, 1);
    });
  };
  // Also cover sunk ships revealed during a game.
  const reveal = root.querySelector<HTMLInputElement>('#revealChk')!;
  reveal.checked = true;
  reveal.dispatchEvent(new Event('change'));
  for (let index = 0; index < cells.length && !root.querySelector('.banner.show'); index++) {
    cells[index].click();
    if (!fire.disabled) {
      fire.click();
      checkGeometry();
    }
  }
  expect(root.querySelector('#banner')!.textContent).toContain('全部潜艇已击沉');
  expect(root.querySelectorAll('.subpic').length).toBe(12);
  checkGeometry();
  root.querySelector<HTMLButtonElement>('#newBtn')!.click();
  expect(root.querySelectorAll('.subpic').length).toBe(0);
  // The same overlay path is used when revealing an unfinished fleet.
  root.querySelector<HTMLButtonElement>('#giveUpBtn')!.click();
  root.querySelector<HTMLButtonElement>('#giveUpBtn')!.click();
  expect(root.querySelectorAll('.subpic').length).toBe(12);
  checkGeometry();
}

describe('Submarine endgame layout', () => {
  it('keeps the integrated board aligned when ships appear', () => {
    TestBed.configureTestingModule({
      declarations: [SubmarineComponent],
      imports: [RouterModule.forRoot([])]
    });
    const fixture = TestBed.createComponent(SubmarineComponent);
    fixture.detectChanges();
    try {
      const style = document.createElement('style');
      style.textContent = '* { animation:none !important; transition:none !important; }';
      fixture.nativeElement.shadowRoot.appendChild(style);
      checkEndgame(fixture.nativeElement.shadowRoot);
    } finally {
      fixture.destroy();
    }
  });

  for (const width of [1200, 390]) {
    it(`keeps the standalone demo aligned at ${width}px`, async () => {
      const frame = document.createElement('iframe');
      frame.style.cssText = `width:${width}px;height:1000px;border:0;position:absolute;left:0;top:0`;
      try {
        // Only the test server serves demo assets; production output is unchanged.
        const response = await fetch('/_karma_webpack_/demo/submarine.html');
        expect(response.ok).toBeTrue();
        const html = await response.text();
        const loaded = new Promise<void>(resolve => { frame.onload = () => resolve(); });
        // Skip external fonts so offline tests measure layout without network waits.
        frame.srcdoc = html.replace(/<link\b[^>]*>/g, '').replace('</head>', '<style>* { animation:none !important; transition:none !important; }</style></head>');
        document.body.appendChild(frame);
        await loaded;
        checkEndgame(frame.contentDocument!);
      } finally {
        frame.remove();
      }
    });
  }
});
