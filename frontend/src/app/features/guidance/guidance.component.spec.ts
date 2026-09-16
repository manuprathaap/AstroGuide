import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GuidanceComponent } from './guidance.component';
import { GuidanceService } from '../../core/services/guidance.service';
import { Guidance } from '../../core/models/guidance.model';

describe('GuidanceComponent', () => {
  let component: GuidanceComponent;
  let fixture: ComponentFixture<GuidanceComponent>;
  let guidanceService: GuidanceService;

  const mockGuidanceList: Guidance[] = [
    {
      id: 1,
      user_id: 1,
      problem: 'I am seeking guidance regarding a career opportunity.',
      created_at: '2026-09-01T10:00:00Z',
      updated_at: '2026-09-01T10:00:00Z'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidanceComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    guidanceService = TestBed.inject(GuidanceService);
    vi.spyOn(guidanceService, 'getGuidanceHistory').mockReturnValue(of(mockGuidanceList));

    fixture = TestBed.createComponent(GuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the Guidance component and load history on init', () => {
    expect(component).toBeTruthy();
    expect(component.guidanceHistory().length).toBe(1);
    expect(component.currentStep()).toBe(1);
  });

  it('should update selectedCategory on selectCategory()', () => {
    component.selectCategory('Finance');
    expect(component.selectedCategory()).toBe('Finance');
    expect(component.currentCategoryItem().label).toBe('Finance');
  });

  it('should validate problem form controls according to requirements', () => {
    const control = component.problemControl;
    expect(control).toBeTruthy();

    // Required check
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    expect(control?.hasError('required')).toBeTruthy();
    expect(component.errorMessage).toBe('Please describe your problem.');

    // Min length check (< 10)
    control?.setValue('Help me');
    expect(control?.valid).toBeFalsy();
    expect(control?.hasError('minlength')).toBeTruthy();
    expect(component.errorMessage).toBe('Please enter at least 10 characters.');

    // Valid problem statement
    control?.setValue('I am seeking clarity regarding an upcoming job change.');
    expect(control?.valid).toBeTruthy();
    expect(component.errorMessage).toBeNull();
    expect(component.charCount()).toBe(54);
  });

  it('should navigate through steps correctly', () => {
    expect(component.currentStep()).toBe(1);

    component.goToStep(2);
    expect(component.currentStep()).toBe(2);

    component.goToStep(3);
    expect(component.currentStep()).toBe(3);

    // Step 3 Back -> Step 2
    component.goBack();
    expect(component.currentStep()).toBe(2);

    // Step 2 Back -> Step 1
    component.goBack();
    expect(component.currentStep()).toBe(1);
  });

  it('should submit problem, transition to step 4, and call createGuidance', () => {
    const created: Guidance = {
      id: 202,
      user_id: 1,
      problem: 'Detailed personal problem statement for consultation testing.',
      created_at: '2026-09-05T01:00:00Z',
      updated_at: '2026-09-05T01:00:00Z'
    };

    const createSpy = vi.spyOn(guidanceService, 'createGuidance').mockReturnValue(of(created));

    component.goToStep(3);
    component.problemControl?.setValue('Detailed personal problem statement for consultation testing.');
    component.onSubmitProblem();

    expect(createSpy).toHaveBeenCalledWith({
      problem: 'Detailed personal problem statement for consultation testing.'
    });
    expect(component.currentStep()).toBe(4);
    expect(component.createdGuidance()).toEqual(created);
  });
});
