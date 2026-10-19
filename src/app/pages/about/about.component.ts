import { Component } from '@angular/core';
import packageInfo from '../../../../package.json';
import { buildTimestamp } from '../../build-info';

@Component({
  standalone: false,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  version = packageInfo.version;
  buildTime = buildTimestamp;
}
