import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt-text',
  templateUrl: './prompt-text.component.html',
  styleUrls: ['./prompt-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptTextComponent implements OnInit {
  @Input() showPrompt: boolean = true;
  @Input() message: string = '';
  @Input() showLoading: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {

  }

}
