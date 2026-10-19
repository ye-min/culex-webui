import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { FeedDataService } from './core/services/feed-data.service';

describe('Angular 21 application integration', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
      provideHttpClientTesting(),
      { provide: FeedDataService, useValue: { getDailyWord: () => of('') } }
    ]
  }));

  it('bootstraps the NgModule application and renders navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-navbar nav')).toBeTruthy();
    expect(element.querySelector('a[href="/tools"]')).toBeTruthy();
    fixture.destroy();
  });

  it('navigates from Tools to a playable submarine game and can revisit it', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    router.navigateByUrl('/tools');
    tick();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const link = element.querySelector<HTMLAnchorElement>('a[href="/submarine"]')!;
    expect(link.textContent).toContain('潜水艇大战');
    link.click();
    tick();
    fixture.detectChanges();
    const game = element.querySelector('app-submarine')!.shadowRoot!;
    const cells = game.querySelectorAll<HTMLButtonElement>('.cell');
    const fire = game.querySelector<HTMLButtonElement>('#fireBtn')!;
    expect(cells.length).toBe(100);
    expect(fire.disabled).toBeTrue();
    cells[0].click();
    cells[1].click();
    cells[2].click();
    expect(fire.disabled).toBeFalse();
    fire.click();
    expect(game.querySelector('#roundLbl')!.textContent).toBe('第 2 轮');
    expect(game.querySelectorAll('.cell.fired').length).toBe(3);
    expect(game.querySelector('#log')!.textContent).toContain('A1  B1  C1');
    game.querySelector<HTMLButtonElement>('#giveUpBtn')!.click();
    router.navigateByUrl('/tools');
    tick();
    fixture.detectChanges();
    router.navigateByUrl('/submarine');
    tick();
    fixture.detectChanges();
    const newGame = element.querySelector('app-submarine')!.shadowRoot!;
    expect(newGame.querySelectorAll('.cell.fired').length).toBe(0);
    expect(newGame.querySelector('#roundLbl')!.textContent).toBe('第 1 轮');
    fixture.destroy();
  }));

  it('refreshes timer-driven pages with Zone.js and binds converter forms', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.autoDetectChanges();
    router.navigateByUrl('/timestamp');
    tick();
    const page = (fixture.nativeElement as HTMLElement).querySelector('app-timestamp')!;
    const before = page.querySelector('.stamp-val')!.textContent;
    tick(1000);
    expect(page.querySelector('.stamp-val')!.textContent).not.toBe(before);
    const input = page.querySelector<HTMLInputElement>('input[type="text"]')!;
    input.value = '0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    page.querySelector<HTMLButtonElement>('.converter-card .btn-primary')!.click();
    tick();
    expect(page.querySelector('.result-grid')!.textContent).toContain('1970');
    fixture.destroy();
  }));

});
