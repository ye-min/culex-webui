import { AfterViewInit, Component, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { mountSubmarine } from './submarine-game';

@Component({
  standalone: false,
  selector: 'app-submarine',
  templateUrl: './submarine.component.html',
  styleUrls: ['./submarine.component.css'],
  // Runtime board and report elements share the page's scoped styles.
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SubmarineComponent implements AfterViewInit, OnDestroy {
  private cleanup?: () => void;
  constructor(private host: ElementRef<HTMLElement>) {}
  ngAfterViewInit(): void {
    this.cleanup = mountSubmarine(this.host.nativeElement.shadowRoot!);
  }
  ngOnDestroy(): void { this.cleanup?.(); }
}
