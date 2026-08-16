export type ActivityDefinition = {
  id: string;
  category:
    | 'walking'
    | 'running'
    | 'cycling'
    | 'swimming'
    | 'strength'
    | 'mobility'
    | 'stretching'
    | 'sports'
    | 'household';
  nameEn: string;
  nameTe: string;
  defaultIntensity: 'light' | 'moderate' | 'vigorous';
  met: number | null;
  metLabel: string;
  sourceReference: string;
};

export const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'walking-moderate',
    category: 'walking',
    nameEn: 'Walking, 3.0 mph',
    nameTe: 'నడక (గంటకు సుమారు 4.8 కి.మీ.)',
    defaultIntensity: 'moderate',
    met: 3.5,
    metLabel: '3.5 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, walking 3.0 mph.',
  },
  {
    id: 'walking-brisk',
    category: 'walking',
    nameEn: 'Walking, 4.0 mph',
    nameTe: 'వేగంగా నడక (గంటకు సుమారు 6.4 కి.మీ.)',
    defaultIntensity: 'moderate',
    met: 5.0,
    metLabel: '5.0 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, walking 4.0 mph.',
  },
  {
    id: 'running-6mph',
    category: 'running',
    nameEn: 'Running, 6 mph (10 min/mile)',
    nameTe: 'పరుగు (గంటకు సుమారు 9.7 కి.మీ.)',
    defaultIntensity: 'vigorous',
    met: 9.8,
    metLabel: '9.8 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, running 6 mph.',
  },
  {
    id: 'cycling-leisure',
    category: 'cycling',
    nameEn: 'Cycling, leisure, 10.0–11.9 mph',
    nameTe: 'సైకిల్ తొక్కడం (విశ్రాంతి స్థాయి)',
    defaultIntensity: 'moderate',
    met: 6.8,
    metLabel: '6.8 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, bicycling 10–11.9 mph.',
  },
  {
    id: 'swimming-leisure',
    category: 'swimming',
    nameEn: 'Swimming, leisurely',
    nameTe: 'ఈత (విశ్రాంతి స్థాయి)',
    defaultIntensity: 'moderate',
    met: 6.0,
    metLabel: '6.0 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, swimming, leisurely, not lap.',
  },
  {
    id: 'strength-general',
    category: 'strength',
    nameEn: 'Resistance training, general',
    nameTe: 'బలం సాధన (సాధారణం)',
    defaultIntensity: 'moderate',
    met: 3.5,
    metLabel: '3.5 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, resistance training, general.',
  },
  {
    id: 'mobility-general',
    category: 'mobility',
    nameEn: 'Mobility / calisthenics, light',
    nameTe: 'కదలిక సాధన (తేలిక)',
    defaultIntensity: 'light',
    met: 2.8,
    metLabel: '2.8 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, calisthenics, light.',
  },
  {
    id: 'stretching',
    category: 'stretching',
    nameEn: 'Stretching, hatha yoga',
    nameTe: 'సాగదీయడం / యోగా',
    defaultIntensity: 'light',
    met: 2.5,
    metLabel: '2.5 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, stretching, hatha yoga.',
  },
  {
    id: 'sports-general',
    category: 'sports',
    nameEn: 'Sports, general (e.g. basketball, shooting baskets)',
    nameTe: 'క్రీడలు (సాధారణం)',
    defaultIntensity: 'moderate',
    met: 4.5,
    metLabel: '4.5 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, basketball, shooting baskets.',
  },
  {
    id: 'household-cleaning',
    category: 'household',
    nameEn: 'Household cleaning, moderate',
    nameTe: '\u0c07\u0c02\u0c1f\u0c3f \u0c2a\u0c28\u0c3f (\u0c2e\u0c27\u0c4d\u0c2f\u0c38\u0c4d\u0c25\u0c02)',
    defaultIntensity: 'moderate',
    met: 3.5,
    metLabel: '3.5 METs',
    sourceReference: 'Ainsworth et al. 2011 Compendium of Physical Activities, cleaning, house, general.',
  },
];
