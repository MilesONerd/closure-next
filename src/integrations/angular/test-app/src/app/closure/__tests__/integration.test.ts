import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component as ClosureComponent, DomHelper } from '@closure-next/core';
import { ClosureComponentDirective } from '../index';
import { Component, Injectable, Inject, ElementRef, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DOM_HELPER } from '../index';
import { By } from '@angular/platform-browser';

@Injectable()
class TestComponent extends ClosureComponent {
  private title: string = '';
  protected override element: HTMLElement | null = null;
  
  constructor(@Inject(DOCUMENT) document: Document) {
    super(new DomHelper(document));
    this.element = document.createElement('div');
  }
  
  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }

  public override getElement(): HTMLElement | null {
    return this.element;
  }

  public override isInDocument(): boolean {
    return super.isInDocument();
  }

  public override getParent(): ClosureComponent | null {
    return super.getParent();
  }

  public override dispose(): void {
    super.dispose();
  }

  public override enterDocument(): void {
    super.enterDocument();
  }

  public override exitDocument(): void {
    super.exitDocument();
  }
}

@Component({
  template: `
    <div closureComponent
         [component]="component"
         [props]="props"
         data-testid="angular-wrapper">
    </div>
  `,
  imports: [ClosureComponentDirective],
  standalone: true
})
class TestHostComponent {
  component = TestComponent;
  props = { title: 'Test Title' };
}

describe('Angular Integration', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    jest.setTimeout(10000); // Increase timeout for Angular tests
    
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        TestComponent,
        { provide: DOCUMENT, useValue: document },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
        { provide: NgZone, useValue: { run: (fn: Function) => fn() } }
      ],
      teardown: { destroyAfterEach: true }
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    
    // Initial render and wait for component initialization
    await fixture.ngZone!.run(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve, 100)); // Longer timeout
      fixture.detectChanges();
      await fixture.whenStable();
    });
  });

  it('should render Closure component', () => {
    const element = fixture.nativeElement.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
  });

  it('should handle props', () => {
    const element = fixture.nativeElement.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
    expect(element.getAttribute('data-title')).toBe('Test Title');
  });

  it('should update on prop changes', async () => {
    const element = fixture.nativeElement.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();

    // Update props
    // Update props in NgZone
    await fixture.ngZone!.run(async () => {
      component.props = { title: 'Updated Title' };
      fixture.detectChanges();
      await fixture.whenStable();
    });

    // Wait for all async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(element.getAttribute('data-title')).toBe('Updated Title');
  });

  it('should clean up on destroy', async () => {
    // Get the element and directive
    const element = fixture.nativeElement.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();

    const directive = fixture.debugElement.query(By.directive(ClosureComponentDirective));
    const directiveInstance = directive.injector.get(ClosureComponentDirective);
    expect(directiveInstance.instance).toBeTruthy();

    // Set up spy before destroy
    const disposeSpy = jest.spyOn(directiveInstance.instance!, 'dispose');

    // Run destroy and wait for cleanup
    fixture.destroy();
    await fixture.whenStable();

    // Verify cleanup
    expect(disposeSpy).toHaveBeenCalled();
    expect(directiveInstance.instance).toBeNull();
  });
});
