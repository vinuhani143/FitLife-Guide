import { defaultProfile } from '@/src/store/defaults';
import { buildProfileFromForm, profileToFormState } from '@/src/lib/profileForm';

describe('profile form', () => {
  test('accepts Indian date format and numeric commas', () => {
    const result = buildProfileFromForm(
      {
        ...profileToFormState(defaultProfile),
        name: 'Anu',
        dateOfBirth: '15/08/1995',
        sex: 'female',
        heightCm: '162,5',
        weightKg: '58.2',
        waistCm: '72',
        waterGoalMl: '2200',
      },
      defaultProfile,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.dateOfBirth).toBe('1995-08-15');
    expect(result.profile.heightCm).toBe(162.5);
    expect(result.profile.weightKg).toBe(58.2);
    expect(result.profile.waistCm).toBe(72);
    expect(result.profile.waterGoalMl).toBe(2200);
  });

  test('rejects invalid dates and out-of-range measures', () => {
    expect(
      buildProfileFromForm(
        { ...profileToFormState(defaultProfile), dateOfBirth: '32/13/1995' },
        defaultProfile,
      ),
    ).toEqual({ ok: false, errorKey: 'body.dobInvalid' });

    expect(
      buildProfileFromForm(
        { ...profileToFormState(defaultProfile), heightCm: '12' },
        defaultProfile,
      ),
    ).toEqual({ ok: false, errorKey: 'body.heightInvalid' });

    expect(
      buildProfileFromForm(
        { ...profileToFormState(defaultProfile), weightKg: 'abc' },
        defaultProfile,
      ),
    ).toEqual({ ok: false, errorKey: 'body.weightInvalid' });
  });

  test('allows saving without optional measures', () => {
    const result = buildProfileFromForm(
      { ...profileToFormState(defaultProfile), name: 'Ravi', sex: 'male' },
      defaultProfile,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.name).toBe('Ravi');
    expect(result.profile.heightCm).toBeNull();
    expect(result.profile.dateOfBirth).toBeNull();
  });
});
