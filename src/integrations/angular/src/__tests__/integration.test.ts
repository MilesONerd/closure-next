import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component as ClosureComponent, DomHelper } from '@closure-next/core';
import { Component as NgComponent } from '@angular/core';
import { ClosureComponentDirective } from '../index';

class TestComponent extends ClosureComponent {
  private title: string = '';

  constructor() {
    super(new DomHelper(document));
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.getElement()) {
      this.getElement()!.setAttribute('data-title', title);
      this.getElement()!.textContent = `Test Component Content - ${title}`;
    }
  }

  public override createDom(): void {
    if (!this.getElement()) {
      const element = document.createElement('div');
      element.className = 'test-component';
      element.setAttribute('data-title', this.title);
      element.textContent = `Test Component Content - ${this.title}`;
      this.element = element;
    }
  }
}

describe('ClosureComponentDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  @NgComponent({
    template: `
      <div [closureComponent]="component"
           [closureComponentProps]="props"
           [ssrOptions]="ssrOptions">
      </div>
    `,
    standalone: true,
    imports: [ClosureComponentDirective]
  })
  class TestHostComponent {
    component = TestComponent;
    props = { title: 'Test Title' };
    ssrOptions = {
      hydration: 'progressive' as const,
      ssr: true
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create and render closure component', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.test-component');
    expect(element).toBeTruthy();
    expect(element.getAttribute('data-title')).toBe('Test Title');
    expect(element.textContent).toBe('Test Component Content - Test Title');
  });

  it('should update component when props change', () => {
    fixture.detectChanges();
    hostComponent.props = { title: 'Updated Title' };
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.test-component');
    expect(element.getAttribute('data-title')).toBe('Updated Title');
    expect(element.textContent).toBe('Test Component Content - Updated Title');
  });

  it('should handle SSR options', () => {
    hostComponent.ssrOptions = {
      hydration: 'progressive' as const,
      ssr: true
    };
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.test-component');
    expect(element).toBeTruthy();
  });
});
