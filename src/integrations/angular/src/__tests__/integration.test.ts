import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ComponentInterface, DomHelper } from '@closure-next/core';
import { ClosureComponentDirective } from '../index';
import { Component as NgComponent } from '@angular/core';
import { By } from '@angular/platform-browser';

interface TestComponentProps {
  title?: string;
}

class TestComponent extends Component {
  private title: string = '';
  public props!: TestComponentProps;
  public element: HTMLElement | null = null;
  
  public getElement(): HTMLElement | null {
    return this.element;
  }
  
  constructor() {
    super(new DomHelper(document));
    if (this.props?.title) {
      this.title = this.props.title;
    }
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

  protected createDom(): void {
    const element = document.createElement('div');
    element.setAttribute('data-testid', 'test-component');
    element.setAttribute('data-title', this.title);
    this.element = element;
    super.createDom();
  }
}

@NgComponent({
  standalone: true,
  imports: [ClosureComponentDirective],
  template: `
    <div [closureComponent]="component"
         [closureComponentProps]="props"
         data-testid="angular-wrapper">
    </div>
  `
})
class TestHostComponent {
  component = new TestComponent();
  props = { title: 'Test Title' };
}

describe('Angular Integration', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeAll(() => {
    jest.setTimeout(30000); // Increase timeout for Angular tests
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.component = new TestComponent();
    component.props = { title: 'Test Title' };
    
    await fixture.ngZone!.run(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
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

    await fixture.ngZone!.run(async () => {
      component.props = { title: 'Updated Title' };
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(element.getAttribute('data-title')).toBe('Updated Title');
    });
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
