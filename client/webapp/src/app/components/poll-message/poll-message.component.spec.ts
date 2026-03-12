import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollMessageComponent } from './poll-message.component';

describe('PollMessageComponent', () => {
  let component: PollMessageComponent;
  let fixture: ComponentFixture<PollMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
